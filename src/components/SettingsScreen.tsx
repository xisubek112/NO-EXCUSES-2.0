import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Download,
  Globe,
  Lock,
  Palette,
  Shield,
  Trash2,
} from 'lucide-react';
import type {
  AppSettings,
  CoachStrictness,
  DayLog,
  Habit,
  Language,
} from '../types';
import type { TranslationBundle } from '../i18n/translations';

interface SettingsScreenProps {
  settings: AppSettings;
  habits: Habit[];
  history: Record<string, DayLog>;
  t: TranslationBundle;
  onSetLanguage: (lang: Language) => void;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  onResetAllData: () => void;
}

export function SettingsScreen({
  settings,
  habits,
  history,
  t,
  onSetLanguage,
  onUpdateSettings,
  onResetAllData,
}: SettingsScreenProps) {
  const [nameDraft, setNameDraft] = useState(settings.profile.name);
  const [focusDraft, setFocusDraft] = useState(settings.profile.focusArea);
  const [profileSaved, setProfileSaved] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings((prev) => ({
      ...prev,
      profile: {
        name: nameDraft.trim() || prev.profile.name,
        focusArea: focusDraft.trim() || prev.profile.focusArea,
      },
    }));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleExportBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: 'NO EXCUSES v1.0',
      habits,
      history,
      settings,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `no-excuses-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const setStrictness = (strictness: CoachStrictness) => {
    onUpdateSettings((prev) => ({ ...prev, strictness }));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#F4F7F2] sm:text-3xl">
          {t.settingsScreen.title}
        </h1>
        <p className="mt-1 text-sm text-[#89948A]">{t.settingsScreen.subtitle}</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Language System */}
        <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-[#B5FF38] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.settingsScreen.languageTitle}
              </h2>
              <p className="mt-0.5 text-sm text-[#89948A]">
                {t.settingsScreen.languageDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3" role="group" aria-label={t.settingsScreen.languageTitle}>
            <button
              type="button"
              onClick={() => onSetLanguage('en')}
              aria-pressed={settings.language === 'en'}
              className={`h-[54px] rounded-[18px] border text-sm font-bold transition-colors cursor-pointer ${
                settings.language === 'en'
                  ? 'border-[#B5FF38] bg-[#B5FF38] text-[#080B09]'
                  : 'border-[#253027] bg-[#182019] text-[#F4F7F2] hover:border-[#B5FF38]/50'
              }`}
            >
              {t.settingsScreen.englishLabel}
            </button>
            <button
              type="button"
              onClick={() => onSetLanguage('uz')}
              aria-pressed={settings.language === 'uz'}
              className={`h-[54px] rounded-[18px] border text-sm font-bold transition-colors cursor-pointer ${
                settings.language === 'uz'
                  ? 'border-[#B5FF38] bg-[#B5FF38] text-[#080B09]'
                  : 'border-[#253027] bg-[#182019] text-[#F4F7F2] hover:border-[#B5FF38]/50'
              }`}
            >
              {t.settingsScreen.uzbekLabel}
            </button>
          </div>
        </section>

        {/* AI Coach Preferences */}
        <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-[#B5FF38] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.settingsScreen.coachPrefsTitle}
              </h2>
              <p className="mt-0.5 text-sm text-[#89948A]">
                {t.settingsScreen.coachIntensity}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setStrictness('balanced')}
              aria-pressed={settings.strictness === 'balanced'}
              className={`rounded-[18px] border p-4 text-left transition-colors cursor-pointer ${
                settings.strictness === 'balanced'
                  ? 'border-[#B5FF38] bg-[#182019]'
                  : 'border-[#253027] bg-[#0C100E] hover:border-[#394A3C]'
              }`}
            >
              <p className="text-sm font-extrabold text-[#F4F7F2]">
                {t.coachScreen.balancedModeLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#89948A]">
                {t.settingsScreen.balancedDesc}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setStrictness('relentless')}
              aria-pressed={settings.strictness === 'relentless'}
              className={`rounded-[18px] border p-4 text-left transition-colors cursor-pointer ${
                settings.strictness === 'relentless'
                  ? 'border-[#B5FF38] bg-[#182019]'
                  : 'border-[#253027] bg-[#0C100E] hover:border-[#394A3C]'
              }`}
            >
              <p className="text-sm font-extrabold text-[#B5FF38]">
                {t.coachScreen.strictModeLabel}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#89948A]">
                {t.settingsScreen.relentlessDesc}
              </p>
            </button>
          </div>
        </section>

        {/* Warrior Profile */}
        <form
          onSubmit={handleSaveProfile}
          className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-4"
        >
          <h2 className="text-lg font-extrabold text-[#F4F7F2]">
            {t.settingsScreen.profileTitle}
          </h2>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="profile-name-input"
                className="block text-xs font-bold tracking-wide text-[#89948A] uppercase"
              >
                {t.settingsScreen.displayName}
              </label>
              <input
                id="profile-name-input"
                type="text"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                maxLength={40}
                className="mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-4 text-sm font-semibold text-[#F4F7F2] focus:border-[#B5FF38] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="profile-focus-input"
                className="block text-xs font-bold tracking-wide text-[#89948A] uppercase"
              >
                {t.settingsScreen.focusArea}
              </label>
              <input
                id="profile-focus-input"
                type="text"
                value={focusDraft}
                onChange={(e) => setFocusDraft(e.target.value)}
                maxLength={80}
                className="mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-4 text-sm font-semibold text-[#F4F7F2] focus:border-[#B5FF38] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[18px] bg-[#B5FF38] px-5 text-sm font-extrabold text-[#080B09] hover:bg-[#c5ff61] cursor-pointer"
          >
            {profileSaved && <Check className="h-4 w-4 stroke-[2.75]" aria-hidden="true" />}
            <span>
              {profileSaved ? t.settingsScreen.profileSaved : t.settingsScreen.saveProfile}
            </span>
          </button>
        </form>

        {/* Notifications & Reminder Times */}
        <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-[#F4F7F2]">
            {t.settingsScreen.notificationsTitle}
          </h2>

          <div className="space-y-4">
            <label className="flex min-h-[48px] items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm font-semibold text-[#F4F7F2]">
                {t.settingsScreen.enableReminders}
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.enabled}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    notifications: { ...prev.notifications, enabled: e.target.checked },
                  }))
                }
                className="h-5 w-5 accent-[#B5FF38] cursor-pointer"
              />
            </label>

            <label className="flex min-h-[48px] items-center justify-between gap-4 cursor-pointer">
              <span className="text-sm font-semibold text-[#F4F7F2]">
                {t.settingsScreen.hapticsLabel}
              </span>
              <input
                type="checkbox"
                checked={settings.notifications.hapticsEnabled}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      hapticsEnabled: e.target.checked,
                    },
                  }))
                }
                className="h-5 w-5 accent-[#B5FF38] cursor-pointer"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="morning-checkin-time"
                  className="block text-xs font-bold text-[#89948A]"
                >
                  {t.settingsScreen.morningCheckIn}
                </label>
                <input
                  id="morning-checkin-time"
                  type="time"
                  value={settings.notifications.morningCheckIn}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        morningCheckIn: e.target.value,
                      },
                    }))
                  }
                  className="font-mono-tabular mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-3 text-sm font-semibold text-[#F4F7F2] focus:border-[#B5FF38] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="night-report-time"
                  className="block text-xs font-bold text-[#89948A]"
                >
                  {t.settingsScreen.nightReportTime}
                </label>
                <input
                  id="night-report-time"
                  type="time"
                  value={settings.notifications.nightReportTime}
                  onChange={(e) =>
                    onUpdateSettings((prev) => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        nightReportTime: e.target.value,
                      },
                    }))
                  }
                  className="font-mono-tabular mt-1.5 h-12 w-full rounded-2xl border border-[#253027] bg-[#080B09] px-3 text-sm font-semibold text-[#F4F7F2] focus:border-[#B5FF38] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Theme (Dark Warrior Only) */}
        <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Palette className="h-5 w-5 text-[#B5FF38]" aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.settingsScreen.themeTitle}
              </h2>
            </div>
            <span className="font-mono-tabular text-xs font-bold text-[#B5FF38]">
              {t.settingsScreen.themeValue}
            </span>
          </div>
          <p className="text-sm text-[#89948A]">{t.settingsScreen.themeNote}</p>
        </section>

        {/* Privacy & Account Settings */}
        <section className="rounded-[24px] border border-[#222C24] bg-[#111713] p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Lock className="mt-0.5 h-5 w-5 text-[#B5FF38] shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-extrabold text-[#F4F7F2]">
                {t.settingsScreen.privacyAccountTitle}
              </h2>
              <p className="mt-0.5 text-sm text-[#89948A]">
                {t.settingsScreen.privacyNote}
              </p>
            </div>
          </div>

          <label className="flex min-h-[48px] items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm font-semibold text-[#F4F7F2]">
              {t.settingsScreen.incognitoToggle}
            </span>
            <input
              type="checkbox"
              checked={settings.privacy.incognitoMetrics}
              onChange={(e) =>
                onUpdateSettings((prev) => ({
                  ...prev,
                  privacy: { ...prev.privacy, incognitoMetrics: e.target.checked },
                }))
              }
              className="h-5 w-5 accent-[#B5FF38] cursor-pointer"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleExportBackup}
              className="inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[18px] border border-[#253027] bg-[#182019] px-4 text-sm font-bold text-[#F4F7F2] hover:border-[#B5FF38]/60 cursor-pointer"
            >
              <Download className="h-4 w-4 text-[#B5FF38]" aria-hidden="true" />
              <span>{t.settingsScreen.exportBackup}</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="inline-flex h-[54px] flex-1 items-center justify-center gap-2 rounded-[18px] border border-[#352024] bg-[#1A1113] px-4 text-sm font-bold text-[#FF414B] hover:bg-[#27161A] cursor-pointer"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              <span>{t.settingsScreen.resetAll}</span>
            </button>
          </div>
        </section>
      </div>

      {/* Reset All Confirmation Dialog */}
      <AnimatePresence>
        {confirmResetOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-confirm-title"
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
                <h2 id="reset-confirm-title" className="text-xl font-extrabold text-[#F4F7F2]">
                  {t.settingsScreen.resetConfirmTitle}
                </h2>
                <p className="mt-2 text-sm text-[#89948A]">
                  {t.settingsScreen.resetConfirmDesc}
                </p>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(false)}
                  className="h-[54px] flex-1 rounded-[18px] border border-[#253027] bg-[#182019] px-4 text-sm font-bold text-[#F4F7F2] cursor-pointer"
                >
                  {t.settingsScreen.cancel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onResetAllData();
                    setConfirmResetOpen(false);
                  }}
                  className="h-[54px] flex-1 rounded-[18px] bg-[#FF414B] px-4 text-sm font-extrabold text-white cursor-pointer"
                >
                  {t.settingsScreen.resetConfirmYes}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
