'use client';

import { getFontFallback } from '@/lib/premiumFonts';

interface ThemePreviewProps {
  theme: Record<string, string>;
}

export default function ThemePreview({ theme }: ThemePreviewProps) {
  const accent = theme.secondaryColor || '#000000';
  const button = theme.primaryColor || '#000000';
  const navbar = theme.navbarBg || '#000000';
  const headingFont = theme.headingFont || 'Inter';
  const bodyFont = theme.bodyFont || 'Inter';
  const headingFallback = getFontFallback(headingFont);
  const bodyFallback = getFontFallback(bodyFont);

  return (
    <div className="card sticky top-6">
      <h2 className="font-semibold mb-4">Live Preview</h2>
      <div className="rounded-lg overflow-hidden border shadow-sm bg-white">
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{ backgroundColor: accent, color: accent.toLowerCase() === '#ffffff' || accent.toLowerCase() === '#fff' ? '#000' : '#fff', fontFamily: `'${bodyFont}', ${bodyFallback}`, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' }}
        >
          Free shipping on orders over ₹499
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ backgroundColor: navbar }}>
          <span style={{ fontFamily: `'${headingFont}', ${headingFallback}`, color: '#fff' }} className="text-xs tracking-widest uppercase">
            Your Brand
          </span>
          <div className="flex gap-4 text-[10px] uppercase tracking-wider" style={{ fontFamily: `'${bodyFont}', ${bodyFallback}`, color: '#fff' }}>
            <span style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 2 }}>Shop</span>
            <span>Contact</span>
          </div>
        </div>

        <div className="p-4">
          <p style={{ fontFamily: `'${headingFont}', ${headingFallback}`, color: '#000' }} className="text-sm font-normal mb-1">
            Premium Supplement
          </p>
          <p style={{ fontFamily: `'${bodyFont}', ${bodyFallback}`, color: '#444' }} className="text-xs mb-2">
            Daily wellness formula
          </p>
          <div className="w-8 h-0.5 mb-3" style={{ backgroundColor: accent }} />
          <p style={{ fontFamily: `'${headingFont}', ${headingFallback}`, color: '#000' }} className="text-lg mb-4">
            ₹999
          </p>

          <button
            type="button"
            className="w-full py-2.5 text-white text-[10px] font-medium uppercase tracking-widest mb-2"
            style={{ backgroundColor: button, fontFamily: `'${bodyFont}', ${bodyFallback}` }}
          >
            Add to Cart
          </button>
          <button
            type="button"
            className="w-full py-2.5 text-[10px] font-medium uppercase tracking-widest border border-black"
            style={{ fontFamily: `'${bodyFont}', ${bodyFallback}`, color: '#000', backgroundColor: '#fff' }}
          >
            Buy Now
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">Updates in real-time as you change colors and fonts.</p>
    </div>
  );
}
