import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCreateSession } from '../api/sessions';
import { MoodCheckinWidget } from '../components/mood/MoodCheckinWidget';
import { MoodTimeline } from '../components/mood/MoodTimeline';
import { InsightsPanel } from '../components/insights/InsightsPanel';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PaywallModal } from '../components/billing/PaywallModal';

export function DashboardPage() {
  const { user, subscription } = useAuthStore();
  const navigate = useNavigate();
  const createSession = useCreateSession();
  const [showPaywall, setShowPaywall] = useState(false);

  const handlePanic = () => {
    if (subscription?.tier === 'pro') {
      navigate('/panic');
    } else {
      setShowPaywall(true);
    }
  };

  const handleNewSession = () => {
    createSession.mutate(undefined, {
      onSuccess: (data) => {
        navigate(`/chat/${data.id}`);
      },
    });
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {greeting()}{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">Ready for a quick reflection?</p>
      </div>

      {/* Panic Button — highly visible */}
      <button
        onClick={handlePanic}
        className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-[0.98] transition-all shadow-lg shadow-red-200 p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">🚨</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">Panic Button</h3>
            <p className="text-sm text-red-100">Instant AI crisis support + guided breathing</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            {subscription?.tier !== 'pro' && (
              <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">PRO</span>
            )}
            <span className="text-white font-bold text-xl">SOS</span>
          </div>
        </div>
      </button>

      <Card onClick={handleNewSession}>
        <div className="flex items-center gap-4">
          <span className="text-3xl">💬</span>
          <div className="flex-1">
            <h3 className="font-semibold">Start a reflection session</h3>
            <p className="text-sm text-gray-500">2–5 minute AI-guided conversation</p>
          </div>
          <Button isLoading={createSession.isPending}>Start</Button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => navigate('/breathing')}>
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <span className="text-3xl">🌬️</span>
            <div>
              <h3 className="font-semibold">Breathing Exercise</h3>
              <p className="text-xs text-gray-500">4-7-8 calming technique</p>
            </div>
          </div>
        </Card>
        <Card onClick={() => navigate('/exercises')}>
          <div className="flex flex-col items-center text-center gap-2 py-2">
            <span className="text-3xl">🏋️</span>
            <div>
              <h3 className="font-semibold">Exercise Library</h3>
              <p className="text-xs text-gray-500">Quick anxiety relief guides</p>
            </div>
          </div>
        </Card>
      </div>

      <MoodCheckinWidget />
      <MoodTimeline />
      <InsightsPanel />

      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />
    </div>
  );
}
