import { useEffect, useState } from 'react';
import { ArrowUpRight, Flame, Moon, Plus, RefreshCw, Target, User } from 'lucide-react';
import type { AppSettings, Habit, ScoreSummary, TabId } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { COACH_LIGHTING_TREATMENT } from '../constants/designTokens';
import { DisciplineRing } from './DisciplineRing';
import { HabitCard } from './HabitCard';
import { CoachAvatar } from './CoachAvatar';

interface HomeDashboardProps {
  habits: Habit[];
  completedTodayIds: Set<string>;
  scoreSummary: ScoreSummary;
  settings: AppSettings;
  t: TranslationBundle;
  formattedDate: string;
  onToggleHabit: (habitId: string) => void;
  onNavigate: (tab: TabId) => void;
  onOpenNightReport: () => void;
}

export function HomeDashboard({
  habits,
  completedTodayIds,
  scoreSummary,
  settings,
  t,
  formattedDate,
  onToggleHabit,
  onNavigate,
  onOpenNightReport,
}: HomeDashboardProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t.greetings.morning
      : hour < 18
        ? t.greetings.afternoon
        : t.greetings.evening;

  const userName = settings.profile.name.trim() || t.greetings.warriorFallback;
  const coachStateMeta = t.coachStates[scoreSummary.coachState];
  const lighting = COACH_LIGHTING_TREATMENT[scoreSummary.coachState];

  const [dailyBrief, setDailyBrief] = useState<string>(coachStateMeta.defaultMessage);
  const [loadingBrief, setLoadingBrief] = useState<boolean>(false);

  // Sync default localized message whenever language or coach state changes
  useEffect(() => {
    setDailyBrief(t.coachStates[scoreSummary.coachState].defaultMessage);
  }, [settings.language, scoreSummary.coachState, t]);

  const handleRefreshBrief = async () => {
    setLoadingBrief(true);
    try {
      const res = await fetch('/api/coach/daily-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: settings.language,
          strictness: settings.strictness,
          coachState: scoreSummary.coachState,
          profileName: settings.profile.name,
          habits: habits.map((h) => ({
            title: h.title,
            description: h.description,
            reminderTime: h.reminderTime,
            completed: completedTodayIds.has(h.id),
          })),
          scoreSummary,
        }),
      });
      if (!res.ok) {
        throw new Error('Brief unavailable');
      }
      const data = (await res.json()) as { brief?: string };
      if (data.brief) {
        setDailyBrief(data.brief);
      }
    } catch {
      setDailyBrief(coachStateMeta.defaultMessage);
    } finally {
      setLoadingBrief(false);
    }
  };

  // Strictly enforce max 3 active habits rendered on Home
  const visibleHabits = habits.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#89948A]">
            <span className="text-[#B5FF38] font-extrabold lg:hidden">{t.brandName}</span>
            <span aria-hidden="true" className="lg:hidden">·</span>
            <span className="truncate">{formattedDate}</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#F4F7F2] sm:text-3xl truncate">
            {greeting}, {userName}
          </h1>
          <p className="mt-0.5 text-xs font-semibold tracking-wider text-[#89948A] lg:hidden">
            {t.slogan}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenNightReport}
            aria-label={t.dashboard.nightReport}
            className="flex h-12 items-center gap-2 rounded-2xl border border-[#253027] bg-[#111713] px-3.5 text-xs font-bold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/60 hover:text-[#B5FF38] cursor-pointer lg:hidden whitespace-nowrap"
          >
            <Moon className="h-4 w-4 text-[#B5FF38]" aria-hidden="true" />
            <span className="hidden sm:inline">{t.dashboard.nightReport}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label={t.nav.settings}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#253027] bg-[#111713] text-[#F4F7F2] transition-colors hover:border-[#B5FF38] hover:text-[#B5FF38] cursor-pointer"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Main Grid: Discipline Score + AI Coach Preview on Desktop; Stacked on Mobile */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* DISCIPLINE SCORE HERO CARD */}
        <div className="lg:col-span-7 rounded-[24px] border border-[#222C24] bg-gradient-to-br from-[#111713] via-[#111713] to-[#162018] p-5 sm:p-7 flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-bold tracking-widest text-[#89948A] uppercase">
              {t.dashboard.disciplineScore}
            </h2>
            <span className="font-mono-tabular text-xs font-bold text-[#B5FF38] whitespace-nowrap">
              {scoreSummary.completedCount} / {scoreSummary.totalCount}
            </span>
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <DisciplineRing
              score={scoreSummary.dailyScore}
              completionPct={scoreSummary.completionPercentage}
              scoreLabel={t.dashboard.dailyScore}
            />

            <div className="grid w-full flex-1 grid-cols-2 gap-3 sm:max-w-xs">
              <div className="rounded-[18px] bg-[#182019] p-4">
                <span className="text-xs font-semibold text-[#89948A]">
                  {t.dashboard.completion}
                </span>
                <p
                  data-testid="completion-pct"
                  className="font-mono-tabular mt-1.5 text-3xl font-extrabold text-[#F4F7F2]"
                >
                  {scoreSummary.completionPercentage}%
                </p>
              </div>

              <div className="rounded-[18px] bg-[#182019] p-4">
                <span className="text-xs font-semibold text-[#89948A]">
                  {t.dashboard.currentStreak}
                </span>
                <p
                  data-testid="current-streak"
                  className="font-mono-tabular mt-1.5 flex items-baseline gap-1.5 text-3xl font-extrabold text-[#B5FF38]"
                >
                  <Flame className="h-5 w-5 self-center shrink-0" aria-hidden="true" />
                  <span>{scoreSummary.currentStreak}</span>
                  <span className="text-xs font-semibold text-[#89948A]">
                    {t.dashboard.daysUnit}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenNightReport}
                className="col-span-2 inline-flex h-[54px] items-center justify-center gap-2 rounded-[18px] border border-[#2C392E] bg-[#182019] px-4 text-sm font-bold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/60 hover:text-[#B5FF38] cursor-pointer"
              >
                <Moon className="h-4 w-4 text-[#B5FF38]" aria-hidden="true" />
                <span>{t.dashboard.nightReport}</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI COACH PREVIEW CARD */}
        <div className="lg:col-span-5 rounded-[24px] border border-[#222C24] bg-[#111713] p-5 sm:p-7 flex flex-col justify-between gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold tracking-widest text-[#89948A] uppercase">
                  {t.dashboard.coachSectionTitle}
                </h2>
                <span aria-hidden="true" className="text-[#455447]">·</span>
                <span
                  className="text-xs font-extrabold tracking-wide"
                  style={{ color: lighting.accentHex }}
                >
                  {coachStateMeta.label}
                </span>
              </div>
              <p className="text-xs font-medium text-[#89948A] leading-snug">
                {coachStateMeta.statusLine}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshBrief}
              disabled={loadingBrief}
              aria-label={t.dashboard.refreshBrief}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#182019] text-[#89948A] transition-colors hover:text-[#B5FF38] disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`h-4 w-4 ${loadingBrief ? 'animate-spin text-[#B5FF38]' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <CoachAvatar
              state={scoreSummary.coachState}
              size="md"
              alt={coachStateMeta.label}
            />
            <p className="text-sm font-medium leading-relaxed text-[#F4F7F2]">
              {loadingBrief ? t.dashboard.loadingBrief : dailyBrief}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('coach')}
            className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-6 text-sm font-extrabold text-[#080B09] transition-colors hover:bg-[#c5ff61] cursor-pointer whitespace-nowrap"
          >
            <span>{t.dashboard.openCoach}</span>
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ACTIVE HABITS SECTION (Strictly max 3) */}
      <section aria-labelledby="active-habits-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2
              id="active-habits-heading"
              className="text-xl font-extrabold tracking-tight text-[#F4F7F2]"
            >
              {t.dashboard.activeHabitsTitle}
            </h2>
            <p className="mt-0.5 text-sm text-[#89948A]">
              {t.dashboard.activeHabitsSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('habits')}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl px-3 text-sm font-bold text-[#B5FF38] transition-colors hover:bg-[#182019] cursor-pointer whitespace-nowrap"
          >
            <Target className="h-4 w-4" aria-hidden="true" />
            <span>{t.dashboard.maxThreeRule}</span>
          </button>
        </div>

        {visibleHabits.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#2C392E] bg-[#111713] p-8 text-center">
            <h3 className="text-lg font-bold text-[#F4F7F2]">
              {t.dashboard.emptyHabitsTitle}
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-[#89948A]">
              {t.dashboard.emptyHabitsDesc}
            </p>
            <button
              type="button"
              onClick={() => onNavigate('habits')}
              className="mt-5 inline-flex h-[54px] items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-6 text-sm font-extrabold text-[#080B09] transition-colors hover:bg-[#c5ff61] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
              <span>{t.dashboard.goToHabits}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5" data-testid="dashboard-habits-list">
            {visibleHabits.map((habit, index) => (
              <HabitCard
                key={habit.id}
                index={index}
                habit={habit}
                completed={completedTodayIds.has(habit.id)}
                onToggle={onToggleHabit}
                maskTitle={settings.privacy.incognitoMetrics}
                labels={{
                  markComplete: t.dashboard.markComplete,
                  completedLabel: t.dashboard.completedLabel,
                  pendingLabel: t.dashboard.pendingLabel,
                  reminderPrefix: t.dashboard.reminderPrefix,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
