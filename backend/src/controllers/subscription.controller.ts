import { Request, Response } from 'express';
import { subscriptionService } from '../services/subscription.service';
import { catchAsync } from '../utils/catchAsync';

export const subscriptionController = {
  createCheckout: catchAsync(async (req: Request, res: Response) => {
    const data = await subscriptionService.createCheckoutSession(req.user!.id);
    res.json(data);
  }),

  handleWebhook: catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    await subscriptionService.handleWebhook(req.body as Buffer, signature);
    res.json({ received: true });
  }),
};
