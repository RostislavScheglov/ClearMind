import { useState } from 'react';
import { Card } from '../ui/Card';
import type { Exercise } from '../../data/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
}

const categoryColors: Record<string, string> = {
  grounding: 'bg-green-100 text-green-700',
  'muscle-relaxation': 'bg-blue-100 text-blue-700',
  cognitive: 'bg-purple-100 text-purple-700',
  sensory: 'bg-amber-100 text-amber-700',
};

const categoryLabels: Record<string, string> = {
  grounding: 'Grounding',
  'muscle-relaxation': 'Muscle Relaxation',
  cognitive: 'Cognitive',
  sensory: 'Sensory',
};

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[exercise.category]}`}
              >
                {categoryLabels[exercise.category]}
              </span>
              <span className="text-xs text-gray-500">
                ~{exercise.durationMinutes} min
              </span>
            </div>
          </div>
          <span
            className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ol className="space-y-3">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
            onClick={() => setExpanded(false)}
          >
            Close
          </button>
        </div>
      )}
    </Card>
  );
}
