import { Button } from '../components/ui/Button';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4">
      <div className="max-w-sm w-full text-center">
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
