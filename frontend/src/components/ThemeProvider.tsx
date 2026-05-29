'use client';

import { useEffect } from 'react';
import { useSettings } from '@/context/SettingsContext';
import {
  LUXURY_GREEN,
  LUXURY_GOLD,
  LUXURY_CREAM,
  LUXURY_CREAM_ALT,
  LUXURY_TEXT,
  LUXURY_BORDER,
  resolveThemeColor,
} from '@/lib/themeColors';

export default function ThemeProvider() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    const theme = (settings?.theme || {}) as Record<string, string>;

    const primary = resolveThemeColor(theme.primaryColor, LUXURY_GREEN);
    const secondary = resolveThemeColor(theme.secondaryColor, LUXURY_GOLD);
    const link = resolveThemeColor(theme.linkColor, LUXURY_GOLD);
    const announcement = resolveThemeColor(theme.announcementBg, LUXURY_GREEN);

    root.style.setProperty('--color-primary', primary);
    root.style.setProperty('--color-primary-foreground', LUXURY_CREAM);
    root.style.setProperty('--color-secondary', secondary);
    root.style.setProperty('--color-accent', secondary);
    root.style.setProperty('--color-bg', theme.bgColor === '#ffffff' ? LUXURY_CREAM : theme.bgColor || LUXURY_CREAM);
    root.style.setProperty('--color-text', theme.textColor || LUXURY_TEXT);
    root.style.setProperty('--color-heading', theme.headingColor || primary);
    root.style.setProperty('--color-link', link);
    root.style.setProperty('--color-section-alt', theme.sectionAltBg || LUXURY_CREAM_ALT);
    root.style.setProperty('--color-footer-bg', theme.footerBg ? resolveThemeColor(theme.footerBg, LUXURY_GREEN) : LUXURY_GREEN);
    root.style.setProperty('--color-card-border', theme.cardBorderColor ? resolveThemeColor(theme.cardBorderColor, LUXURY_BORDER) : LUXURY_BORDER);
    root.style.setProperty('--color-announcement-bg', announcement);
    root.style.setProperty('--color-announcement-text', LUXURY_CREAM);

    root.style.setProperty('--font-heading', `'Cormorant Garamond', Georgia, serif`);
    root.style.setProperty('--font-body', `'Jost', system-ui, sans-serif`);
  }, [settings]);

  return null;
}
