import { z } from 'zod';

export const insightsResponseSchema = z.object({
  insights: z.array(z.string()),
  message: z.string().optional(),
});

export type InsightsResponse = z.infer<typeof insightsResponseSchema>;
