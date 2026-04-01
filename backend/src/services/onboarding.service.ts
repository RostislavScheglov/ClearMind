import prisma from '../db/prisma';
import type { PrismaClient } from '@prisma/client';

type TxClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

interface OnboardingData {
  intent: string;
  moodScore: number;
  notificationPref: string;
}

export const onboardingService = {
  async complete(userId: string, data: OnboardingData) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.$transaction(async (tx: TxClient) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: {
          intent: data.intent,
          notificationPref: data.notificationPref,
          onboardingComplete: true,
        },
      });

      // Avoid duplicate onboarding mood entry for today
      const existingMood = await tx.moodEntry.findFirst({
        where: {
          userId,
          context: 'onboarding',
          createdAt: { gte: today },
        },
      });

      if (!existingMood) {
        await tx.moodEntry.create({
          data: {
            userId,
            score: data.moodScore,
            intent: data.intent,
            context: 'onboarding',
          },
        });
      }

      // Create free subscription if none exists
      const existingSub = await tx.subscription.findUnique({
        where: { userId },
      });

      if (!existingSub) {
        await tx.subscription.create({
          data: {
            userId,
            stripeCustomerId: `pending_${userId}`,
            tier: 'free',
            status: 'active',
          },
        });
      }

      return user;
    });
  },
};
