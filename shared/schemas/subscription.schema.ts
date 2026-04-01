import { z } from 'zod';

export const checkoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
});

export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>;
