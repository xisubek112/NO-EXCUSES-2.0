import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Flame, X, XCircle } from 'lucide-react';
import type { Habit, ScoreSummary } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { CoachAvatar } from './CoachAvatar';

interface NightReportModalProps {
  open: boolean;
  onClose: () => void;
  onPlanTomorrow: () => void;
  habits: Habit[];
  completedTodayIds: Set<string>;
  scoreSummary: ScoreSummary;
  t: TranslationBundle;
  dateLabel: string;
}

export function NightReportModal({
  open,
  onClose,
  onPlanTomorrow,
  habits,
  completedTodayIds,
  scoreSummary,
  t,
  dateLabel,
}: NightReportModalProps) {
  const verdictText =
    scoreSummary.totalCount > 0 && scoreSummary.completedCount === scoreSummary.totalCount
      ? t.nightReport.allDoneVerdict
      : scoreSummary.completedCount > 0
        ? t.nightReport.partialVerdict
        : t.nightReport.zeroVerdict;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="night-report-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-xl overflow-hidden rounded-[24px] border border-[#263228] bg-[#111713] shadow-[0_24px_80px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-start justify-between border-b border-[#222C24] p-6">
              <div>
                <p className="font-mono-tabular text-xs font-semibold tracking-wider text-[#B5FF38] uppercase">
                  {dateLabel}
                </p>
                <h2
                  id="night-report-title"
                  className="mt-1 text-2xl font-extrabold tracking-tight text-[#F4F7F2]"
                >
                  {t.nightReport.title}
                </h2>
                <p className="mt-0.5 text-sm text-[#89948A]">{t.nightReport.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.nightReport.close}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182019] text-[#89948A] transition-colors hover:text-[#F4F7F2] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Verdict Banner */}
              <div className="flex items-center gap-4 rounded-[20px] bg-[#182019] p-4 border border-[#243026]">
                <CoachAvatar
                  state={scoreSummary.coachState}
                  size="md"
                  alt={t.coachStates[scoreSummary.coachState].label}
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wide text-[#B5FF38]">
                    <span>{t.nightReport.verdictLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>{t.coachStates[scoreSummary.coachState].label}</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[#F4F7F2]">
                    {verdictText}
                  </p>
                </div>
              </div>

              {/* Three Numeric KPI Columns */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[18px] bg-[#182019] p-4">
                  <p className="text-xs font-medium text-[#89948A]">{t.nightReport.finalScore}</p>
                  <p className="font-mono-tabular mt-1 text-3xl font-extrabold text-[#B5FF38]">
                    {scoreSummary.dailyScore}
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#182019] p-4">
                  <p className="text-xs font-medium text-[#89948A]">{t.nightReport.habitsCompleted}</p>
                  <p className="font-mono-tabular mt-1 text-3xl font-extrabold text-[#F4F7F2]">
                    {scoreSummary.completedCount}/{scoreSummary.totalCount}
                  </p>
                </div>
                <div className="rounded-[18px] bg-[#182019] p-4">
                  <p className="text-xs font-medium text-[#89948A]">{t.nightReport.streakStatus}</p>
                  <p className="font-mono-tabular mt-1 inline-flex items-center gap-1.5 text-3xl font-extrabold text-[#F4F7F2]">
                    <Flame className="h-5 w-5 text-[#B5FF38]" aria-hidden="true" />
                    {scoreSummary.currentStreak}
                  </p>
                </div>
              </div>

              {/* Habit Execution Breakdown */}
              {habits.length > 0 && (
                <ul className="divide-y divide-[#222C24] rounded-[18px] border border-[#222C24] bg-[#080B09]/60">
                  {habits.map((h, i) => {
                    const done = completedTodayIds.has(h.id);
                    return (
                      <li
                        key={h.id}
                        className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono-tabular text-xs font-bold text-[#89948A]">
                            0{i + 1}
                          </span>
                          <span className="truncate font-semibold text-[#F4F7F2]">{h.title}</span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap ${
                            done ? 'text-[#B5FF38]' : 'text-[#FF414B]'
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                          )}
                          {done ? t.dashboard.completedLabel : t.dashboard.pendingLabel}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-[54px] flex-1 rounded-[18px] border border-[#2A362C] bg-[#182019] px-5 text-sm font-bold text-[#F4F7F2] transition-colors hover:border-[#89948A] cursor-pointer"
                >
                  {t.nightReport.close}
                </button>
                <button
                  type="button"
                  onClick={onPlanTomorrow}
                  className="inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-5 text-sm font-extrabold text-[#080B09] transition-colors hover:bg-[#c5ff61] cursor-pointer"
                >
                  <span>{t.nightReport.planTomorrow}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
