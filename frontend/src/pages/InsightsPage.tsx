import { MoodCheckinWidget } from '../components/mood/MoodCheckinWidget';
import { MoodTimeline } from '../components/mood/MoodTimeline';
import { InsightsPanel } from '../components/insights/InsightsPanel';

export function InsightsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insights & Mood</h1>
      <MoodCheckinWidget />
      <MoodTimeline />
      <InsightsPanel />
    </div>
  );
}
