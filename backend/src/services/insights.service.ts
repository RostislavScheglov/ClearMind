import prisma from '../db/prisma';
import { AppError } from '../utils/AppError';
import { getAIProvider } from './ai/ai.factory';

export const insightsService = {
  async getInsights(userId: string) {
    // Check subscription tier
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.tier === 'free') {
      throw new AppError(402, 'Upgrade to Pro to unlock AI insights');
    }

    // Gather data
    const [moodEntries, sessions] = await Promise.all([
      prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 10,
          },
        },
      }),
    ]);

    const totalSessions = await prisma.session.count({ where: { userId } });

    if (totalSessions < 3) {
      return {
        insights: [],
        message: 'Complete at least 3 sessions to unlock personalized insights.',
      };
    }

    // Build summary for AI
    const moodSummary = moodEntries
      .map((e) => `Score: ${e.score}/10 on ${e.createdAt.toLocaleDateString()}${e.context ? ` (${e.context})` : ''}`)
      .join('; ');

    const sessionSummary = sessions
      .map((s) => {
        const userMsgs = s.messages
          .filter((m) => m.role === 'user')
          .map((m) => m.content.substring(0, 100))
          .join(' | ');
        return `Session "${s.title || 'Untitled'}": ${userMsgs}`;
      })
      .join('; ');

    const systemPrompt = `You are an insightful mental wellness analyst. Given this user data:
Mood entries: ${moodSummary}
Session topics: ${sessionSummary}

Generate 2-3 short, specific behavioral insights about this user's patterns. 
Examples: "You tend to feel calmer after evening reflections" or "Your anxiety peaks early in the week."
Return ONLY a JSON array of strings. No other text.`;

    try {
      const aiProvider = getAIProvider();
      const response = await aiProvider.chat([], systemPrompt);

      try {
        const parsed = JSON.parse(response);
        if (Array.isArray(parsed) && parsed.every((item: unknown) => typeof item === 'string')) {
          return { insights: parsed };
        }
      } catch {
        // Fallback: treat raw text as single insight
      }

      return { insights: [response] };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(503, 'Insights temporarily unavailable');
    }
  },
};
