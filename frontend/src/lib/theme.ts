import { getFontFallback } from '@/lib/premiumFonts';

export const THEME_DEFAULTS = {
  buttonColor: '#000000',
  accentColor: '#000000',
  navbarColor: '#000000',
  announcementBg: '#000000',
  announcementText: '#ffffff',
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#555555',
  heading: '#0A0A0A',
  border: '#E8E8E8',
  footer: '#0A0A0A',
  white: '#FFFFFF',
  black: '#0A0A0A',
  muted: '#999999',
} as const;

export type ThemeVars = {
  buttonColor?: string;
  accentColor?: string;
  navbarColor?: string;
  announcementBg?: string;
  announcementText?: string;
  headingFont?: string;
  bodyFont?: string;
  accentFont?: string;
  primaryColor?: string;
  secondaryColor?: string;
  navbarBg?: string;
};

export function contrastText(bg: string) {
  const hex = bg.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000000' : '#ffffff';
}

export function normalizeTheme(theme: ThemeVars | null | undefined) {
  const buttonColor =
    theme?.buttonColor || theme?.primaryColor || THEME_DEFAULTS.buttonColor;
  const accentColor =
    theme?.accentColor || theme?.secondaryColor || THEME_DEFAULTS.accentColor;
  const navbarColor =
    theme?.navbarColor || theme?.navbarBg || THEME_DEFAULTS.navbarColor;
  const announcementBg = theme?.announcementBg || accentColor;
  const announcementText =
    theme?.announcementText || contrastText(announcementBg);

  return {
    buttonColor,
    accentColor,
    navbarColor,
    announcementBg,
    announcementText,
    headingFont: theme?.headingFont || 'Inter',
    bodyFont: theme?.bodyFont || 'Inter',
    accentFont: theme?.accentFont || theme?.bodyFont || 'Inter',
    primaryColor: buttonColor,
    secondaryColor: accentColor,
    navbarBg: navbarColor,
  };
}

export function themeToCssProperties(theme: ThemeVars | null | undefined): Record<string, string> {
  const t = normalizeTheme(theme);
  return {
    '--button-color': t.buttonColor,
    '--navbar-color': t.navbarColor,
    '--accent-color': t.accentColor,
    '--color-primary': t.buttonColor,
    '--color-accent': t.accentColor,
    '--color-secondary': t.accentColor,
    '--color-navbar-bg': t.navbarColor,
    '--color-announcement-bg': t.announcementBg,
    '--color-announcement-text': t.announcementText,
  } as Record<string, string>;
}

export function applyThemeToRoot(root: HTMLElement, theme: ThemeVars | null | undefined) {
  const t = normalizeTheme(theme);

  root.style.setProperty('--button-color', t.buttonColor);
  root.style.setProperty('--navbar-color', t.navbarColor);
  root.style.setProperty('--accent-color', t.accentColor);
  root.style.setProperty('--color-primary', t.buttonColor);
  root.style.setProperty('--color-accent', t.accentColor);
  root.style.setProperty('--color-secondary', t.accentColor);
  root.style.setProperty('--color-navbar-bg', t.navbarColor);
  root.style.setProperty('--color-announcement-bg', t.announcementBg);
  root.style.setProperty('--color-announcement-text', t.announcementText);

  root.style.setProperty('--font-heading', `'${t.headingFont}', ${getFontFallback(t.headingFont)}`);
  root.style.setProperty('--font-body', `'${t.bodyFont}', ${getFontFallback(t.bodyFont)}`);
  root.style.setProperty('--font-accent', `'${t.accentFont}', ${getFontFallback(t.accentFont)}`);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchTheme(): Promise<ReturnType<typeof normalizeTheme>> {
  try {
    const res = await fetch(`${API_URL}/api/theme`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Theme fetch failed');
    const data = (await res.json()) as ThemeVars;
    return normalizeTheme(data);
  } catch {
    return normalizeTheme(null);
  }
}
