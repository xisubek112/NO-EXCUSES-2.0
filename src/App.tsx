import { useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import type { TabId } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { useDisciplineStore } from './hooks/useDisciplineStore';
import { NavigationBar } from './components/NavigationBar';
import { HomeDashboard } from './components/HomeDashboard';
import { HabitsScreen } from './components/HabitsScreen';
import { AICoachScreen } from './components/AICoachScreen';
import { StatsScreen } from './components/StatsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NightReportModal } from './components/NightReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [nightReportOpen, setNightReportOpen] = useState(false);

  const {
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
  } = useDisciplineStore();

  const t = TRANSLATIONS[settings.language];

  const formattedDate = useMemo(() => {
    const localeTag = settings.language === 'uz' ? 'uz-UZ' : 'en-US';
    try {
      return new Intl.DateTimeFormat(localeTag, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date());
    } catch {
      return todayKey;
    }
  }, [settings.language, todayKey]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#080B09] text-[#F4F7F2] lg:flex">
        <NavigationBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenNightReport={() => setNightReportOpen(true)}
          labels={{
            brandName: t.brandName,
            slogan: t.slogan,
            nav: t.nav,
            nightReport: t.dashboard.nightReport,
          }}
        />

        <main className="min-w-0 flex-1 px-4 pt-5 pb-28 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'home' && (
                  <HomeDashboard
                    habits={habits}
                    completedTodayIds={completedTodayIds}
                    scoreSummary={scoreSummary}
                    settings={settings}
                    t={t}
                    formattedDate={formattedDate}
                    onToggleHabit={toggleHabitToday}
                    onNavigate={setActiveTab}
                    onOpenNightReport={() => setNightReportOpen(true)}
                  />
                )}

                {activeTab === 'habits' && (
                  <HabitsScreen
                    habits={habits}
                    completedTodayIds={completedTodayIds}
                    t={t}
                    onAddHabit={addHabit}
                    onUpdateHabit={updateHabit}
                    onDeleteHabit={deleteHabit}
                    onToggleHabitToday={toggleHabitToday}
                  />
                )}

                {activeTab === 'coach' && (
                  <AICoachScreen
                    habits={habits}
                    completedTodayIds={completedTodayIds}
                    scoreSummary={scoreSummary}
                    settings={settings}
                    messages={messages}
                    onAppendMessage={appendChatMessage}
                    onClearChat={clearChat}
                  />
                )}

                {activeTab === 'stats' && (
                  <StatsScreen
                    habits={habits}
                    history={history}
                    todayKey={todayKey}
                    scoreSummary={scoreSummary}
                    language={settings.language}
                    t={t}
                    onOpenNightReport={() => setNightReportOpen(true)}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsScreen
                    settings={settings}
                    habits={habits}
                    history={history}
                    t={t}
                    onSetLanguage={setLanguage}
                    onUpdateSettings={updateSettings}
                    onResetAllData={resetAllData}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <NightReportModal
          open={nightReportOpen}
          onClose={() => setNightReportOpen(false)}
          onPlanTomorrow={() => {
            setNightReportOpen(false);
            setActiveTab('coach');
          }}
          habits={habits}
          completedTodayIds={completedTodayIds}
          scoreSummary={scoreSummary}
          t={t}
          dateLabel={formattedDate}
        />
      </div>
    </MotionConfig>
  );
}
