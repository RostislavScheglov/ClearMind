import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testUser = await prisma.user.upsert({
    where: { googleId: 'test-google-id' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      googleId: 'test-google-id',
      onboardingComplete: true,
      intent: 'anxiety',
      notificationPref: 'morning',
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      stripeCustomerId: 'cus_test_123',
      tier: 'free',
      status: 'active',
    },
  });

  const now = new Date();

  await prisma.moodEntry.createMany({
    data: [
      {
        userId: testUser.id,
        score: 6,
        intent: 'anxiety',
        context: 'Morning check-in',
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        userId: testUser.id,
        score: 7,
        intent: 'anxiety',
        context: 'After journaling',
        createdAt: now,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seed completed: test user, subscription, and mood entries created.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
