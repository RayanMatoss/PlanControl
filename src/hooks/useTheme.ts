import { useCallback, useEffect, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  MOTION_STORAGE_KEY,
  THEME_IDS,
  THEME_REGISTRY,
  getThemePack,
  type ThemeId,
  type MotionLevel,
} from '@/lib/theme/registry';

function getStoredTheme(): ThemeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && THEME_IDS.includes(stored as ThemeId)) return stored as ThemeId;
  } catch {
    // ignore
  }
  return null;
}

function getStoredMotion(): MotionLevel {
  if (typeof window === 'undefined') return 'high';
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'off';
    const s = localStorage.getItem(MOTION_STORAGE_KEY);
    if (s === 'off' || s === 'low' || s === 'high') return s;
  } catch {
    // ignore
  }
  return 'high';
}

function applyThemeToDocument(themeId: ThemeId | null) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;
  THEME_IDS.forEach((id) => html.classList.remove('theme-' + id));
  if (themeId) {
    html.classList.add('theme-' + themeId);
    html.setAttribute('data-theme', themeId);
  } else {
    html.removeAttribute('data-theme');
  }
}

function applyMotionToDocument(level: MotionLevel) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-motion', level);
}

export function useTheme() {
  const [themeId, setThemeIdState] = useState<ThemeId | null>(() => getStoredTheme());
  const [motionLevel, setMotionLevelState] = useState<MotionLevel>(() => getStoredMotion());

  const setTheme = useCallback((themeId: ThemeId | null) => {
    applyThemeToDocument(themeId);
    setThemeIdState(themeId);
    try {
      if (themeId) localStorage.setItem(THEME_STORAGE_KEY, themeId);
      else localStorage.removeItem(THEME_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setMotionLevel = useCallback((level: MotionLevel) => {
    applyMotionToDocument(level);
    setMotionLevelState(level);
    try {
      localStorage.setItem(MOTION_STORAGE_KEY, level);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    setThemeIdState(getStoredTheme());
    setMotionLevelState(getStoredMotion());
    applyThemeToDocument(getStoredTheme());
    applyMotionToDocument(getStoredMotion());
  }, []);

  const themePack = themeId ? getThemePack(themeId) : null;

  return {
    themeId,
    theme: themeId,
    setTheme: setTheme,
    motionLevel,
    setMotionLevel,
    themeIds: THEME_IDS,
    themePack,
    registry: THEME_REGISTRY,
  };
}

export { THEME_STORAGE_KEY, MOTION_STORAGE_KEY, THEME_IDS, THEME_REGISTRY, getThemePack };
export type { ThemeId, MotionLevel };
