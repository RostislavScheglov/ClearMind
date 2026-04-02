export type ExerciseCategory = 'grounding' | 'muscle-relaxation' | 'cognitive' | 'sensory';

export interface Exercise {
  id: string;
  title: string;
  category: ExerciseCategory;
  durationMinutes: number;
  steps: string[];
}

export const EXERCISE_CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'grounding', label: 'Grounding' },
  { value: 'muscle-relaxation', label: 'Muscle Relaxation' },
  { value: 'cognitive', label: 'Cognitive' },
  { value: 'sensory', label: 'Sensory' },
];

export const exercises: Exercise[] = [
  {
    id: 'grounding-54321',
    title: '5-4-3-2-1 Senses',
    category: 'grounding',
    durationMinutes: 5,
    steps: [
      'Find a comfortable position and take a slow, deep breath.',
      'Look around and name 5 things you can see. Say them out loud or in your mind.',
      'Notice 4 things you can physically feel — the chair under you, fabric on your skin, air on your face, feet on the floor.',
      'Listen carefully and identify 3 sounds you can hear right now.',
      'Become aware of 2 things you can smell. If nothing is obvious, move to something nearby — a sleeve, a hand, a cushion.',
      'Name 1 thing you can taste. Take a sip of water if you need to.',
    ],
  },
  {
    id: 'grounding-body-scan',
    title: 'Quick Body Scan',
    category: 'grounding',
    durationMinutes: 4,
    steps: [
      'Sit or lie down comfortably. Close your eyes if it feels safe.',
      'Bring your attention to the top of your head. Notice any tension or sensation without trying to change it.',
      'Slowly move your focus down through your forehead, jaw, neck, and shoulders — just noticing.',
      'Continue scanning through your arms, chest, belly, hips, legs, and feet.',
      'If you find a spot that feels tight, breathe into it gently and let it soften on the exhale.',
      'When you reach your toes, take two deep breaths and open your eyes.',
    ],
  },
  {
    id: 'grounding-feet',
    title: 'Grounding Through Your Feet',
    category: 'grounding',
    durationMinutes: 2,
    steps: [
      'Stand up or press your feet flat on the floor while seated.',
      'Press down firmly and feel the weight of your body through your soles.',
      'Slowly rock forward onto your toes, then back onto your heels. Repeat 3 times.',
      'Imagine roots growing from the bottom of your feet deep into the ground, anchoring you in place.',
      'Take 3 slow breaths while keeping your focus on the sensation of your feet touching the floor.',
    ],
  },
  {
    id: 'muscle-pmr',
    title: 'Progressive Muscle Relaxation',
    category: 'muscle-relaxation',
    durationMinutes: 7,
    steps: [
      'Sit or lie down. Take 3 slow breaths to settle in.',
      'Clench both fists as tightly as you can. Hold for 5 seconds, then release and feel the contrast.',
      'Shrug your shoulders up toward your ears and hold for 5 seconds. Drop them and relax.',
      'Scrunch your face — squeeze your eyes, clench your jaw, wrinkle your nose. Hold 5 seconds, then let go.',
      'Tighten your stomach muscles as if bracing for impact. Hold 5 seconds, then release.',
      'Press your legs together and curl your toes. Hold 5 seconds, release, and notice the warmth of relaxation spreading.',
    ],
  },
  {
    id: 'muscle-jaw-shoulder',
    title: 'Jaw & Shoulder Release',
    category: 'muscle-relaxation',
    durationMinutes: 3,
    steps: [
      'Drop your shoulders away from your ears — let them fall as low as they naturally go.',
      'Gently open your mouth wide, then close it. Repeat 3 times to release jaw tension.',
      'Place your fingertips on your jaw joints (in front of your ears). Make small circles, massaging gently for 15 seconds.',
      'Roll your shoulders forward 5 times, then backward 5 times, slowly.',
      'Finish by letting your arms hang loose and shaking your hands gently for a few seconds.',
    ],
  },
  {
    id: 'cognitive-reframe',
    title: 'Thought Reframing',
    category: 'cognitive',
    durationMinutes: 5,
    steps: [
      'Write down or mentally identify the anxious thought that\'s bothering you (e.g., "I\'m going to fail").',
      'Ask yourself: "Is this thought a fact, or is it a feeling?" Most anxiety-driven thoughts are feelings, not facts.',
      'Look for evidence against the thought. Have you succeeded in similar situations before? What would a friend say?',
      'Rewrite the thought in a more balanced way (e.g., "This is hard, but I\'ve handled hard things before").',
      'Read the new thought out loud or repeat it silently 3 times.',
    ],
  },
  {
    id: 'cognitive-worry-box',
    title: 'Worry Time-Boxing',
    category: 'cognitive',
    durationMinutes: 5,
    steps: [
      'Set a timer for 5 minutes. This is your dedicated "worry time."',
      'During these 5 minutes, write down every worry on your mind — don\'t hold back.',
      'When the timer ends, close the notebook or put the paper away. Worries are "stored" there now.',
      'If a worry pops up later, remind yourself: "I\'ll deal with that during my next worry time."',
      'Over days, you\'ll notice many worries resolve themselves before you revisit them.',
    ],
  },
  {
    id: 'cognitive-name-it',
    title: 'Name It to Tame It',
    category: 'cognitive',
    durationMinutes: 2,
    steps: [
      'Pause and notice what you\'re feeling right now. Don\'t judge it.',
      'Put a specific label on the emotion: "I am feeling anxious," "I am feeling overwhelmed," "I am feeling dread."',
      'Say it out loud or write it down. Naming an emotion reduces its intensity — this is backed by neuroscience.',
      'Follow up with: "This feeling is temporary. It will pass."',
    ],
  },
  {
    id: 'sensory-cold-water',
    title: 'Cold Water Reset',
    category: 'sensory',
    durationMinutes: 2,
    steps: [
      'Go to a sink and run cold water over your wrists for 15–30 seconds.',
      'Focus all your attention on the temperature sensation — the shock of cold on your skin.',
      'Alternatively, hold an ice cube in your palm and notice how the cold spreads.',
      'This activates your body\'s "dive reflex," which naturally slows your heart rate and calms the nervous system.',
    ],
  },
  {
    id: 'sensory-tactile',
    title: 'Tactile Object Focus',
    category: 'sensory',
    durationMinutes: 3,
    steps: [
      'Find a small object nearby — a pen, a stone, a piece of fabric, a key.',
      'Hold it in your hands and explore it with your fingers as if you\'ve never seen it before.',
      'Notice its weight, temperature, texture, edges, and shape. Describe these qualities silently.',
      'Spend at least 60 seconds fully absorbed in the object. If your mind wanders, gently return to the texture.',
      'Put it down and take a slow breath. Your attention has shifted away from anxiety.',
    ],
  },
  {
    id: 'sensory-scent',
    title: 'Scent Grounding',
    category: 'sensory',
    durationMinutes: 2,
    steps: [
      'Find something with a distinct smell — coffee, lotion, a candle, fresh air from a window, or even your own wrist.',
      'Bring it close and inhale slowly through your nose for 4 seconds.',
      'As you breathe in, focus entirely on identifying the scent. Is it warm? Sharp? Sweet?',
      'Exhale slowly through your mouth. Repeat 3–5 times.',
      'Scent is directly wired to the brain\'s emotional center, making it one of the fastest ways to shift your state.',
    ],
  },
];
