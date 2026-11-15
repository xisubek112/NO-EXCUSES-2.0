import { motion } from 'motion/react';
import {
  BarChart3,
  Bot,
  CheckSquare,
  Home,
  Moon,
  Settings,
} from 'lucide-react';
import type { TabId } from '../types';

interface NavigationBarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenNightReport: () => void;
  labels: {
    brandName: string;
    slogan: string;
    nav: {
      home: string;
      habits: string;
      coach: string;
      stats: string;
      settings: string;
    };
    nightReport: string;
  };
}

const NAV_ITEMS: Array<{
  id: TabId;
  icon: typeof Home;
  key: keyof NavigationBarProps['labels']['nav'];
}> = [
  { id: 'home', icon: Home, key: 'home' },
  { id: 'habits', icon: CheckSquare, key: 'habits' },
  { id: 'coach', icon: Bot, key: 'coach' },
  { id: 'stats', icon: BarChart3, key: 'stats' },
  { id: 'settings', icon: Settings, key: 'settings' },
];

export function NavigationBar({
  activeTab,
  onSelectTab,
  onOpenNightReport,
  labels,
}: NavigationBarProps) {
  return (
    <>
      {/* Desktop Command Rail (>= lg) */}
      <aside
        aria-label="Primary navigation"
        className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:justify-between lg:border-r lg:border-[#222C24] lg:bg-[#111713] lg:p-6"
      >
        <div className="space-y-8">
          <div className="space-y-2 border-b border-[#222C24] pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B5FF38] text-sm font-extrabold text-[#080B09]">
                NE
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#F4F7F2] whitespace-nowrap">
                {labels.brandName}
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-[#89948A]">
              {labels.slogan}
            </p>
          </div>

          <nav className="space-y-1.5" aria-label="Main sections">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative flex min-h-[48px] w-full items-center gap-3 rounded-2xl px-4 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'text-[#080B09]'
                      : 'text-[#89948A] hover:bg-[#182019] hover:text-[#F4F7F2]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="desktopNavActive"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-2xl bg-[#B5FF38]"
                    />
                  )}
                  <Icon className="relative z-10 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="relative z-10">{labels.nav[item.key]}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={onOpenNightReport}
          className="flex h-[54px] w-full items-center justify-center gap-2.5 rounded-[18px] border border-[#2A362C] bg-[#182019] px-4 text-sm font-bold text-[#F4F7F2] transition-colors hover:border-[#B5FF38]/60 hover:text-[#B5FF38] cursor-pointer whitespace-nowrap"
        >
          <Moon className="h-4 w-4 text-[#B5FF38]" aria-hidden="true" />
          <span>{labels.nightReport}</span>
        </button>
      </aside>

      {/* Mobile Floating Bottom Navigation Bar (< lg) */}
      <nav
        aria-label="Bottom navigation"
        className="fixed bottom-3 inset-x-3 z-40 mx-auto max-w-lg lg:hidden pb-safe-nav"
      >
        <div className="grid grid-cols-5 items-center rounded-[24px] border border-[#253027] bg-[#111713]/95 p-1.5 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.7)]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={active ? 'page' : undefined}
                aria-label={labels.nav[item.key]}
                className={`relative flex min-h-[48px] flex-col items-center justify-center gap-0.5 rounded-[18px] px-1 py-1.5 transition-colors cursor-pointer ${
                  active ? 'text-[#080B09]' : 'text-[#89948A] hover:text-[#F4F7F2]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="mobileNavActive"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-[18px] bg-[#B5FF38] shadow-[0_0_16px_rgba(181,255,56,0.35)]"
                  />
                )}
                <Icon className="relative z-10 h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="relative z-10 text-[10px] font-bold tracking-tight whitespace-nowrap truncate max-w-full">
                  {labels.nav[item.key]}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
