import type { AppSettings, DayLog, Habit } from '../types';
import { addDays, computeDayScore } from '../utils/discipline';

export function createInitialHabits(todayKey: string): Habit[] {
  const start = addDays(todayKey, -14);
  return [
    {
      id: 'habit-01',
      title: '05:30 Cold Exposure & Mobility',
      description: '15 min joint mobility and cold shower before checking any messages.',
      reminderTime: '05:30',
      createdAt: start,
    },
    {
      id: 'habit-02',
      title: '90-Minute Deep Work Block',
      description: 'Phone in another room. Single high-leverage objective completed.',
      reminderTime: '08:30',
      createdAt: start,
    },
    {
      id: 'habit-03',
      title: 'Strength Training & Clean Fuel',
      description: '45 min resistance training and zero processed sugar after 18:00.',
      reminderTime: '18:30',
      createdAt: start,
    },
  ];
}

export function createInitialHistory(todayKey: string): Record<string, DayLog> {
  // Deterministic 10-day baseline history prior to today; today starts at 0/3 ready for execution
  const pattern: Array<{ offset: number; ids: string[] }> = [
    { offset: -10, ids: ['habit-01', 'habit-02'] },
    { offset: -9, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -8, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -7, ids: ['habit-01'] },
    { offset: -6, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -5, ids: ['habit-01', 'habit-02'] },
    { offset: -4, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -3, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -2, ids: ['habit-01', 'habit-02', 'habit-03'] },
    { offset: -1, ids: ['habit-01', 'habit-02', 'habit-03'] },
  ];

  const logs: Record<string, DayLog> = {};
  for (const entry of pattern) {
    const date = addDays(todayKey, entry.offset);
    logs[date] = {
      date,
      completedHabitIds: entry.ids,
      activeHabitCount: 3,
      score: computeDayScore(entry.ids.length, 3),
    };
  }
  return logs;
}

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  strictness: 'balanced',
  profile: {
    name: 'Amir',
    focusArea: 'Physical Strength & Deep Execution',
  },
  notifications: {
    enabled: true,
    morningCheckIn: '06:00',
    nightReportTime: '21:30',
    hapticsEnabled: true,
  },
  privacy: {
    localEncryptionLabel: true,
    incognitoMetrics: false,
  },
};
