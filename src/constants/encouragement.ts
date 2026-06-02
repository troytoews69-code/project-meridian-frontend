export type DayPeriod = 'morning' | 'afternoon' | 'evening';

const OPENERS_BY_PERIOD: Record<DayPeriod, readonly string[]> = {
  morning: [
    'This morning,',
    'As your morning begins,',
    'At the start of today,',
    'With a fresh morning ahead,',
    'As you settle into your morning,',
    'At the start of this new day,',
    'As today gets underway,',
    'As you begin your day,',
    'As the day opens up,',
    'In this first part of your day,',
  ],
  afternoon: [
    'This afternoon,',
    'As your day moves forward,',
    'Midday check-in:',
    'Right where you are this afternoon,',
    'As you continue through the day,',
    'In today\'s afternoon stretch,',
    'As your day keeps unfolding,',
    'As you pause this afternoon,',
    'In this afternoon moment,',
    'As you regroup today,',
  ],
  evening: [
    'This evening,',
    'As your day winds down,',
    'Tonight,',
    'As evening settles in,',
    'In this evening pause,',
    'As you close out the day,',
    'At the end of today,',
    'As you reflect tonight,',
    'As the day comes to a close,',
    'In tonight\'s quiet moment,',
  ],
};

const STRENGTHS = [
  'your consistency',
  'your effort',
  'your patience',
  'your self-trust',
  'your resilience',
  'your discipline',
  'your courage',
  'your intention',
  'your focus',
  'your compassion for yourself',
  'your steady commitment',
  'your thoughtful choices',
  'your honest self-awareness',
  'your willingness to start again',
  'your calm determination',
  'your follow-through',
  'your adaptability',
  'your inner strength',
  'your daily care',
  'your mindful attention',
] as const;

const ACTIONS = [
  'is moving you forward',
  'is building real momentum',
  'is creating lasting change',
  'is strengthening your foundation',
  'is shaping a healthier routine',
  'is turning small choices into progress',
  'is helping your future self',
  'is enough for today',
  'is creating clearer patterns',
  'is reinforcing your progress',
  'is making hard days more manageable',
  'is guiding you toward balance',
  'is adding up in meaningful ways',
  'is improving your confidence day by day',
  'is becoming a powerful habit',
  'is bringing you closer to your goals',
] as const;

const CLOSERS = [
  'Keep going.',
  'You are doing this with purpose.',
  'That is something to be proud of.',
  'One step is still a win.',
  'Your health journey matters.',
  'You are stronger than this moment feels.',
  'Your progress counts.',
  'You are showing up for yourself.',
  'Your future self will thank you.',
  'You are building trust with yourself.',
  'This effort is meaningful.',
  'You can be proud of today.',
  'Small actions still create big outcomes.',
  'You are doing enough for this moment.',
  'Your care for yourself is powerful.',
  'You are on the right path.',
] as const;

const TOTAL_COMBINATIONS_PER_PERIOD =
  OPENERS_BY_PERIOD.morning.length * STRENGTHS.length * ACTIONS.length * CLOSERS.length;

function getDayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

export function getDayPeriod(date = new Date()): DayPeriod {
  const hour = date.getHours();
  if (hour < 12) {
    return 'morning';
  }
  if (hour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

export function getDayPeriodLabel(period: DayPeriod): string {
  if (period === 'morning') {
    return 'Morning';
  }
  if (period === 'afternoon') {
    return 'Afternoon';
  }
  return 'Evening';
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

function getPermutationIndex(dayNumber: number, period: DayPeriod): number {
  const periodOffset = period === 'morning' ? 983 : period === 'afternoon' ? 1987 : 3181;
  let step = 3877;

  // Keep step coprime with TOTAL_COMBINATIONS_PER_PERIOD so we get a full non-repeating cycle.
  while (gcd(step, TOTAL_COMBINATIONS_PER_PERIOD) !== 1) {
    step += 2;
  }

  const value = (dayNumber * step + periodOffset) % TOTAL_COMBINATIONS_PER_PERIOD;
  return value < 0 ? value + TOTAL_COMBINATIONS_PER_PERIOD : value;
}

function getFirstName(name?: string): string | null {
  const firstName = name?.trim().split(/\s+/)[0] ?? '';
  return firstName.length > 0 ? firstName : null;
}

function indexToMessage(index: number, period: DayPeriod, name?: string): string {
  const openers = OPENERS_BY_PERIOD[period];
  const closerIndex = index % CLOSERS.length;
  const actionIndex = Math.floor(index / CLOSERS.length) % ACTIONS.length;
  const strengthIndex = Math.floor(index / (CLOSERS.length * ACTIONS.length)) % STRENGTHS.length;
  const openerIndex =
    Math.floor(index / (CLOSERS.length * ACTIONS.length * STRENGTHS.length)) % openers.length;

  const firstName = getFirstName(name);
  const salutation = firstName ? `${firstName}, ` : '';

  return `${salutation}${openers[openerIndex]} ${STRENGTHS[strengthIndex]} ${ACTIONS[actionIndex]}. ${CLOSERS[closerIndex]}`;
}

type DailyEncouragementOptions = {
  date?: Date;
  name?: string;
  period?: DayPeriod;
};

export function getDailyEncouragement(options: DailyEncouragementOptions = {}): string {
  const { date = new Date(), name, period = getDayPeriod(date) } = options;
  const dayNumber = getDayNumber(date);
  const permutationIndex = getPermutationIndex(dayNumber, period);
  return indexToMessage(permutationIndex, period, name);
}
