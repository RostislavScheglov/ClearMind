import { useState } from 'react';
import { Button } from '../ui/Button';
import type { OnboardingInput } from '@shared/schemas/onboarding.schema';

type Intent = OnboardingInput['intent'];
type NotifPref = OnboardingInput['notificationPref'];

interface OnboardingStepperProps {
  onComplete: (data: OnboardingInput) => void;
  isSubmitting: boolean;
}

const INTENTS: { value: Intent; label: string; emoji: string }[] = [
  { value: 'anxiety', label: 'Anxiety & Overthinking', emoji: '😰' },
  { value: 'sleep', label: 'Sleep & Rest', emoji: '😴' },
  { value: 'focus', label: 'Focus & Clarity', emoji: '🎯' },
];

const MOODS = ['😔', '😕', '😐', '🙂', '😊'];

export function OnboardingStepper({ onComplete, isSubmitting }: OnboardingStepperProps) {
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent | ''>('');
  const [moodScore, setMoodScore] = useState(5);
  const [notificationPref, setNotificationPref] = useState<NotifPref>('morning');

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="max-w-md mx-auto">
      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary-600' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Welcome */}
      {step === 0 && (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to ClearMind 🧠</h1>
          <p className="text-gray-600 mb-4">
            Your daily mental clarity companion. Quick 2–5 minute AI-guided
            reflections that feel like talking to someone — not blank journaling.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-8 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span>🚨</span>
              <span className="font-semibold text-red-700 text-sm">Panic Button</span>
            </div>
            <p className="text-sm text-red-600">
              Having a panic attack? Hit the Panic Button for instant AI crisis
              support with guided breathing — available with Pro.
            </p>
          </div>
          <Button size="lg" onClick={next}>
            Get Started
          </Button>
        </div>
      )}

      {/* Step 1: Intent selection */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">What brings you here?</h2>
          <p className="text-gray-500 mb-6">Choose what you'd like to work on most</p>
          <div className="flex flex-col gap-3">
            {INTENTS.map((item) => (
              <button
                key={item.value}
                onClick={() => setIntent(item.value)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-colors ${
                  intent === item.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={back}>Back</Button>
            <Button onClick={next} disabled={!intent}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 2: Mood */}
      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">How are you feeling right now?</h2>
          <p className="text-gray-500 mb-6">This helps us personalize your experience</p>
          <div className="flex justify-between items-center px-4 mb-4">
            {MOODS.map((emoji, i) => {
              const score = (i + 1) * 2;
              return (
                <button
                  key={i}
                  onClick={() => setMoodScore(score)}
                  className={`text-3xl p-2 rounded-full transition-transform ${
                    moodScore === score ? 'scale-125 ring-2 ring-primary-400' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
          <p className="text-center text-sm text-gray-400 mb-6">{moodScore}/10</p>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={back}>Back</Button>
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 3: Notification pref */}
      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">When do you reflect best?</h2>
          <p className="text-gray-500 mb-6">We'll remind you at this time</p>
          <div className="flex gap-3">
            {([
              { value: 'morning' as const, label: '🌅 Morning', desc: 'Start your day with clarity' },
              { value: 'evening' as const, label: '🌙 Evening', desc: 'Unwind and process the day' },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setNotificationPref(opt.value)}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-colors ${
                  notificationPref === opt.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-lg font-medium">{opt.label}</div>
                <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="ghost" onClick={back}>Back</Button>
            <Button onClick={next}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 4: Soft paywall */}
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Your first session is ready! ✨</h2>
          <p className="text-gray-500 mb-6">
            Try 3 free reflection sessions. Upgrade anytime for unlimited
            sessions, AI-powered insights, and the 🚨 Panic Button for
            instant crisis support with guided breathing.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Free</span>
              <span className="text-sm text-gray-500">€0/month</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 3 reflection sessions</li>
              <li>✓ 3 messages per session</li>
              <li>✓ Mood tracking</li>
              <li className="text-gray-400">✗ AI insights</li>
              <li className="text-gray-400">✗ 🚨 Panic Button</li>
            </ul>
          </div>
          <div className="bg-primary-50 rounded-xl p-4 mb-6 text-left border border-primary-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-primary-700">Pro</span>
              <span className="text-sm text-primary-600">€5/month</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Unlimited sessions</li>
              <li>✓ Unlimited messages</li>
              <li>✓ Mood tracking</li>
              <li>✓ AI-powered insights</li>
              <li>✓ 🚨 Panic Button — instant crisis support</li>
            </ul>
          </div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => { if (intent) onComplete({ intent, moodScore, notificationPref }); }}
            isLoading={isSubmitting}
          >
            Start Free
          </Button>
        </div>
      )}
    </div>
  );
}
