import { useState } from 'react';
import { exercises, EXERCISE_CATEGORIES } from '../data/exercises';
import { ExerciseCard } from '../components/exercises/ExerciseCard';
import type { ExerciseCategory } from '../data/exercises';

export function ExercisesPage() {
  const [activeCategory, setActiveCategory] = useState<ExerciseCategory | 'all'>('all');

  const filtered =
    activeCategory === 'all'
      ? exercises
      : exercises.filter((e) => e.category === activeCategory);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Relief Exercises</h1>
      <p className="text-gray-500 mt-1">
        Quick exercises you can do anywhere to ease anxiety.
      </p>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mt-5">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {EXERCISE_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise list */}
      <div className="mt-6 space-y-3">
        {filtered.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
