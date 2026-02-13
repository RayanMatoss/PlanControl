/**
 * Motion presets por tema e por nível (off | low | high).
 * Usado por componentes que usam framer-motion para manter consistência com o tema.
 */

import type { ThemeId } from './registry';
import type { MotionLevel } from './registry';

export type MotionVariants = {
  pageFade: { initial: object; animate: object; exit?: object };
  cardHover: object;
  cardPress: object;
  drawerIn: { initial: object; animate: object; exit?: object };
  dragSnap?: object;
  realtimePulse?: object;
};

const springSoft = { type: 'spring' as const, stiffness: 400, damping: 28 };
const springBounce = { type: 'spring' as const, stiffness: 500, damping: 22 };
const springSnappy = { type: 'spring' as const, stiffness: 500, damping: 35 };
const springSmooth = { type: 'spring' as const, stiffness: 300, damping: 30 };
const tFast = { duration: 0.15 };
const tNormal = { duration: 0.25 };
const tSlow = { duration: 0.35 };

function reducedVariants(): MotionVariants {
  return {
    pageFade: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    },
    cardHover: {},
    cardPress: {},
    drawerIn: {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
    },
  };
}

function lowVariants(preset: keyof typeof PRESETS): MotionVariants {
  const base = PRESETS[preset];
  return {
    pageFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: tNormal },
      exit: { opacity: 0, transition: tFast },
    },
    cardHover: base.cardHoverLow ?? {},
    cardPress: base.cardPressLow ?? {},
    drawerIn: {
      initial: { opacity: 0, x: 8 },
      animate: { opacity: 1, x: 0, transition: tNormal },
      exit: { opacity: 0, transition: tFast },
    },
  };
}

const PRESETS = {
  whiteboard: {
    cardHover: { y: -4, transition: springBounce },
    cardHoverLow: { y: -2, transition: tFast },
    cardPress: { scale: 0.98, transition: tFast },
    cardPressLow: { scale: 0.99 },
    drawerIn: { initial: { opacity: 0, x: 12 }, animate: { opacity: 1, x: 0, transition: springSoft }, exit: { opacity: 0, x: -8, transition: tNormal } },
    dragSnap: { transition: springBounce },
    realtimePulse: { scale: [1, 1.02, 1], transition: { duration: 0.4, ease: 'easeOut' } },
  },
  blueprint: {
    cardHover: { y: -2, transition: springSnappy },
    cardHoverLow: { y: -1, transition: tFast },
    cardPress: { scale: 0.99, transition: tFast },
    cardPressLow: {},
    drawerIn: { initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0, transition: springSnappy }, exit: { opacity: 0, transition: tFast } },
    dragSnap: { transition: springSnappy },
  },
  kanban: {
    cardHover: { y: -2, transition: springSnappy },
    cardHoverLow: { y: -1, transition: tFast },
    cardPress: { scale: 0.98, transition: tFast },
    cardPressLow: { scale: 0.99 },
    drawerIn: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0, transition: springSnappy }, exit: { opacity: 0, transition: tFast } },
    dragSnap: { transition: springSnappy },
    realtimePulse: { opacity: [1, 0.7, 1], transition: { duration: 0.3 } },
  },
  focus: {
    cardHover: { opacity: 0.95, transition: tFast },
    cardHoverLow: {},
    cardPress: {},
    cardPressLow: {},
    drawerIn: { initial: { opacity: 0 }, animate: { opacity: 1, transition: tSlow }, exit: { opacity: 0, transition: tFast } },
  },
  neon: {
    cardHover: { y: -2, transition: springSmooth },
    cardHoverLow: { y: -1, transition: tNormal },
    cardPress: { scale: 0.99, transition: tFast },
    cardPressLow: {},
    drawerIn: { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1, transition: springSmooth }, exit: { opacity: 0, transition: tNormal } },
    dragSnap: { transition: springSmooth },
    realtimePulse: { boxShadow: 'glow', transition: { duration: 0.5 } },
  },
};

export function getMotionVariants(
  themeId: ThemeId,
  motionLevel: MotionLevel,
  prefersReducedMotion: boolean
): MotionVariants {
  if (prefersReducedMotion || motionLevel === 'off') {
    return reducedVariants();
  }
  if (motionLevel === 'low') {
    return lowVariants(THEME_TO_PRESET[themeId]);
  }
  const key = THEME_TO_PRESET[themeId];
  const preset = PRESETS[key];
  const drawerIn = preset.drawerIn ?? {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: tNormal },
    exit: { opacity: 0, transition: tFast },
  };
  return {
    pageFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: tNormal },
      exit: { opacity: 0, transition: tFast },
    },
    cardHover: preset.cardHover ?? {},
    cardPress: preset.cardPress ?? preset.cardPressLow ?? {},
    drawerIn,
    dragSnap: preset.dragSnap,
    realtimePulse: preset.realtimePulse,
  };
}

const THEME_TO_PRESET: Record<ThemeId, keyof typeof PRESETS> = {
  whiteboard: 'whiteboard',
  blueprint: 'blueprint',
  kanban: 'kanban',
  focus: 'focus',
  neon: 'neon',
};
