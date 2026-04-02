import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function BrainLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Left hemisphere */}
      <path
        d="M32 8C22 8 14 16 14 26c0 5 2 9.5 5 13 2 2.3 3 5 3 8v5h10V26"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#e0f2fe"
      />
      {/* Right hemisphere */}
      <path
        d="M32 8c10 0 18 8 18 18 0 5-2 9.5-5 13-2 2.3-3 5-3 8v5H32V26"
        stroke="#0ea5e9"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#bae6fd"
      />
      {/* Center line */}
      <line x1="32" y1="8" x2="32" y2="52" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
      {/* Left folds */}
      <path d="M20 20c4 0 8 3 12 3" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M18 30c5-1 9 2 14 2" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Right folds */}
      <path d="M44 20c-4 0-8 3-12 3" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M46 30c-5-1-9 2-14 2" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Sparkle dots for "clarity" */}
      <circle cx="10" cy="12" r="1.5" fill="#38bdf8" opacity="0.6" />
      <circle cx="54" cy="14" r="1" fill="#38bdf8" opacity="0.5" />
      <circle cx="8" cy="34" r="1" fill="#7dd3fc" opacity="0.4" />
      <circle cx="56" cy="32" r="1.5" fill="#7dd3fc" opacity="0.5" />
    </svg>
  );
}

export function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="max-w-sm w-full text-center">
        <BrainLogo className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">ClearMind</h1>
        <p className="text-gray-500 mb-8">
          Your daily mental clarity companion. Quick AI-guided reflections that
          feel like talking to someone.
        </p>
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
