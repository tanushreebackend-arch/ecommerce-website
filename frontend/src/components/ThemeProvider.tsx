'use client';

import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { applyThemeToRoot, normalizeTheme, type ThemeVars } from '@/lib/theme';

interface ThemeProviderProps {
  initialTheme?: ThemeVars | null;
}

export default function ThemeProvider({ initialTheme }: ThemeProviderProps) {
  const { settings } = useSettings();

  useEffect(() => {
    const theme = settings?.theme
      ? normalizeTheme(settings.theme as ThemeVars)
      : normalizeTheme(initialTheme);
    applyThemeToRoot(document.documentElement, theme);
  }, [settings, initialTheme]);

  return null;
}
