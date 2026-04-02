import Stripe from 'stripe';
import prisma from '../db/prisma';
import { env } from '../utils/env';
import { AppError } from '../utils/AppError';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const subscriptionService = {
  async createCheckoutSession(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId;

    // Create Stripe customer if needed
    if (!stripeCustomerId || stripeCustomerId.startsWith('pending_')) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;

      // Update or create subscription record with real Stripe customer ID
      if (user.subscription) {
        await prisma.subscription.update({
          where: { userId },
          data: { stripeCustomerId },
        });
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            stripeCustomerId,
            tier: 'free',
            status: 'active',
          },
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${env.FRONTEND_URL}/account?upgraded=true`,
      cancel_url: `${env.FRONTEND_URL}/account`,
    });

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
