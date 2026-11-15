import { useMemo, useState } from 'react';
import { Award, Flame, Moon, TrendingUp } from 'lucide-react';
import type { DayLog, Habit, Language, ScoreSummary } from '../types';
import type { TranslationBundle } from '../i18n/translations';
import {
  getHabitConsistency,
  getOverallCompletionRate,
  getPerformanceSeries,
} from '../utils/discipline';

interface StatsScreenProps {
  habits: Habit[];
  history: Record<string, DayLog>;
  todayKey: string;
  scoreSummary: ScoreSummary;
  language: Language;
  t: TranslationBundle;
  onOpenNightReport: () => void;
}

export function StatsScreen({
  habits,
  history,
  todayKey,
  scoreSummary,
  language,
  t,
  onOpenNightReport,
}: StatsScreenProps) {
  const weekly = useMemo(
    () =>
      getPerformanceSeries({
        history,
        todayKey,
        days: 7,
        locale: language,
      }),
    [history, todayKey, language],
  );

  const monthly = useMemo(
    () =>
      getPerformanceSeries({
        history,
        todayKey,
        days: 30,
        locale: language,
      }),
    [history, todayKey, language],
  );

  const consistency = useMemo(
    () => getHabitConsistency(habits, history),
    [habits, history],
  );

  const overallRate = useMemo(() => getOverallCompletionRate(history), [history]);

  const sortedHistory = useMemo(
    () =>
      Object.values(history)
        .filter((l) => l.activeHabitCount > 0)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14),
    [history],
  );

  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(6);
  const selectedWeekPoint = weekly[selectedWeekIndex] ?? weekly[weekly.length - 1];

  const hasHistory = Object.keys(history).length > 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#F4F7F2] sm:text-3xl">
            {t.statsScreen.title}
          </h1>
          <p className="mt-1 text-sm text-[#89948A]">{t.statsScreen.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenNightReport}
          className="inline-flex h-[54px] shrink-0 items-center justify-center gap-2 rounded-[18px] border border-[#2C392E] bg-[#182019] px-5 text-sm font-bold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/60 hover:text-[#B5FF38] cursor-pointer whitespace-nowrap"
        >
          <Moon className="h-4 w-4 text-[#B5FF38]" aria-hidden="true" />
          <span>{t.statsScreen.openNightReport}</span>
        </button>
      </header>

      {/* Top 4 KPI Row */}
      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <div className="rounded-[22px] border border-[#222C24] bg-[#111713] p-5">
          <p className="text-xs font-semibold text-[#89948A]">
            {t.statsScreen.completionRate}
          </p>
          <p className="font-mono-tabular mt-2 text-3xl font-extrabold text-[#B5FF38]">
            {overallRate}%
          </p>
        </div>

        <div className="rounded-[22px] border border-[#222C24] bg-[#111713] p-5">
          <p className="text-xs font-semibold text-[#89948A]">
            {t.statsScreen.currentStreak}
          </p>
          <p className="font-mono-tabular mt-2 flex items-center gap-1.5 text-3xl font-extrabold text-[#F4F7F2]">
            <Flame className="h-6 w-6 text-[#B5FF38]" aria-hidden="true" />
            <span>{scoreSummary.currentStreak}</span>
          </p>
        </div>

        <div className="rounded-[22px] border border-[#222C24] bg-[#111713] p-5">
          <p className="text-xs font-semibold text-[#89948A]">
            {t.statsScreen.bestStreak}
          </p>
          <p className="font-mono-tabular mt-2 flex items-center gap-1.5 text-3xl font-extrabold text-[#F4F7F2]">
            <Award className="h-6 w-6 text-[#75D927]" aria-hidden="true" />
            <span>{scoreSummary.bestStreak}</span>
          </p>
        </div>

        <div className="rounded-[22px] border border-[#222C24] bg-[#111713] p-5">
          <p className="text-xs font-semibold text-[#89948A]">
            {t.statsScreen.todayScore}
          </p>
          <p className="font-mono-tabular mt-2 flex items-center gap-1.5 text-3xl font-extrabold text-[#F4F7F2]">
            <TrendingUp className="h-6 w-6 text-[#B5FF38]" aria-hidden="true" />
            <span>{scoreSummary.dailyScore}</span>
          </p>
        </div>
      </section>

      {!hasHistory ? (
        <div className="rounded-[24px] border border-dashed border-[#2C392E] bg-[#111713] p-10 text-center">
          <h2 className="text-lg font-bold text-[#F4F7F2]">
            {t.statsScreen.emptyTitle}
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#89948A]">
            {t.statsScreen.emptyDesc}
          </p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Weekly Performance Bar Chart */}
            <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                    {t.statsScreen.weeklyTitle}
                  </h2>
                  <p className="text-xs text-[#89948A]">{t.statsScreen.last7Days}</p>
                </div>
                {selectedWeekPoint && (
                  <div className="text-right">
                    <p className="font-mono-tabular text-xs font-semibold text-[#89948A]">
                      {selectedWeekPoint.date}
                    </p>
                    <p className="font-mono-tabular text-lg font-extrabold text-[#B5FF38]">
                      {selectedWeekPoint.score} / 100
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-7 items-end gap-2 pt-2 h-48">
                {weekly.map((point, idx) => {
                  const isSelected = idx === selectedWeekIndex;
                  const heightPct = Math.max(8, point.score);
                  return (
                    <button
                      key={point.date}
                      type="button"
                      onClick={() => setSelectedWeekIndex(idx)}
                      aria-label={`${point.date}: ${point.score}`}
                      className="group flex h-full flex-col items-center justify-end gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B5FF38] rounded-xl"
                    >
                      <span className="font-mono-tabular text-[11px] font-bold text-[#89948A] group-hover:text-[#F4F7F2]">
                        {point.score}
                      </span>
                      <div className="relative flex h-32 w-full items-end justify-center rounded-xl bg-[#182019] p-1">
                        <div
                          className="w-full rounded-lg transition-all duration-300"
                          style={{
                            height: `${heightPct}%`,
                            backgroundColor:
                              point.score === 100
                                ? '#B5FF38'
                                : point.score > 0
                                  ? '#75D927'
                                  : '#263028',
                            opacity: isSelected ? 1 : 0.78,
                          }}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-[#B5FF38]' : 'text-[#89948A]'
                        }`}
                      >
                        {point.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Monthly 30-Day Execution Chart */}
            <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                    {t.statsScreen.monthlyTitle}
                  </h2>
                  <p className="text-xs text-[#89948A]">{t.statsScreen.last30Days}</p>
                </div>
                <span className="font-mono-tabular text-xs font-bold text-[#75D927]">
                  {overallRate}% {t.statsScreen.avgLabel}
                </span>
              </div>

              <div className="relative h-48 pt-2">
                <div
                  aria-hidden="true"
                  className="font-mono-tabular pointer-events-none absolute inset-y-2 left-0 flex flex-col justify-between text-[10px] font-semibold text-[#5E6A60]"
                >
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <svg
                  viewBox="0 0 300 120"
                  className="h-full w-full overflow-visible pl-7"
                  role="img"
                  aria-label={t.statsScreen.monthlyTitle}
                >
                  <defs>
                    <linearGradient id="monthlyArea" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#B5FF38" stopOpacity="0.32" />
                      <stop offset="100%" stopColor="#B5FF38" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal reference lines */}
                  {[0, 50, 100].map((val) => {
                    const y = 104 - (val / 100) * 90;
                    return (
                      <line
                        key={val}
                        x1="0"
                        y1={y}
                        x2="300"
                        y2={y}
                        stroke="#222C24"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* 30-day polyline + area */}
                  {(() => {
                    const coords = monthly.map((pt, idx) => {
                      const x = (idx / Math.max(monthly.length - 1, 1)) * 300;
                      const y = 104 - (pt.score / 100) * 90;
                      return { x, y, pt };
                    });
                    const linePath = coords
                      .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
                      .join(' ');
                    const areaPath = `${linePath} L 300 104 L 0 104 Z`;

                    return (
                      <>
                        <path d={areaPath} fill="url(#monthlyArea)" />
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#B5FF38"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {coords.map(
                          (c, idx) =>
                            c.pt.score > 0 && (
                              <circle
                                key={c.pt.date}
                                cx={c.x}
                                cy={c.y}
                                r={idx === coords.length - 1 ? 4 : 2.3}
                                fill={c.pt.score === 100 ? '#B5FF38' : '#75D927'}
                              />
                            ),
                        )}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </section>
          </div>

          {/* Habit Consistency + Daily Score History */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Habit Consistency */}
            <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 lg:col-span-5 space-y-4">
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.statsScreen.consistencyTitle}
              </h2>

              <div className="space-y-4">
                {consistency.map((item, idx) => (
                  <div key={item.habitId} className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="font-semibold text-[#F4F7F2] truncate">
                        0{idx + 1}. {item.title}
                      </span>
                      <span className="font-mono-tabular shrink-0 font-bold text-[#B5FF38]">
                        {item.rate}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#182019]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#75D927] to-[#B5FF38] transition-all duration-500"
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <p className="font-mono-tabular text-xs text-[#89948A]">
                      {item.completedDays} / {item.trackedDays} {t.statsScreen.daysCompleted}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Daily Score History Table */}
            <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 lg:col-span-7 space-y-4">
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.statsScreen.historyTitle}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#222C24] text-xs font-bold text-[#89948A] uppercase">
                      <th className="py-2.5 pr-4">{t.statsScreen.dateColumn}</th>
                      <th className="py-2.5 px-4">{t.statsScreen.habitsDone}</th>
                      <th className="py-2.5 pl-4 text-right">{t.statsScreen.scoreLabel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1B231D]">
                    {sortedHistory.map((log) => (
                      <tr key={log.date} className="h-11">
                        <td className="font-mono-tabular py-2.5 pr-4 font-semibold text-[#F4F7F2]">
                          {log.date}
                        </td>
                        <td className="font-mono-tabular py-2.5 px-4 text-[#89948A]">
                          {log.completedHabitIds.length} / {log.activeHabitCount}
                        </td>
                        <td
                          className={`font-mono-tabular py-2.5 pl-4 text-right font-extrabold ${
                            log.score === 100
                              ? 'text-[#B5FF38]'
                              : log.score > 0
                                ? 'text-[#75D927]'
                                : 'text-[#FF414B]'
                          }`}
                        >
                          {log.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
