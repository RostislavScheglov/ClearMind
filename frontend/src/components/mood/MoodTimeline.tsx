import { useMoodTimeline } from '../../api/mood';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function MoodTimeline() {
  const { data, isLoading } = useMoodTimeline();

  if (isLoading) return <Spinner />;

  if (!data || data.entries.length === 0) {
    return (
      <Card>
        <p className="text-center text-gray-400">No mood entries yet. Log your first mood above!</p>
      </Card>
    );
  }

  const chartData = data.entries.map((e) => ({
    date: new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: e.score,
    context: e.context,
  }));

  const trendIcon = data.trend === 'improving' ? '↑' : data.trend === 'declining' ? '↓' : '→';

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Mood Timeline</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {data.averageScore !== null && (
            <span>Avg: {data.averageScore}/10</span>
          )}
          {data.trend && (
            <span className={`font-medium ${
              data.trend === 'improving' ? 'text-green-600' : data.trend === 'declining' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trendIcon}
            </span>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[1, 10]} tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-sm">
                  <p className="font-medium">{d.date}: {d.score}/10</p>
                  {d.context && <p className="text-gray-500">{d.context}</p>}
                </div>
              );
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#0ea5e9"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
