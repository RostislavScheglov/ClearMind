import { z } from 'zod';
import { MOOD_MIN, MOOD_MAX } from '../constants';

export const logMoodSchema = z.object({
  score: z.number().int().min(MOOD_MIN).max(MOOD_MAX),
  intent: z.enum(['anxiety', 'sleep', 'focus']).optional(),
  context: z.string().max(200).optional(),
});

export const moodTimelineQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

export type LogMoodInput = z.infer<typeof logMoodSchema>;
export type MoodTimelineQuery = z.infer<typeof moodTimelineQuerySchema>;
