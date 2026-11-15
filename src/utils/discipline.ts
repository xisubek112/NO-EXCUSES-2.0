import type {
  CoachState,
  CoachStrictness,
  DailySeriesPoint,
  DayLog,
  Habit,
  HabitConsistencyItem,
  ScoreSummary,
} from '../types';

export const MAX_ACTIVE_HABITS = 3;

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + deltaDays);
  return formatDateKey(dt);
}

export function canAddHabit(habits: Habit[]): boolean {
  return habits.length < MAX_ACTIVE_HABITS;
}

export function computeDayScore(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const clampedCompleted = Math.min(Math.max(0, completedCount), totalCount);
  const ratio = clampedCompleted / totalCount;
  // Base score up to 90 from completion ratio + 10pt full-execution bonus when 100% done
  const base = Math.round(ratio * 90);
  const fullExecutionBonus = clampedCompleted === totalCount ? 10 : 0;
  return Math.min(100, base + fullExecutionBonus);
}

export function computeCompletionPercentage(completedCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const clamped = Math.min(Math.max(0, completedCount), totalCount);
  return Math.round((clamped / totalCount) * 100);
}

export function determineCoachState(params: {
  completedCount: number;
  totalCount: number;
  strictness: CoachStrictness;
  hourOfDay: number;
}): CoachState {
  const { completedCount, totalCount, strictness, hourOfDay } = params;

  if (totalCount > 0 && completedCount >= totalCount) {
    return 'PROUD';
  }

  if (strictness === 'relentless') {
    if (totalCount > 0 && completedCount === 0 && hourOfDay >= 18) {
      return 'DISAPPOINTED';
    }
    return 'STRICT';
  }

  if (totalCount > 0 && completedCount === 0 && hourOfDay >= 19) {
    return 'DISAPPOINTED';
  }

  return 'WATCHING';
}

export function isFullSuccessDay(log: DayLog | undefined): boolean {
  if (!log || log.activeHabitCount <= 0) return false;
  return log.completedHabitIds.length >= log.activeHabitCount;
}

export function calculateStreaks(
  history: Record<string, DayLog>,
  todayKey: string,
): { currentStreak: number; bestStreak: number } {
  const allDates = Object.keys(history).sort();
  if (allDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Current streak: count backwards from today (if today is full success) or yesterday (if today isn't finished yet)
  let currentStreak = 0;
  let cursor = isFullSuccessDay(history[todayKey]) ? todayKey : addDays(todayKey, -1);

  while (isFullSuccessDay(history[cursor])) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  // Best streak across all recorded dates
  let bestStreak = 0;
  let running = 0;
  let prevDate: string | null = null;

  for (const dateKey of allDates) {
    const log = history[dateKey];
    if (isFullSuccessDay(log)) {
      if (prevDate && addDays(prevDate, 1) === dateKey) {
        running += 1;
      } else {
        running = 1;
      }
      if (running > bestStreak) {
        bestStreak = running;
      }
      prevDate = dateKey;
    } else {
      running = 0;
      prevDate = null;
    }
  }

  return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
}

export function buildScoreSummary(params: {
  habits: Habit[];
  history: Record<string, DayLog>;
  todayKey: string;
  strictness: CoachStrictness;
  hourOfDay: number;
}): ScoreSummary {
  const { habits, history, todayKey, strictness, hourOfDay } = params;
  const activeIds = new Set(habits.map((h) => h.id));
  const todayLog = history[todayKey];
  const completedToday = todayLog
    ? todayLog.completedHabitIds.filter((id) => activeIds.has(id))
    : [];

  const totalCount = habits.length;
  const completedCount = completedToday.length;
  const completionPercentage = computeCompletionPercentage(completedCount, totalCount);
  const dailyScore = computeDayScore(completedCount, totalCount);
  const { currentStreak, bestStreak } = calculateStreaks(history, todayKey);
  const coachState = determineCoachState({
    completedCount,
    totalCount,
    strictness,
    hourOfDay,
  });

  return {
    completedCount,
    totalCount,
    completionPercentage,
    dailyScore,
    currentStreak,
    bestStreak,
    coachState,
  };
}

export function toggleHabitCompletionForDate(params: {
  history: Record<string, DayLog>;
  habits: Habit[];
  habitId: string;
  dateKey: string;
}): Record<string, DayLog> {
  const { history, habits, habitId, dateKey } = params;
  const activeIds = new Set(habits.map((h) => h.id));
  const existing = history[dateKey];
  const currentIds = existing
    ? existing.completedHabitIds.filter((id) => activeIds.has(id))
    : [];

  const hasId = currentIds.includes(habitId);
  const nextIds = hasId
    ? currentIds.filter((id) => id !== habitId)
    : [...currentIds, habitId];

  const totalCount = habits.length;
  const score = computeDayScore(nextIds.length, totalCount);

  return {
    ...history,
    [dateKey]: {
      date: dateKey,
      completedHabitIds: nextIds,
      activeHabitCount: totalCount,
      score,
    },
  };
}

export function getPerformanceSeries(params: {
  history: Record<string, DayLog>;
  todayKey: string;
  days: number;
  locale: 'en' | 'uz';
}): DailySeriesPoint[] {
  const { history, todayKey, days, locale } = params;
  const uzShortDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
  const enShortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const points: DailySeriesPoint[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const dateKey = addDays(todayKey, -i);
    const [y, m, d] = dateKey.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    const log = history[dateKey];
    const completedCount = log ? log.completedHabitIds.length : 0;
    const totalCount = log ? log.activeHabitCount : 0;
    const score = log ? log.score : 0;
    const completionPct = computeCompletionPercentage(completedCount, totalCount);

    const label =
      days <= 7
        ? (locale === 'uz' ? uzShortDays[dt.getDay()] : enShortDays[dt.getDay()])
        : `${d}`;

    points.push({
      date: dateKey,
      label,
      score,
      completedCount,
      totalCount,
      completionPct,
    });
  }

  return points;
}

export function getHabitConsistency(
  habits: Habit[],
  history: Record<string, DayLog>,
): HabitConsistencyItem[] {
  const logs = Object.values(history);
  const trackedDays = Math.max(logs.length, 1);

  return habits.map((habit) => {
    const completedDays = logs.filter((log) =>
      log.completedHabitIds.includes(habit.id),
    ).length;
    const rate = logs.length === 0 ? 0 : Math.round((completedDays / trackedDays) * 100);
    return {
      habitId: habit.id,
      title: habit.title,
      completedDays,
      trackedDays: logs.length,
      rate,
    };
  });
}

export function getOverallCompletionRate(history: Record<string, DayLog>): number {
  const logs = Object.values(history).filter((l) => l.activeHabitCount > 0);
  if (logs.length === 0) return 0;
  const sumPct = logs.reduce(
    (acc, log) => acc + computeCompletionPercentage(log.completedHabitIds.length, log.activeHabitCount),
    0,
  );
  return Math.round(sumPct / logs.length);
}
