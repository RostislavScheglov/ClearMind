import { useNavigate } from 'react-router-dom';
import { useSessions } from '../api/sessions';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

export function SessionHistoryPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useSessions();

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Session History</h1>

      {!data?.length && (
        <p className="text-gray-400 text-center py-8">No sessions yet. Start your first reflection!</p>
      )}

      {data?.map((session) => (
        <Card key={session.id} onClick={() => navigate(`/chat/${session.id}`)}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{session.title || 'Untitled Session'}</h3>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(session.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {(session as any)._count?.messages ?? '–'} msg
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
