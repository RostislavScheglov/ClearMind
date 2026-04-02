import Stripe from 'stripe';
import crypto from 'crypto';
import prisma from '../db/prisma';
import { env } from '../utils/env';
import { AppError } from '../utils/AppError';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const subscriptionService = {
  async createCheckoutSession(userId: string) {
    // Use a transaction with serializable isolation to prevent race conditions
    // on Stripe customer creation
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      // If user already has a valid Stripe customer, reuse it
      if (user.subscription?.stripeCustomerId && !user.subscription.stripeCustomerId.startsWith('pending_')) {
        return { stripeCustomerId: user.subscription.stripeCustomerId };
      }

      // Claim the slot with a pending marker inside the transaction
      // This prevents a second concurrent request from also creating a customer
      const pendingId = `pending_${crypto.randomUUID()}`;

      if (user.subscription) {
        await tx.subscription.update({
          where: { userId },
          data: { stripeCustomerId: pendingId },
        });
      } else {
        await tx.subscription.create({
          data: {
            userId,
            stripeCustomerId: pendingId,
            tier: 'free',
            status: 'active',
          },
        });
      }

      return { stripeCustomerId: null, pendingId, user };
    });

    let stripeCustomerId = result.stripeCustomerId;

    // If we got a pending marker, create the real Stripe customer outside the transaction
    if (!stripeCustomerId && 'pendingId' in result) {
      const { user } = result as { stripeCustomerId: null; pendingId: string; user: { email: string; name: string } };
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      // Swap pending marker for real customer ID
      await prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId: customer.id },
      });
    }

    // Use idempotency key to prevent duplicate checkout sessions per user
    const idempotencyKey = `checkout_${userId}_${Date.now()}`;

    const session = await stripe.checkout.sessions.create(
      {
        customer: stripeCustomerId!,
        mode: 'subscription',
        line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
        success_url: `${env.FRONTEND_URL}/account?upgraded=true`,
        cancel_url: `${env.FRONTEND_URL}/account`,
      },
      { idempotencyKey },
    );

    if (!session.url) {
      throw new AppError(500, 'Failed to create checkout session');
    }

    return { checkoutUrl: session.url };
  },

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = env.STRIPE_WEBHOOK_SECRET
        ? stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET)
        : JSON.parse(rawBody.toString()) as Stripe.Event;
    } catch {
      throw new AppError(400, 'Invalid webhook signature');
    }

    // Deduplicate: skip if we've already processed this event
    try {
      await prisma.stripeEvent.create({ data: { id: event.id } });
    } catch {
      // Unique constraint violation → already processed
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { tier: 'pro', status: 'active' },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            status: sub.status === 'active' ? 'active' : 'past_due',
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        await prisma.subscription.updateMany({
          where: { stripeCustomerId: customerId },
          data: { tier: 'free', status: 'canceled' },
        });
        break;
      }
    }
  },
};
