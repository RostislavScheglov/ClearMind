export interface User {
  id: string;
  email: string;
  name: string;
  googleId: string;
  onboardingComplete: boolean;
  intent: string | null;
  notificationPref: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  messageCount?: number;
  messages?: Message[];
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  score: number;
  intent: string | null;
  context: string | null;
  createdAt: string;
}

export interface MoodTimeline {
  entries: MoodEntry[];
  averageScore: number | null;
  trend: 'improving' | 'declining' | 'stable' | null;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  tier: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string | null;
}

export interface MeResponse {
  user: Omit<User, 'googleId' | 'updatedAt'>;
  subscription: Pick<Subscription, 'tier' | 'status' | 'currentPeriodEnd'> | null;
}

export interface InsightsResponse {
  insights: string[];
  message?: string;
}
