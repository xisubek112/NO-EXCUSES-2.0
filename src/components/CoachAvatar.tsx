import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import type { CoachState } from '../types';
import {
  COACH_AVATAR_ASSETS,
  COACH_LIGHTING_TREATMENT,
} from '../constants/designTokens';

interface CoachAvatarProps {
  state: CoachState;
  size?: 'sm' | 'md' | 'lg';
  alt: string;
  className?: string;
}

const SIZE_CLASSES: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'w-16 h-16 rounded-[18px]',
  md: 'w-24 h-24 rounded-[22px]',
  lg: 'w-44 h-44 sm:w-52 sm:h-52 rounded-[24px]',
};

export function CoachAvatar({
  state,
  size = 'md',
  alt,
  className = '',
}: CoachAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const lighting = COACH_LIGHTING_TREATMENT[state];
  const src = COACH_AVATAR_ASSETS[state];

  return (
    <motion.div
      key={state}
      initial={{ opacity: 0.85, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`relative shrink-0 overflow-hidden border bg-[#080B09] ${lighting.ringColor} ${lighting.glowShadow} ${SIZE_CLASSES[size]} ${className}`}
    >
      {/* Subtle idle breathing highlight overlay (compositor-only opacity) */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.18, 0.42, 0.18] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle at 50% 28%, ${lighting.accentHex}24 0%, transparent 65%)`,
        }}
      />

      {!imgError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#182019] to-[#080B09] text-[#B5FF38]">
          <Shield className="h-8 w-8" />
        </div>
      )}

      {/* Subtle bottom vignette for sleek framing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#080B09]/80 to-transparent"
      />
    </motion.div>
  );
}
