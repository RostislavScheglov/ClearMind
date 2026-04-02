import { useState, useEffect, useCallback, useRef } from 'react';
import { BREATHING_CYCLE } from '../../data/breathingCycle';

type ExerciseState = 'idle' | 'running' | 'paused' | 'finished';

export function BreathingExercise() {
  const [state, setState] = useState<ExerciseState>('idle');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATHING_CYCLE.phases[0].duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = BREATHING_CYCLE.phases[currentPhaseIndex];
  const totalPhaseDuration = currentPhase.duration;
  const progress = 1 - secondsLeft / totalPhaseDuration;

  // Scale: inhale grows, hold stays, exhale shrinks
  const getScale = () => {
    if (state === 'idle') return 1;
    if (state === 'finished') return 1;
    const { label } = currentPhase;
    if (label === 'Breathe In') return 1 + progress * 0.5;
    if (label === 'Hold') return 1.5;
    if (label === 'Breathe Out') return 1.5 - progress * 0.5;
    return 1;
  };

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const advanceTick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev > 1) return prev - 1;

      // Phase ended — advance
      setCurrentPhaseIndex((phaseIdx) => {
        const nextPhase = phaseIdx + 1;
        if (nextPhase < BREATHING_CYCLE.phases.length) {
          setSecondsLeft(BREATHING_CYCLE.phases[nextPhase].duration);
          return nextPhase;
        }
        // Cycle ended
        setCurrentCycle((cycle) => {
          const nextCycle = cycle + 1;
          if (nextCycle >= BREATHING_CYCLE.totalCycles) {
            setState('finished');
            return cycle;
          }
          setSecondsLeft(BREATHING_CYCLE.phases[0].duration);
          setCurrentPhaseIndex(0);
          return nextCycle;
        });
        return phaseIdx;
      });

      return prev;
    });
  }, []);

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(advanceTick, 1000);
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [state, advanceTick, clearTimer]);

  const handleStart = () => {
    setCurrentCycle(0);
    setCurrentPhaseIndex(0);
    setSecondsLeft(BREATHING_CYCLE.phases[0].duration);
    setState('running');
  };

  const handlePause = () => setState('paused');
  const handleResume = () => setState('running');

  const handleRestart = () => {
    handleStart();
  };

  const scale = getScale();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Phase label */}
      <div className="h-8 flex items-center">
        {state === 'idle' && (
          <p className="text-slate-400 text-lg">Ready when you are</p>
        )}
        {state === 'running' && (
          <p className="text-white text-2xl font-light tracking-wide animate-pulse">
            {currentPhase.label}
          </p>
        )}
        {state === 'paused' && (
          <p className="text-slate-400 text-xl">Paused</p>
        )}
        {state === 'finished' && (
          <p className="text-emerald-400 text-2xl font-light">Well done!</p>
        )}
      </div>

      {/* Animated circle */}
      <div className="relative flex items-center justify-center" style={{ width: 'min(60vw, 280px)', height: 'min(60vw, 280px)' }}>
        <div
          className="absolute inset-0 rounded-full border-4 transition-transform"
          style={{
            borderColor: state === 'finished' ? '#34d399' : state === 'running' ? '#818cf8' : '#475569',
            transform: `scale(${scale})`,
            transitionDuration: state === 'running' ? '1s' : '0.5s',
            transitionTimingFunction: 'linear',
            boxShadow: state === 'running'
              ? '0 0 40px rgba(129, 140, 248, 0.3), inset 0 0 40px rgba(129, 140, 248, 0.1)'
              : state === 'finished'
                ? '0 0 40px rgba(52, 211, 153, 0.3)'
                : 'none',
          }}
        />

        {/* Center content */}
        <div className="relative z-10 text-center">
          {(state === 'running' || state === 'paused') && (
            <>
              <p className="text-5xl font-light text-white tabular-nums">{secondsLeft}</p>
              <p className="text-slate-400 text-sm mt-2">
                Cycle {currentCycle + 1} of {BREATHING_CYCLE.totalCycles}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Cycle dots */}
      {(state === 'running' || state === 'paused') && (
        <div className="flex gap-2">
          {Array.from({ length: BREATHING_CYCLE.totalCycles }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < currentCycle
                  ? 'bg-emerald-400'
                  : i === currentCycle
                    ? 'bg-indigo-400'
                    : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg font-medium transition-colors"
          >
            Start
          </button>
        )}
        {state === 'running' && (
          <button
            onClick={handlePause}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-lg font-medium transition-colors"
          >
            Pause
          </button>
        )}
        {state === 'paused' && (
          <button
            onClick={handleResume}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg font-medium transition-colors"
          >
            Resume
          </button>
        )}
        {state === 'finished' && (
          <button
            onClick={handleRestart}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-lg font-medium transition-colors"
          >
            Restart
          </button>
        )}
      </div>

      {/* Exercise info */}
      <p className="text-slate-500 text-sm">
        {BREATHING_CYCLE.name} — {BREATHING_CYCLE.totalCycles} cycles
      </p>
    </div>
  );
}
