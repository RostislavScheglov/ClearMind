import prisma from '../db/prisma';

interface LogMoodInput {
  score: number;
  intent?: string;
  context?: string;
}

export const moodService = {
  async logMood(userId: string, data: LogMoodInput) {
    const entry = await prisma.moodEntry.create({
      data: {
        userId,
        score: data.score,
        intent: data.intent ?? null,
        context: data.context ?? null,
      },
    });

    return {
      id: entry.id,
      userId: entry.userId,
      score: entry.score,
      intent: entry.intent,
      context: entry.context,
      createdAt: entry.createdAt.toISOString(),
    };
  },

  async getTimeline(userId: string, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (entries.length === 0) {
      return { entries: [], averageScore: null, trend: null };
    }

    const scores = entries.map((e) => e.score);
    const averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

    // Compute trend: compare last 7 days avg vs previous 7 days avg
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentEntries = entries.filter((e) => e.createdAt >= sevenDaysAgo);
    const olderEntries = entries.filter(
      (e) => e.createdAt >= fourteenDaysAgo && e.createdAt < sevenDaysAgo
    );

    let trend: 'improving' | 'declining' | 'stable' | null = null;
    if (recentEntries.length > 0 && olderEntries.length > 0) {
      const recentAvg =
        recentEntries.reduce((a, b) => a + b.score, 0) / recentEntries.length;
      const olderAvg =
        olderEntries.reduce((a, b) => a + b.score, 0) / olderEntries.length;
      const diff = recentAvg - olderAvg;
      trend = diff > 0.5 ? 'improving' : diff < -0.5 ? 'declining' : 'stable';
    }

    return {
      entries: entries.map((e) => ({
        id: e.id,
        userId: e.userId,
        score: e.score,
        intent: e.intent,
        context: e.context,
        createdAt: e.createdAt.toISOString(),
      })),
      averageScore,
      trend,
    };
  },
};
