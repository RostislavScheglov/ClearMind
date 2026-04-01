import { Router } from 'express';
import { subscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import express from 'express';

const router = Router();

router.post('/subscribe', authMiddleware, subscriptionController.createCheckout);

// Stripe webhook — needs raw body, no auth middleware
router.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  subscriptionController.handleWebhook
);

export default router;
