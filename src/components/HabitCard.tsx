import { motion } from 'motion/react';
import { Bell, Check } from 'lucide-react';
import type { Habit } from '../types';

interface HabitCardProps {
  index: number;
  habit: Habit;
  completed: boolean;
  onToggle: (habitId: string) => void;
  labels: {
    markComplete: string;
    completedLabel: string;
    pendingLabel: string;
    reminderPrefix: string;
  };
  maskTitle?: boolean;
}

export function HabitCard({
  index,
  habit,
  completed,
  onToggle,
  labels,
  maskTitle = false,
}: HabitCardProps) {
  const numLabel = `0${index + 1}`;
  const displayTitle = maskTitle ? `${labels.completedLabel === 'Executed' ? 'Protocol' : 'Protokol'} ${numLabel}` : habit.title;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      data-testid={`habit-card-${index + 1}`}
      data-completed={completed ? 'true' : 'false'}
      className={`relative rounded-[22px] border p-5 sm:p-6 transition-colors duration-200 ${
        completed
          ? 'border-[#B5FF38]/45 bg-[#111713] shadow-[0_0_28px_rgba(181,255,56,0.10)]'
          : 'border-[#222C24] bg-[#111713] hover:border-[#314034]'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {/* Clean unboxed typographic metadata row */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-[#89948A]">
            <span className="font-mono-tabular text-[#B5FF38]">{numLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-mono-tabular">
              <Bell className="h-3.5 w-3.5 text-[#89948A]" aria-hidden="true" />
              {labels.reminderPrefix} {habit.reminderTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className={completed ? 'text-[#B5FF38]' : 'text-[#89948A]'}>
              {completed ? labels.completedLabel : labels.pendingLabel}
            </span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-[#F4F7F2] sm:text-xl">
            {displayTitle}
          </h3>

          <p className="text-sm leading-relaxed text-[#89948A]">
            {maskTitle ? '••• •••• ••••••' : habit.description}
          </p>
        </div>

        <div className="shrink-0 pt-1 sm:pt-0">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onToggle(habit.id)}
            aria-pressed={completed}
            aria-label={
              completed
                ? `${labels.completedLabel}: ${habit.title}`
                : `${labels.markComplete}: ${habit.title}`
            }
            className={`inline-flex h-[54px] w-full sm:w-auto min-w-[148px] items-center justify-center gap-2.5 rounded-[18px] px-6 text-sm font-bold tracking-wide transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5FF38] cursor-pointer whitespace-nowrap ${
              completed
                ? 'bg-[#B5FF38] text-[#080B09] shadow-[0_0_20px_rgba(181,255,56,0.3)] hover:bg-[#c3ff5c]'
                : 'bg-[#182019] text-[#F4F7F2] border border-[#2C392E] hover:border-[#B5FF38]/60 hover:text-[#B5FF38]'
            }`}
          >
            <motion.span
              initial={false}
              animate={completed ? { scale: [0.6, 1.18, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                completed ? 'bg-[#080B09] text-[#B5FF38]' : 'border border-[#47584A] text-transparent'
              }`}
            >
              <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" />
            </motion.span>
            <span>{completed ? labels.completedLabel : labels.markComplete}</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
