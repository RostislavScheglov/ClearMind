export interface BreathingPhase {
  label: string;
  duration: number; // seconds
}

export interface BreathingCycleConfig {
  name: string;
  phases: BreathingPhase[];
  totalCycles: number;
}

export const BREATHING_CYCLE: BreathingCycleConfig = {
  name: '4-7-8 Relaxation',
  phases: [
    { label: 'Breathe In', duration: 4 },
    { label: 'Hold', duration: 7 },
    { label: 'Breathe Out', duration: 8 },
  ],
  totalCycles: 4,
  // Total duration = (4+7+8) * 4 = 76 seconds
};
