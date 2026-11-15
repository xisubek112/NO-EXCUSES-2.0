import { useEffect, useState } from 'react';

interface DisciplineRingProps {
  score: number;
  completionPct: number;
  scoreLabel: string;
  size?: number;
}

export function DisciplineRing({
  score,
  completionPct,
  scoreLabel,
  size = 188,
}: DisciplineRingProps) {
  const [animatedScore, setAnimatedScore] = useState(score);

  useEffect(() => {
    let rafId = 0;
    const startVal = animatedScore;
    const diff = score - startVal;
    if (diff === 0) return;

    const duration = 450;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(startVal + diff * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [score]);

  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, completionPct));
  const strokeDashoffset = circumference - (clampedPct / 100) * circumference;

  const isComplete = clampedPct === 100;
  const ringColor = isComplete ? '#B5FF38' : '#75D927';

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-label={`${scoreLabel}: ${score}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        role="img"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="warriorRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B5FF38" />
            <stop offset="100%" stopColor="#75D927" />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#182019"
          strokeWidth={strokeWidth}
        />
        {/* Active progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={clampedPct > 0 ? 'url(#warriorRingGrad)' : '#242E26'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 550ms cubic-bezier(0.16, 1, 0.3, 1)',
            filter: isComplete ? 'drop-shadow(0 0 10px rgba(181,255,56,0.45))' : 'none',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-semibold tracking-wider text-[#89948A] uppercase">
          {scoreLabel}
        </span>
        <span
          className="font-mono-tabular mt-1 text-5xl font-extrabold tracking-tight text-[#F4F7F2]"
          style={{ color: isComplete ? ringColor : '#F4F7F2' }}
        >
          {animatedScore}
        </span>
        <span className="font-mono-tabular mt-0.5 text-xs font-medium text-[#89948A]">
          / 100
        </span>
      </div>
    </div>
  );
}
