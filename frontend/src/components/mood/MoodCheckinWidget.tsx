import { useState } from 'react';
import { useLogMood } from '../../api/mood';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const MOODS = [
  { emoji: '😔', score: 2 },
  { emoji: '😕', score: 4 },
  { emoji: '😐', score: 5 },
  { emoji: '🙂', score: 7 },
  { emoji: '😊', score: 9 },
];

export function MoodCheckinWidget() {
  const [selected, setSelected] = useState<number | null>(null);
  const [context, setContext] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const logMood = useLogMood();

  const handleSubmit = () => {
    if (selected === null) return;
    logMood.mutate(
      { score: selected, context: context || undefined },
      {
        onSuccess: () => setSubmitted(true),
      }
    );
  };

  if (submitted) {
    return (
      <Card>
        <p className="text-center text-gray-600">✅ Mood logged! Check your timeline for trends.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-semibold mb-3">How are you feeling?</h3>
      <div className="flex justify-between mb-3">
        {MOODS.map((m) => (
          <button
            key={m.score}
            onClick={() => setSelected(m.score)}
            className={`text-2xl p-2 rounded-full transition-transform ${
              selected === m.score ? 'scale-125 ring-2 ring-primary-400' : 'opacity-50 hover:opacity-100'
            }`}
          >
            {m.emoji}
          </button>
        ))}
      </div>
      {selected !== null && (
        <>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="What's on your mind? (optional)"
            maxLength={200}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={handleSubmit} isLoading={logMood.isPending} className="w-full">
            Log Mood
          </Button>
        </>
      )}
    </Card>
  );
}
