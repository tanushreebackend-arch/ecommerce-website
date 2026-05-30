export interface PremiumFont {
  name: string;
  slug: string;
  fallback: 'serif' | 'sans-serif';
}

export const PREMIUM_FONTS: PremiumFont[] = [
  { name: 'Cormorant Garamond', slug: 'cormorant-garamond', fallback: 'serif' },
  { name: 'Playfair Display', slug: 'playfair-display', fallback: 'serif' },
  { name: 'Lora', slug: 'lora', fallback: 'serif' },
  { name: 'Merriweather', slug: 'merriweather', fallback: 'serif' },
  { name: 'EB Garamond', slug: 'eb-garamond', fallback: 'serif' },
  { name: 'Libre Baskerville', slug: 'libre-baskerville', fallback: 'serif' },
  { name: 'Crimson Text', slug: 'crimson-text', fallback: 'serif' },
  { name: 'DM Serif Display', slug: 'dm-serif-display', fallback: 'serif' },
  { name: 'Montserrat', slug: 'montserrat', fallback: 'sans-serif' },
  { name: 'Raleway', slug: 'raleway', fallback: 'sans-serif' },
  { name: 'Nunito', slug: 'nunito', fallback: 'sans-serif' },
  { name: 'Poppins', slug: 'poppins', fallback: 'sans-serif' },
  { name: 'Inter', slug: 'inter', fallback: 'sans-serif' },
  { name: 'Jost', slug: 'jost', fallback: 'sans-serif' },
  { name: 'DM Sans', slug: 'dm-sans', fallback: 'sans-serif' },
  { name: 'Josefin Sans', slug: 'josefin-sans', fallback: 'sans-serif' },
  { name: 'Outfit', slug: 'outfit', fallback: 'sans-serif' },
  { name: 'Syne', slug: 'syne', fallback: 'sans-serif' },
  { name: 'Tenor Sans', slug: 'tenor-sans', fallback: 'sans-serif' },
  { name: 'Spectral', slug: 'spectral', fallback: 'serif' },
];

export const PREMIUM_FONT_NAMES = PREMIUM_FONTS.map((f) => f.name);
export const PREMIUM_FONT_SLUGS = PREMIUM_FONTS.map((f) => f.slug);

export const GOOGLE_FONTS_IMPORT =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Merriweather:wght@300;400;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=DM+Serif+Display&family=Montserrat:wght@300;400;500;600&family=Raleway:wght@300;400;500;600&family=Nunito:wght@300;400;600&family=Poppins:wght@300;400;500;600&family=Inter:wght@300;400;500&family=Jost:wght@300;400;500&family=DM+Sans:wght@300;400;500&family=Josefin+Sans:wght@300;400;600&family=Outfit:wght@300;400;500&family=Syne:wght@400;600&family=Tenor+Sans&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap";

export function fontFamilyStyle(fontName: string, fallback: 'serif' | 'sans-serif' = 'serif') {
  return { fontFamily: `'${fontName}', ${fallback}` } as const;
}

export function getFontFallback(name: string): 'serif' | 'sans-serif' {
  return PREMIUM_FONTS.find((f) => f.name === name)?.fallback ?? 'serif';
}
