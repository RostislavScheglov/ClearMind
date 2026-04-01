import { z } from 'zod';
import { MOOD_MIN, MOOD_MAX } from '../constants';

export const onboardingSchema = z.object({
  intent: z.enum(['anxiety', 'sleep', 'focus']),
  moodScore: z.number().int().min(MOOD_MIN).max(MOOD_MAX),
  notificationPref: z.enum(['morning', 'evening']),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
