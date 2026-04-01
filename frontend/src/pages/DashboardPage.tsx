import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCreateSession } from '../api/sessions';
import { MoodCheckinWidget } from '../components/mood/MoodCheckinWidget';
import { MoodTimeline } from '../components/mood/MoodTimeline';
import { InsightsPanel } from '../components/insights/InsightsPanel';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const createSession = useCreateSession();

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

      <MoodCheckinWidget />
      <MoodTimeline />
      <InsightsPanel />
    </div>
  );
}
