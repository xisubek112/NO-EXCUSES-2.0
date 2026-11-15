import type { CoachState } from '../types';

export const DARK_WARRIOR_TOKENS = {
  bgPrimary: '#080B09',
  bgCard: '#111713',
  bgSecondary: '#182019',
  accentPrimary: '#B5FF38',
  accentSecondary: '#75D927',
  danger: '#FF414B',
  textPrimary: '#F4F7F2',
  textSecondary: '#89948A',
  borderSubtle: '#222C24',
} as const;

export const COACH_AVATAR_ASSETS: Record<CoachState, string> = {
  PROUD: '/src/assets/images/coach_proud_1794755713428.jpg',
  WATCHING: '/src/assets/images/coach_watching_1794755714542.jpg',
  DISAPPOINTED: '/src/assets/images/coach_disappointed_1794755714269.jpg',
  STRICT: '/src/assets/images/coach_strict_1794755717071.jpg',
};

export const COACH_LIGHTING_TREATMENT: Record<
  CoachState,
  {
    ringColor: string;
    glowShadow: string;
    accentHex: string;
    badgeBg: string;
  }
> = {
  PROUD: {
    ringColor: 'border-[#B5FF38]/60',
    glowShadow: 'shadow-[0_0_32px_rgba(181,255,56,0.22)]',
    accentHex: '#B5FF38',
    badgeBg: 'bg-[#B5FF38]/12 text-[#B5FF38]',
  },
  WATCHING: {
    ringColor: 'border-[#75D927]/45',
    glowShadow: 'shadow-[0_0_24px_rgba(117,217,39,0.16)]',
    accentHex: '#75D927',
    badgeBg: 'bg-[#75D927]/12 text-[#75D927]',
  },
  DISAPPOINTED: {
    ringColor: 'border-[#FF414B]/55',
    glowShadow: 'shadow-[0_0_28px_rgba(255,65,75,0.22)]',
    accentHex: '#FF414B',
    badgeBg: 'bg-[#FF414B]/12 text-[#FF414B]',
  },
  STRICT: {
    ringColor: 'border-[#B5FF38]/75',
    glowShadow: 'shadow-[0_0_36px_rgba(181,255,56,0.28)]',
    accentHex: '#B5FF38',
    badgeBg: 'bg-[#182019] text-[#B5FF38]',
  },
};
