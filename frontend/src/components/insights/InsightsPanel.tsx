import { useInsights } from '../../api/insights';
import { useAuthStore } from '../../store/authStore';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { useSubscribe } from '../../api/subscription';

export function InsightsPanel() {
  const { subscription } = useAuthStore();
  const subscribe = useSubscribe();

  if (!subscription || subscription.tier === 'free') {
    return (
      <Card>
        <div className="text-center py-4">
          <p className="text-2xl mb-2">🔒</p>
          <h3 className="font-semibold mb-1">AI Insights</h3>
          <p className="text-sm text-gray-500 mb-4">
            Upgrade to Pro to unlock personalized behavioral insights based on
            your sessions and mood data.
          </p>
          <Button onClick={() => subscribe.mutate()} isLoading={subscribe.isPending}>
            Upgrade to Pro
          </Button>
        </div>
      </Card>
    );
  }

  return <InsightsFetcher />;
}

function InsightsFetcher() {
  const { data, isLoading, isFetching, isError, refetch } = useInsights();

  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <Card>
        <p className="text-center text-gray-400 mb-3">Insights temporarily unavailable.</p>
        <div className="text-center">
          <Button onClick={() => refetch()} isLoading={isFetching}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (data?.message) {
    return (
      <Card>
        <p className="text-center text-gray-500 mb-3">{data.message}</p>
        <div className="text-center">
          <Button onClick={() => refetch()} isLoading={isFetching}>
            Generate Insights
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">✨ Your Insights</h3>
        <Button onClick={() => refetch()} isLoading={isFetching}>
          Refresh
        </Button>
      </div>
      <ul className="space-y-3">
        {data?.insights.map((insight, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-primary-600 mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
