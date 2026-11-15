import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_ACTIVE_HABITS,
  addDays,
  buildScoreSummary,
  calculateStreaks,
  canAddHabit,
  computeCompletionPercentage,
  computeDayScore,
  determineCoachState,
  getHabitConsistency,
  getOverallCompletionRate,
  getPerformanceSeries,
  toggleHabitCompletionForDate,
} from './discipline';
import type { DayLog, Habit } from '../types';

const sampleHabits: Habit[] = [
  {
    id: 'h1',
    title: '05:30 Cold Exposure & Mobility',
    description: '15 min mobility and cold shower before touching phone.',
    reminderTime: '05:30',
    createdAt: '2026-11-01',
  },
  {
    id: 'h2',
    title: 'Deep Work Block (90m)',
    description: 'Single-task execution without notifications.',
    reminderTime: '08:30',
    createdAt: '2026-11-01',
  },
  {
    id: 'h3',
    title: 'Evening Strength & Zero Sugar',
    description: '45 min resistance training + clean evening fuel.',
    reminderTime: '19:00',
    createdAt: '2026-11-01',
  },
];

test('strict 3-habit limit allows <= 2 and blocks at 3', () => {
  assert.equal(MAX_ACTIVE_HABITS, 3);
  assert.equal(canAddHabit([]), true);
  assert.equal(canAddHabit(sampleHabits.slice(0, 2)), true);
  assert.equal(canAddHabit(sampleHabits), false);
});

test('daily score and completion percentage math are accurate', () => {
  assert.equal(computeDayScore(0, 3), 0);
  assert.equal(computeDayScore(1, 3), 30);
  assert.equal(computeDayScore(2, 3), 60);
  assert.equal(computeDayScore(3, 3), 100);
  assert.equal(computeDayScore(0, 0), 0);

  assert.equal(computeCompletionPercentage(0, 3), 0);
  assert.equal(computeCompletionPercentage(1, 3), 33);
  assert.equal(computeCompletionPercentage(2, 3), 67);
  assert.equal(computeCompletionPercentage(3, 3), 100);
});

test('coach state transitions between PROUD, WATCHING, DISAPPOINTED, and STRICT', () => {
  assert.equal(
    determineCoachState({ completedCount: 3, totalCount: 3, strictness: 'balanced', hourOfDay: 21 }),
    'PROUD',
  );
  assert.equal(
    determineCoachState({ completedCount: 1, totalCount: 3, strictness: 'balanced', hourOfDay: 14 }),
    'WATCHING',
  );
  assert.equal(
    determineCoachState({ completedCount: 0, totalCount: 3, strictness: 'balanced', hourOfDay: 20 }),
    'DISAPPOINTED',
  );
  assert.equal(
    determineCoachState({ completedCount: 1, totalCount: 3, strictness: 'relentless', hourOfDay: 10 }),
    'STRICT',
  );
});

test('streak calculation tracks consecutive full-completion days and resets on gaps', () => {
  const today = '2026-11-15';
  const history: Record<string, DayLog> = {
    '2026-11-10': { date: '2026-11-10', completedHabitIds: ['h1', 'h2', 'h3'], activeHabitCount: 3, score: 100 },
    '2026-11-11': { date: '2026-11-11', completedHabitIds: ['h1', 'h2', 'h3'], activeHabitCount: 3, score: 100 },
    '2026-11-12': { date: '2026-11-12', completedHabitIds: ['h1'], activeHabitCount: 3, score: 30 }, // broken
    '2026-11-13': { date: '2026-11-13', completedHabitIds: ['h1', 'h2', 'h3'], activeHabitCount: 3, score: 100 },
    '2026-11-14': { date: '2026-11-14', completedHabitIds: ['h1', 'h2', 'h3'], activeHabitCount: 3, score: 100 },
    '2026-11-15': { date: '2026-11-15', completedHabitIds: ['h1', 'h2', 'h3'], activeHabitCount: 3, score: 100 },
  };

  const streaks = calculateStreaks(history, today);
  assert.equal(streaks.currentStreak, 3);
  assert.equal(streaks.bestStreak, 3);

  // If today is still pending (0/3), streak from yesterday remains intact at 2
  const pendingTodayHistory: Record<string, DayLog> = {
    ...history,
    '2026-11-15': { date: '2026-11-15', completedHabitIds: [], activeHabitCount: 3, score: 0 },
  };
  const pendingStreaks = calculateStreaks(pendingTodayHistory, today);
  assert.equal(pendingStreaks.currentStreak, 2);
});

test('toggling habit updates daily score summary and weekly series', () => {
  const today = '2026-11-15';
  let history: Record<string, DayLog> = {
    [addDays(today, -1)]: {
      date: addDays(today, -1),
      completedHabitIds: ['h1', 'h2', 'h3'],
      activeHabitCount: 3,
      score: 100,
    },
  };

  history = toggleHabitCompletionForDate({ history, habits: sampleHabits, habitId: 'h1', dateKey: today });
  history = toggleHabitCompletionForDate({ history, habits: sampleHabits, habitId: 'h2', dateKey: today });

  const summary = buildScoreSummary({
    habits: sampleHabits,
    history,
    todayKey: today,
    strictness: 'balanced',
    hourOfDay: 11,
  });

  assert.equal(summary.completedCount, 2);
  assert.equal(summary.dailyScore, 60);
  assert.equal(summary.completionPercentage, 67);
  assert.equal(summary.coachState, 'WATCHING');

  const weekly = getPerformanceSeries({ history, todayKey: today, days: 7, locale: 'en' });
  assert.equal(weekly.length, 7);
  assert.equal(weekly[6].score, 60);
  assert.equal(weekly[5].score, 100);

  const consistency = getHabitConsistency(sampleHabits, history);
  assert.equal(consistency[0].completedDays, 2);
  assert.equal(consistency[2].completedDays, 1);
  assert.equal(getOverallCompletionRate(history), 84);
});
