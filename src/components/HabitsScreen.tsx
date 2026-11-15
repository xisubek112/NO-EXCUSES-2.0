import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  Bell,
  Check,
  Edit3,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import type { Habit } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import { MAX_ACTIVE_HABITS, canAddHabit } from '../utils/discipline';

interface HabitsScreenProps {
  habits: Habit[];
  completedTodayIds: Set<string>;
  t: TranslationBundle;
  onAddHabit: (input: {
    title: string;
    description: string;
    reminderTime: string;
  }) => boolean;
  onUpdateHabit: (
    id: string,
    patch: { title: string; description: string; reminderTime: string },
  ) => void;
  onDeleteHabit: (id: string) => void;
  onToggleHabitToday: (id: string) => void;
}

export function HabitsScreen({
  habits,
  completedTodayIds,
  t,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onToggleHabitToday,
}: HabitsScreenProps) {
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState('07:00');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    if (!canAddHabit(habits)) {
      setShowLimitWarning(true);
      return;
    }
    setEditingHabit(null);
    setTitle('');
    setDescription('');
    setReminderTime('07:00');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setTitle(habit.title);
    setDescription(habit.description);
    setReminderTime(habit.reminderTime);
    setFormError('');
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setFormError(t.habitsScreen.validationRequired);
      return;
    }

    if (editingHabit) {
      onUpdateHabit(editingHabit.id, { title, description, reminderTime });
      setFormOpen(false);
    } else {
      const ok = onAddHabit({ title, description, reminderTime });
      if (!ok) {
        setFormOpen(false);
        setShowLimitWarning(true);
        return;
      }
      setFormOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#89948A]">
            <span>{t.habitsScreen.activeCountLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular font-bold text-[#B5FF38]">
              {habits.length} / {MAX_ACTIVE_HABITS}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#F4F7F2] sm:text-3xl">
            {t.habitsScreen.title}
          </h1>
          <p className="mt-1 text-sm text-[#89948A]">{t.habitsScreen.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex h-[54px] shrink-0 items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-6 text-sm font-extrabold text-[#080B09] transition-colors hover:bg-[#c5ff61] cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-4 w-4 stroke-[2.75]" aria-hidden="true" />
          <span>{t.habitsScreen.addHabit}</span>
        </button>
      </header>

      {/* Premium Animated Three-Habit Rule Warning */}
      <AnimatePresence>
        {showLimitWarning && (
          <motion.div
            role="alert"
            data-testid="three-habit-warning"
            initial={{ opacity: 0, scale: 0.96, x: 0 }}
            animate={{ opacity: 1, scale: 1, x: [0, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="rounded-[22px] border border-[#FF414B]/50 bg-[#1A1113] p-5 shadow-[0_0_28px_rgba(255,65,75,0.18)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF414B]/15 text-[#FF414B]">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold tracking-wide text-[#FF414B] uppercase">
                    {t.habitsScreen.limitWarningTitle}
                  </h2>
                  <p className="mt-1 text-base font-bold text-[#F4F7F2]">
                    {t.habitsScreen.limitWarningMessage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLimitWarning(false)}
                className="h-12 shrink-0 rounded-2xl bg-[#27181B] px-5 text-sm font-bold text-[#F4F7F2] transition-colors hover:bg-[#352024] cursor-pointer whitespace-nowrap"
              >
                {t.habitsScreen.limitWarningAction}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits List or Empty State */}
      {habits.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#2C392E] bg-[#111713] p-10 text-center">
          <h2 className="text-lg font-bold text-[#F4F7F2]">
            {t.habitsScreen.emptyTitle}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#89948A]">
            {t.habitsScreen.emptyDesc}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-5 inline-flex h-[54px] items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-6 text-sm font-extrabold text-[#080B09] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.75]" aria-hidden="true" />
            <span>{t.habitsScreen.addHabit}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {habits.map((habit, index) => {
            const done = completedTodayIds.has(habit.id);
            return (
              <motion.article
                key={habit.id}
                layout
                className={`rounded-[22px] border bg-[#111713] p-5 sm:p-6 transition-colors ${
                  done ? 'border-[#B5FF38]/45' : 'border-[#222C24]'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#89948A]">
                      <span className="font-mono-tabular text-[#B5FF38]">
                        0{index + 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 font-mono-tabular">
                        <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                        {habit.reminderTime}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={done ? 'text-[#B5FF38]' : 'text-[#89948A]'}>
                        {done ? t.dashboard.completedLabel : t.dashboard.pendingLabel}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#F4F7F2] sm:text-xl">
                      {habit.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#89948A]">
                      {habit.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleHabitToday(habit.id)}
                      aria-label={
                        done
                          ? `${t.dashboard.completedLabel}: ${habit.title}`
                          : `${t.dashboard.markComplete}: ${habit.title}`
                      }
                      className={`inline-flex h-12 items-center gap-2 rounded-2xl px-4 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                        done
                          ? 'bg-[#B5FF38] text-[#080B09]'
                          : 'bg-[#182019] text-[#F4F7F2] border border-[#2C392E] hover:border-[#B5FF38]'
                      }`}
                    >
                      <Check className="h-4 w-4 stroke-[2.75]" aria-hidden="true" />
                      <span>{done ? t.dashboard.completedLabel : t.dashboard.markComplete}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(habit)}
                      aria-label={`${t.habitsScreen.editHabit} ${habit.title}`}
                      className="inline-flex h-12 items-center gap-1.5 rounded-2xl border border-[#253027] bg-[#182019] px-4 text-xs font-bold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/60 hover:text-[#B5FF38] cursor-pointer whitespace-nowrap"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                      <span>{t.habitsScreen.editHabit}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(habit)}
                      aria-label={`${t.habitsScreen.deleteHabit} ${habit.title}`}
                      className="inline-flex h-12 items-center gap-1.5 rounded-2xl border border-[#352024] bg-[#1A1113] px-4 text-xs font-bold text-[#FF414B] transition-colors hover:bg-[#27161A] cursor-pointer whitespace-nowrap"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      <span>{t.habitsScreen.deleteHabit}</span>
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Add / Edit Habit Dialog */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="habit-form-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              className="w-full max-w-lg rounded-[24px] border border-[#263228] bg-[#111713] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2
                  id="habit-form-title"
                  className="text-xl font-extrabold text-[#F4F7F2]"
                >
                  {editingHabit ? t.habitsScreen.formTitleEdit : t.habitsScreen.formTitleAdd}
                </h2>
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  aria-label={t.habitsScreen.cancel}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#182019] text-[#89948A] hover:text-[#F4F7F2] cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              {formError && (
                <p role="alert" className="rounded-xl bg-[#FF414B]/12 px-4 py-3 text-sm font-semibold text-[#FF414B]">
                  {formError}
                </p>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="habit-title-input"
                    className="block text-xs font-bold tracking-wide text-[#89948A] uppercase"
                  >
                    {t.habitsScreen.fieldName}
                  </label>
                  <input
                    id="habit-title-input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t.habitsScreen.fieldNamePlaceholder}
                    maxLength={70}
                    className="mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-4 text-sm font-semibold text-[#F4F7F2] placeholder-[#525E54] focus:border-[#B5FF38] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="habit-desc-input"
                    className="block text-xs font-bold tracking-wide text-[#89948A] uppercase"
                  >
                    {t.habitsScreen.fieldDesc}
                  </label>
                  <textarea
                    id="habit-desc-input"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.habitsScreen.fieldDescPlaceholder}
                    maxLength={180}
                    className="mt-1.5 w-full rounded-2xl border border-[#253027] bg-[#080B09] p-4 text-sm text-[#F4F7F2] placeholder-[#525E54] focus:border-[#B5FF38] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="habit-reminder-input"
                    className="block text-xs font-bold tracking-wide text-[#89948A] uppercase"
                  >
                    {t.habitsScreen.fieldReminder}
                  </label>
                  <input
                    id="habit-reminder-input"
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="font-mono-tabular mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-4 text-sm font-semibold text-[#F4F7F2] focus:border-[#B5FF38] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="h-[54px] flex-1 rounded-[18px] border border-[#253027] bg-[#182019] px-5 text-sm font-bold text-[#F4F7F2] cursor-pointer"
                >
                  {t.habitsScreen.cancel}
                </button>
                <button
                  type="submit"
                  className="h-[54px] flex-1 rounded-[18px] bg-[#B5FF38] px-5 text-sm font-extrabold text-[#080B09] hover:bg-[#c5ff61] cursor-pointer"
                >
                  {t.habitsScreen.save}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-habit-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[24px] border border-[#352024] bg-[#111713] p-6 space-y-5"
            >
              <div>
                <h2 id="delete-habit-title" className="text-xl font-extrabold text-[#F4F7F2]">
                  {t.habitsScreen.confirmDeleteTitle}
                </h2>
                <p className="mt-2 text-sm text-[#89948A]">
                  {t.habitsScreen.confirmDeleteDesc}
                </p>
                <p className="mt-2 text-sm font-bold text-[#F4F7F2]">
                  “{deleteTarget.title}”
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="h-[54px] flex-1 rounded-[18px] border border-[#253027] bg-[#182019] px-4 text-sm font-bold text-[#F4F7F2] cursor-pointer"
                >
                  {t.habitsScreen.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteHabit(deleteTarget.id);
                    setDeleteTarget(null);
                  }}
                  className="h-[54px] flex-1 rounded-[18px] bg-[#FF414B] px-4 text-sm font-extrabold text-white hover:bg-[#ff5a63] cursor-pointer"
                >
                  {t.habitsScreen.confirmDeleteYes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
