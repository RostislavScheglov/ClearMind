import { z } from 'zod';

export const googleAuthCallbackSchema = z.object({
  token: z.string().min(1),
});

export const meResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    onboardingComplete: z.boolean(),
    intent: z.string().nullable(),
    notificationPref: z.string().nullable(),
    createdAt: z.string(),
  }),
  subscription: z
    .object({
      tier: z.enum(['free', 'pro']),
      status: z.enum(['active', 'canceled', 'past_due']),
      currentPeriodEnd: z.string().nullable(),
    })
    .nullable(),
});
