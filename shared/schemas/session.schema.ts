import { z } from 'zod';

export const createSessionSchema = z.object({}).optional();

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
});

export const sessionParamsSchema = z.object({
  id: z.string().uuid(),
});

export const sessionsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type SessionsQuery = z.infer<typeof sessionsQuerySchema>;
