import prisma from '../db/prisma';
import { AppError } from '../utils/AppError';
import { getAIProvider } from './ai/ai.factory';
import { FREE_SESSION_LIMIT } from '@shared/constants';

const SAFETY_GUARDRAIL = `SAFETY RULES (always follow):
- If the user expresses suicidal ideation, self-harm, or immediate danger, respond with empathy and urgency. Recommend they contact a crisis helpline (e.g., 988 Suicide & Crisis Lifeline in the US, or their local equivalent). Do NOT attempt to handle a crisis on your own.
- Never provide medical diagnoses, prescribe medication, or replace professional therapy.
- If asked about medication or dosage, redirect the user to their prescribing physician or psychiatrist.
- Always remind the user that you are an AI companion and not a licensed therapist when clinically relevant.`;

const PROFESSIONAL_RULES = `PERSONA & CLINICAL APPROACH:
- You are ClearMind, an AI mental wellness companion modeled after a licensed clinical psychologist with expertise in Cognitive Behavioral Therapy (CBT) and mindfulness-based approaches.
- Communicate with warmth, empathy, and professionalism — like a trusted therapist who genuinely cares.
- Use evidence-based therapeutic techniques: cognitive reframing, grounding exercises, thought challenging, behavioral activation, guided breathing, and reflective listening.
- Validate the user's emotions before offering guidance. Never dismiss or minimize their feelings.
- Use open-ended questions to help the user explore their thoughts and feelings (e.g., "What do you think might be behind that feeling?").
- Gently challenge cognitive distortions (catastrophizing, black-and-white thinking, mind-reading) when you notice them, but always with compassion.
- Suggest small, actionable steps rather than overwhelming the user with advice.
- Keep responses concise (2–5 sentences). Ask ONE follow-up question to deepen reflection.
- Maintain a calm, grounded tone even when the user is distressed.
- Remember context from earlier in the conversation and reference it to show you're actively listening.
- Do NOT use clinical jargon unless explaining a concept to the user in simple terms.`;

const INTENT_PROMPTS: Record<string, string> = {
  anxiety: `FOCUS AREA — Anxiety & Overthinking:
- Help the user identify anxious thought patterns and gently guide them toward cognitive reframing.
- Offer grounding techniques (5-4-3-2-1 sensory exercise, box breathing) when the user feels overwhelmed.
- Explore the difference between productive worry and rumination.
- Help the user challenge "what if" thinking and catastrophizing.`,

  sleep: `FOCUS AREA — Sleep & Rest:
- Help the user identify thoughts, habits, or stressors that interfere with sleep.
- Suggest sleep hygiene practices and wind-down routines grounded in CBT-I (Cognitive Behavioral Therapy for Insomnia).
- Offer relaxation techniques: progressive muscle relaxation, body scans, guided imagery.
- Explore the connection between daytime stress and nighttime restlessness.`,

  focus: `FOCUS AREA — Focus & Clarity:
- Help the user identify sources of mental clutter, distraction, or decision fatigue.
- Guide them through prioritization exercises and intention-setting.
- Offer mindfulness techniques for present-moment awareness.
- Explore underlying emotional blocks that may be impairing concentration.`,
};

function buildSystemPrompt(intent: string | null): string {
  const intentBlock = intent && INTENT_PROMPTS[intent]
    ? INTENT_PROMPTS[intent]
    : 'The user has not specified a focus area. Help them explore their emotions and identify what matters most to them right now.';

  return `${PROFESSIONAL_RULES}\n\n${intentBlock}\n\n${SAFETY_GUARDRAIL}`;
}

export const sessionService = {
  async createSession(userId: string) {
    // Check quota
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.tier === 'free') {
      const sessionCount = await prisma.session.count({ where: { userId } });
      if (sessionCount >= FREE_SESSION_LIMIT) {
        throw new AppError(402, 'Session limit reached. Upgrade to Pro for unlimited sessions.');
      }
    }

    return prisma.session.create({
      data: { userId },
    });
  },

  async listSessions(userId: string, limit: number, offset: number) {
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        _count: { select: { messages: true } },
      },
    });

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      title: s.title,
      createdAt: s.createdAt.toISOString(),
      messageCount: s._count.messages,
    }));
  },

  async getSession(sessionId: string, userId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!session) {
      throw new AppError(404, 'Session not found');
    }
    if (session.userId !== userId) {
      throw new AppError(403, 'Access denied');
    }

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      createdAt: session.createdAt.toISOString(),
      messages: session.messages.map((m) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  },

  async sendMessage(sessionId: string, userId: string, content: string) {
    // Verify ownership
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new AppError(404, 'Session not found');
    }
    if (session.userId !== userId) {
      throw new AppError(403, 'Access denied');
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: { sessionId, role: 'user', content },
    });

    // Auto-set title from first message
    if (!session.title) {
      await prisma.session.update({
        where: { id: sessionId },
        data: { title: content.substring(0, 80) },
      });
    }

    // Get conversation history (limit to last 20 for token management)
    const allMessages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: { role: true, content: true },
    });

    // Get user intent for system prompt
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { intent: true },
    });

    const systemPrompt = buildSystemPrompt(user?.intent ?? null);

    try {
      const aiProvider = getAIProvider();
      const aiResponse = await aiProvider.chat(
        allMessages.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt
      );

      const assistantMessage = await prisma.message.create({
        data: { sessionId, role: 'assistant', content: aiResponse },
      });

      return {
        userMessage: {
          id: userMessage.id,
          sessionId: userMessage.sessionId,
          role: userMessage.role,
          content: userMessage.content,
          createdAt: userMessage.createdAt.toISOString(),
        },
        assistantMessage: {
          id: assistantMessage.id,
          sessionId: assistantMessage.sessionId,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt.toISOString(),
        },
      };
    } catch (err) {
      // User message is saved even if AI fails — not lost
      if (err instanceof AppError) throw err;
      throw new AppError(503, 'AI service unavailable. Your message was saved.');
    }
  },
};
