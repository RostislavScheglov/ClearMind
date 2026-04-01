import jwt from 'jsonwebtoken';
import { env } from '../utils/env';
import { AppError } from '../utils/AppError';
import prisma from '../db/prisma';

export const authService = {
  issueToken(user: { id: string; email: string }): string {
    return jwt.sign({ sub: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: '7d',
    });
  },

  verifyToken(token: string): { sub: string; email: string } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as { sub: string; email: string };
    } catch {
      throw new AppError(401, 'Invalid or expired token');
    }
  },

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingComplete: true,
        intent: true,
        notificationPref: true,
        createdAt: true,
        subscription: {
          select: {
            tier: true,
            status: true,
            currentPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        onboardingComplete: user.onboardingComplete,
        intent: user.intent,
        notificationPref: user.notificationPref,
        createdAt: user.createdAt.toISOString(),
      },
      subscription: user.subscription
        ? {
            tier: user.subscription.tier,
            status: user.subscription.status,
            currentPeriodEnd: user.subscription.currentPeriodEnd?.toISOString() ?? null,
          }
        : null,
    };
  },
};
