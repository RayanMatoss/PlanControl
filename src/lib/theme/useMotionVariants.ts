import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { getMotionVariants } from './motion-presets';
import type { MotionVariants } from './motion-presets';

function getPrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useMotionVariants(): MotionVariants {
  const { themeId, motionLevel } = useTheme();
  const [prefersReduced, setPrefersReduced] = useState(getPrefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const fn = () => setPrefersReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  return getMotionVariants(
    themeId ?? 'whiteboard',
    motionLevel,
    prefersReduced
  );
}
