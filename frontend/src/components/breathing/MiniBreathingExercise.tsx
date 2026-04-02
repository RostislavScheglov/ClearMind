import { useState, useEffect, useCallback, useRef } from 'react';
import { BREATHING_CYCLE } from '../../data/breathingCycle';

type ExerciseState = 'idle' | 'running' | 'paused' | 'finished';

export function MiniBreathingExercise() {
  const [state, setState] = useState<ExerciseState>('idle');
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATHING_CYCLE.phases[0].duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPhase = BREATHING_CYCLE.phases[currentPhaseIndex];
  const totalPhaseDuration = currentPhase.duration;
  const progress = 1 - secondsLeft / totalPhaseDuration;

  const getScale = () => {
    if (state === 'idle' || state === 'finished') return 1;
    const { label } = currentPhase;
    if (label === 'Breathe In') return 1 + progress * 0.4;
    if (label === 'Hold') return 1.4;
    if (label === 'Breathe Out') return 1.4 - progress * 0.4;
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
      setCurrentPhaseIndex((phaseIdx) => {
        const nextPhase = phaseIdx + 1;
        if (nextPhase < BREATHING_CYCLE.phases.length) {
          setSecondsLeft(BREATHING_CYCLE.phases[nextPhase].duration);
          return nextPhase;
        }
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
  const handleRestart = () => handleStart();

  const scale = getScale();

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-slate-900 rounded-2xl">
      <h3 className="text-white text-sm font-semibold tracking-wide uppercase">Breathing</h3>

      {/* Phase label */}
      <div className="h-5 flex items-center">
        {state === 'idle' && <p className="text-slate-400 text-xs">Tap start to begin</p>}
        {state === 'running' && (
          <p className="text-white text-sm font-light animate-pulse">{currentPhase.label}</p>
        )}
        {state === 'paused' && <p className="text-slate-400 text-sm">Paused</p>}
        {state === 'finished' && <p className="text-emerald-400 text-sm">Well done!</p>}
      </div>

      {/* Animated circle */}
      <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
        <div
          className="absolute inset-0 rounded-full border-2 transition-transform"
          style={{
            borderColor: state === 'finished' ? '#34d399' : state === 'running' ? '#818cf8' : '#475569',
            transform: `scale(${scale})`,
            transitionDuration: state === 'running' ? '1s' : '0.5s',
            transitionTimingFunction: 'linear',
            boxShadow: state === 'running'
              ? '0 0 20px rgba(129, 140, 248, 0.3), inset 0 0 20px rgba(129, 140, 248, 0.1)'
              : 'none',
          }}
        />
        <div className="relative z-10 text-center">
          {(state === 'running' || state === 'paused') && (
            <>
              <p className="text-2xl font-light text-white tabular-nums">{secondsLeft}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">
                {currentCycle + 1}/{BREATHING_CYCLE.totalCycles}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors"
          >
            Start
          </button>
        )}
        {state === 'running' && (
          <button
            onClick={handlePause}
            className="px-5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            Pause
          </button>
        )}
        {state === 'paused' && (
          <button
            onClick={handleResume}
            className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors"
          >
            Resume
          </button>
        )}
        {state === 'finished' && (
          <button
            onClick={handleRestart}
            className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-medium transition-colors"
          >
            Restart
          </button>
        )}
      </div>
    </div>
  );
}
