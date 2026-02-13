/**
 * Theme Pack Registry – Define cada tema com tokens de forma, densidade, motion e preview.
 * Aplicar via <html data-theme="...">; estilos em /styles/theme-packs.css
 */

export const THEME_STORAGE_KEY = 'plancontrol_theme';
export const MOTION_STORAGE_KEY = 'plancontrol_motion';

export type ThemeId = 'whiteboard' | 'blueprint' | 'kanban' | 'focus' | 'neon';

export type MotionLevel = 'off' | 'low' | 'high';

export type ThemePack = {
  id: ThemeId;
  name: string;
  description: string;
  /** data-theme value applied to <html> */
  dataTheme: ThemeId;
  motionPreset: 'whiteboard' | 'blueprint' | 'kanban' | 'focus' | 'neon';
  shapePreset: 'soft' | 'technical' | 'kanban' | 'focus' | 'glass';
  densityPreset: 'default' | 'dense' | 'spacious';
  /** For ThemeSwitcher mini preview: [bg, cardBg, cardBorder] */
  previewColors: {
    bg: string;
    card: string;
    cardBorder?: string;
    /** Optional texture/pattern hint for preview */
    texture?: string;
  };
};

export const THEME_IDS: ThemeId[] = ['whiteboard', 'blueprint', 'kanban', 'focus', 'neon'];

export const THEME_REGISTRY: Record<ThemeId, ThemePack> = {
  whiteboard: {
    id: 'whiteboard',
    name: 'Whiteboard Pro',
    description: 'Quadro branco + post-it real, canto dobrado e marca-texto no hover.',
    dataTheme: 'whiteboard',
    motionPreset: 'whiteboard',
    shapePreset: 'soft',
    densityPreset: 'default',
    previewColors: {
      bg: 'hsl(0 0% 98%)',
      card: 'hsl(48 95% 76%)',
      cardBorder: 'hsl(0 0% 90%)',
      texture: 'grain',
    },
  },
  blueprint: {
    id: 'blueprint',
    name: 'Blueprint Grid',
    description: 'Azul escuro, grid técnico, bordas precisas e glow ciano.',
    dataTheme: 'blueprint',
    motionPreset: 'blueprint',
    shapePreset: 'technical',
    densityPreset: 'default',
    previewColors: {
      bg: 'hsl(220 45% 11%)',
      card: 'hsl(220 40% 18%)',
      cardBorder: 'hsl(200 60% 35%)',
    },
  },
  kanban: {
    id: 'kanban',
    name: 'Kanban Calendar',
    description: 'Colunas Idea / Doing / Done, status stripe, layout denso.',
    dataTheme: 'kanban',
    motionPreset: 'kanban',
    shapePreset: 'kanban',
    densityPreset: 'dense',
    previewColors: {
      bg: 'hsl(220 25% 97%)',
      card: 'hsl(0 0% 100%)',
      cardBorder: 'hsl(220 18% 88%)',
    },
  },
  focus: {
    id: 'focus',
    name: 'Focus Mode',
    description: 'Ultra clean, cards grandes, heatmap opcional, mínimo de decoração.',
    dataTheme: 'focus',
    motionPreset: 'focus',
    shapePreset: 'focus',
    densityPreset: 'spacious',
    previewColors: {
      bg: 'hsl(45 25% 97%)',
      card: 'hsl(0 0% 100%)',
      cardBorder: 'hsl(35 15% 90%)',
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Night Ops',
    description: 'Dark glassmorphism, borda neon, pulse em updates em tempo real.',
    dataTheme: 'neon',
    motionPreset: 'neon',
    shapePreset: 'glass',
    densityPreset: 'default',
    previewColors: {
      bg: 'hsl(260 30% 8%)',
      card: 'hsl(260 25% 14%)',
      cardBorder: 'hsl(320 100% 60% / 0.4)',
    },
  },
};

export function getThemePack(id: ThemeId): ThemePack {
  return THEME_REGISTRY[id];
}
