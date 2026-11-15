import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AppSettings,
  ChatMessage,
  DayLog,
  Habit,
  Language,
  ScoreSummary,
} from '../types';
import {
  DEFAULT_SETTINGS,
  createInitialHabits,
  createInitialHistory,
} from '../data/seedData';
import {
  buildScoreSummary,
  canAddHabit,
  formatDateKey,
  toggleHabitCompletionForDate,
} from '../utils/discipline';
import { TRANSLATIONS } from '../i18n/translations';

const STORAGE_KEYS = {
  habits: 'no_excuses_habits_v1',
  history: 'no_excuses_history_v1',
  settings: 'no_excuses_settings_v1',
  chat: 'no_excuses_chat_v1',
} as const;

function safeReadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useDisciplineStore() {
  const todayKey = useMemo(() => formatDateKey(new Date()), []);
  const currentHour = new Date().getHours();

  const [habits, setHabits] = useState<Habit[]>(() =>
    safeReadStorage<Habit[]>(STORAGE_KEYS.habits, createInitialHabits(todayKey)),
  );

  const [history, setHistory] = useState<Record<string, DayLog>>(() =>
    safeReadStorage<Record<string, DayLog>>(
      STORAGE_KEYS.history,
      createInitialHistory(todayKey),
    ),
  );

  const [settings, setSettings] = useState<AppSettings>(() =>
    safeReadStorage<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = safeReadStorage<ChatMessage[]>(STORAGE_KEYS.chat, []);
    if (saved.length > 0) return saved;
    return [
      {
        id: 'coach-welcome',
        role: 'coach',
        text: TRANSLATIONS.uz.coachScreen.welcomeMessage,
        timestamp: new Date().toISOString(),
        coachState: 'WATCHING',
      },
    ];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.habits, JSON.stringify(habits));
    } catch {
      // ignore quota errors
    }
  }, [habits]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {
      // ignore quota errors
    }
  }, [history]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // ignore quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  const scoreSummary: ScoreSummary = useMemo(
    () =>
      buildScoreSummary({
        habits,
        history,
        todayKey,
        strictness: settings.strictness,
        hourOfDay: currentHour,
      }),
    [habits, history, todayKey, settings.strictness, currentHour],
  );

  const completedTodayIds = useMemo(() => {
    const log = history[todayKey];
    if (!log) return new Set<string>();
    return new Set(log.completedHabitIds);
  }, [history, todayKey]);

  const toggleHabitToday = useCallback(
    (habitId: string) => {
      if (settings.notifications.hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(18);
        } catch {
          // ignore unsupported devices
        }
      }
      setHistory((prev) =>
        toggleHabitCompletionForDate({
          history: prev,
          habits,
          habitId,
          dateKey: todayKey,
        }),
      );
    },
    [habits, todayKey, settings.notifications.hapticsEnabled],
  );

  const addHabit = useCallback(
    (input: { title: string; description: string; reminderTime: string }): boolean => {
      if (!canAddHabit(habits)) {
        return false;
      }
      const next: Habit = {
        id: `habit-${Date.now()}`,
        title: input.title.trim(),
        description: input.description.trim(),
        reminderTime: input.reminderTime || '08:00',
        createdAt: todayKey,
      };
      setHabits((prev) => [...prev, next]);
      return true;
    },
    [habits, todayKey],
  );

  const updateHabit = useCallback(
    (id: string, patch: { title: string; description: string; reminderTime: string }) => {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                title: patch.title.trim(),
                description: patch.description.trim(),
                reminderTime: patch.reminderTime,
              }
            : h,
        ),
      );
    },
    [],
  );

  const deleteHabit = useCallback(
    (id: string) => {
      setHabits((prev) => {
        const nextHabits = prev.filter((h) => h.id !== id);
        // Keep today's log aligned with remaining active habits
        setHistory((prevHist) => {
          const todayLog = prevHist[todayKey];
          if (!todayLog) return prevHist;
          const remainingIds = todayLog.completedHabitIds.filter((cid) => cid !== id);
          return {
            ...prevHist,
            [todayKey]: {
              ...todayLog,
              completedHabitIds: remainingIds,
              activeHabitCount: nextHabits.length,
            },
          };
        });
        return nextHabits;
      });
    },
    [todayKey],
  );

  const setLanguage = useCallback((language: Language) => {
    setSettings((prev) => ({ ...prev, language }));
  }, []);

  const updateSettings = useCallback((updater: (prev: AppSettings) => AppSettings) => {
    setSettings(updater);
  }, []);

  const appendChatMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'coach-welcome',
        role: 'coach',
        text: TRANSLATIONS.uz.coachScreen.welcomeMessage,
        timestamp: new Date().toISOString(),
        coachState: scoreSummary.coachState,
      },
    ]);
  }, [scoreSummary.coachState]);

  const resetAllData = useCallback(() => {
    setHabits([]);
    setHistory({});
    setMessages([
      {
        id: 'coach-welcome',
        role: 'coach',
        text: TRANSLATIONS.uz.coachScreen.welcomeMessage,
        timestamp: new Date().toISOString(),
        coachState: 'WATCHING',
      },
    ]);
  }, []);

  return {
    todayKey,
    habits,
    history,
    settings,
    messages,
    scoreSummary,
    completedTodayIds,
    toggleHabitToday,
    addHabit,
    updateHabit,
    deleteHabit,
    setLanguage,
    updateSettings,
    appendChatMessage,
    clearChat,
    resetAllData,
  };
}
