export const FREE_SESSION_LIMIT = 3;
export const FREE_MESSAGE_LIMIT = 3;
export const MOOD_MIN = 1;
export const MOOD_MAX = 10;
export const INTENTS = ['anxiety', 'sleep', 'focus'] as const;
export type Intent = (typeof INTENTS)[number];

export const SUBSCRIPTION_TIERS = ['free', 'pro'] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export const SUBSCRIPTION_STATUSES = ['active', 'canceled', 'past_due'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const NOTIFICATION_PREFS = ['morning', 'evening'] as const;
export type NotificationPref = (typeof NOTIFICATION_PREFS)[number];

export const MESSAGE_ROLES = ['user', 'assistant'] as const;
export type MessageRole = (typeof MESSAGE_ROLES)[number];

/** Suggested starter questions mapped to onboarding intent */
export const SUGGESTED_QUESTIONS: Record<Intent, string[]> = {
  anxiety: [
    'I keep worrying about things I can\'t control. How do I stop?',
    'My mind races at night and I can\'t relax. What can I do?',
    'I feel anxious in social situations. Can you help me?',
    'How do I deal with overthinking every decision?',
    'I had a panic attack recently. What should I know?',
    'What\'s a quick technique to calm down when I feel overwhelmed?',
  ],
  sleep: [
    'I can\'t fall asleep even when I\'m exhausted. Why?',
    'I keep waking up in the middle of the night. What helps?',
    'How do I stop my brain from racing at bedtime?',
    'What\'s a good wind-down routine before sleep?',
    'I rely on my phone to fall asleep. Is that bad?',
    'How does stress affect my sleep quality?',
  ],
  focus: [
    'I can\'t concentrate on anything for more than a few minutes.',
    'How do I stop procrastinating on important tasks?',
    'I feel mentally foggy all the time. What\'s going on?',
    'How do I prioritize when everything feels urgent?',
    'What mindfulness techniques help with focus?',
    'I get distracted by my phone constantly. How do I break the habit?',
  ],
};
