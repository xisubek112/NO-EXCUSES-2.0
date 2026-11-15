export type TabId = 'home' | 'habits' | 'coach' | 'stats' | 'settings';

export type Language = 'en' | 'uz';

export type CoachState = 'PROUD' | 'WATCHING' | 'DISAPPOINTED' | 'STRICT';

export type CoachStrictness = 'balanced' | 'relentless';

export interface Habit {
  id: string;
  title: string;
  description: string;
  reminderTime: string; // HH:mm 24h format
  createdAt: string; // YYYY-MM-DD
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  activeHabitCount: number;
  score: number; // 0-100
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'coach';
  text: string;
  timestamp: string; // ISO string
  coachState?: CoachState;
}

export interface UserProfile {
  name: string;
  focusArea: string;
}

export interface NotificationPrefs {
  enabled: boolean;
  morningCheckIn: string;
  nightReportTime: string;
  hapticsEnabled: boolean;
}

export interface PrivacyPrefs {
  localEncryptionLabel: boolean;
  incognitoMetrics: boolean;
}

export interface AppSettings {
  language: Language;
  strictness: CoachStrictness;
  profile: UserProfile;
  notifications: NotificationPrefs;
  privacy: PrivacyPrefs;
}

export interface ScoreSummary {
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  dailyScore: number;
  currentStreak: number;
  bestStreak: number;
  coachState: CoachState;
}

export interface DailySeriesPoint {
  date: string;
  label: string;
  score: number;
  completedCount: number;
  totalCount: number;
  completionPct: number;
}

export interface HabitConsistencyItem {
  habitId: string;
  title: string;
  completedDays: number;
  trackedDays: number;
  rate: number;
}
