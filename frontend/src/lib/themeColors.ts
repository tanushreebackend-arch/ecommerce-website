export const LUXURY_GREEN = '#1a3a2a';
export const LUXURY_GOLD = '#c9a84c';
export const LUXURY_CREAM = '#faf8f4';
export const LUXURY_CREAM_ALT = '#f3ede3';
export const LUXURY_TEXT = '#1a1a1a';
export const LUXURY_BORDER = '#e8e0d4';

/** Old theme colors stored in DB — map to luxury palette. */
export const LEGACY_THEME_COLORS = [
  '#FACC15',
  '#facc15',
  '#F7941D',
  '#f7941d',
  '#CA8A04',
  '#ca8a04',
  '#7B3FA8',
  '#7b3fa8',
  '#6B2D9A',
  '#6b2d9a',
  '#2563EB',
  '#2563eb',
  '#1D4ED8',
  '#1d4ed8',
  '#1a472a',
  '#1A472A',
  '#2d6a4f',
  '#2D6A4F',
  '#c9a227',
  '#FFFBEB',
  '#fef9c3',
];

export function resolveThemeColor(value: string | undefined, fallback = LUXURY_GREEN) {
  if (!value) return fallback;
  return LEGACY_THEME_COLORS.includes(value) ? fallback : value;
}

export function resolveAnnouncementStyle(bg?: string, text?: string) {
  const backgroundColor = resolveThemeColor(bg, LUXURY_GREEN);
  const isLegacyBright =
    backgroundColor.toLowerCase() === '#facc15' ||
    backgroundColor.toLowerCase() === '#fde047' ||
    backgroundColor.toLowerCase() === '#f7941d';

  const textColor = isLegacyBright
    ? LUXURY_CREAM
    : text === '#1a1a1a' || !text
      ? LUXURY_CREAM
      : text;

  return { backgroundColor: isLegacyBright ? LUXURY_GREEN : backgroundColor, textColor };
}
