import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BrainLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left hemisphere */}
      <path
        d="M50 20 C38 20, 22 30, 22 45 C22 52, 26 58, 30 62 C34 66, 36 72, 36 78 L50 78 L50 20Z"
        fill="#e0f2fe"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Left top bump */}
      <path
        d="M50 20 C44 14, 30 14, 26 24"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Right hemisphere */}
      <path
        d="M50 20 C62 20, 78 30, 78 45 C78 52, 74 58, 70 62 C66 66, 64 72, 64 78 L50 78 L50 20Z"
        fill="#bae6fd"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right top bump */}
      <path
        d="M50 20 C56 14, 70 14, 74 24"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Left folds */}
      <path d="M28 38 C34 36, 42 40, 50 38" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M26 50 C34 48, 42 54, 50 52" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M30 62 C36 60, 44 64, 50 62" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Right folds */}
      <path d="M72 38 C66 36, 58 40, 50 38" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M74 50 C66 48, 58 54, 50 52" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M70 62 C64 60, 56 64, 50 62" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Sparkle dots */}
      <circle cx="16" cy="28" r="2" fill="#38bdf8" opacity="0.6" />
      <circle cx="84" cy="30" r="1.5" fill="#38bdf8" opacity="0.5" />
      <circle cx="14" cy="58" r="1.5" fill="#7dd3fc" opacity="0.4" />
      <circle cx="86" cy="56" r="2" fill="#7dd3fc" opacity="0.5" />
    </svg>
  );
}

const features = [
  { icon: '💬', text: 'AI-guided reflection sessions' },
  { icon: '📊', text: 'Mood tracking & trends' },
  { icon: '🌬️', text: 'Breathing exercises' },
  { icon: '🏋️', text: 'Anxiety relief exercise library' },
  { icon: '✨', text: 'Personalized behavioral insights' },
  { icon: '🚨', text: 'Panic button — instant crisis support' },
];

export function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="max-w-sm w-full text-center">
        <BrainLogo className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">ClearMind</h1>
        <p className="text-gray-500 mb-6">
          Your daily mental clarity companion. Quick AI-guided reflections that
          feel like talking to someone.
        </p>

        <div className="text-left bg-white/60 rounded-xl p-4 mb-6 space-y-2">
          {features.map((f) => (
            <div key={f.text} className="flex items-center gap-2 text-sm text-gray-600">
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={handleGoogleLogin}>
          Continue with Google
        </Button>
        <p className="text-xs text-gray-400 mt-4">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
