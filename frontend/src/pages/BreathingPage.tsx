import { Link, Navigate } from 'react-router-dom';
import { BreathingExercise } from '../components/breathing/BreathingExercise';
import { useAuthStore } from '../store/authStore';

export function BreathingPage() {
  const { subscription } = useAuthStore();

  if (subscription?.tier !== 'pro') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col z-50">
      {/* Top bar */}
      <div className="flex items-center p-4">
        <Link
          to="/"
          className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-1"
        >
          ← Back
        </Link>
      </div>

      {/* Centered exercise */}
      <div className="flex-1 flex items-center justify-center px-4">
        <BreathingExercise />
      </div>
    </div>
  );
}
