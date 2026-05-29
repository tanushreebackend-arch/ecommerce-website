'use client';

interface ThemePreviewProps {
  theme: Record<string, string>;
}

export default function ThemePreview({ theme }: ThemePreviewProps) {
  const primary = theme.primaryColor || '#2d6a4f';
  const secondary = theme.secondaryColor || '#40916c';
  const bg = theme.bgColor || '#ffffff';
  const text = theme.textColor || '#1a1a1a';
  const headingFont = theme.headingFont || 'Inter';
  const bodyFont = theme.bodyFont || 'Poppins';

  return (
    <div className="card sticky top-6">
      <h2 className="font-semibold mb-4">Live Preview</h2>
      <div className="rounded-xl overflow-hidden border shadow-sm" style={{ backgroundColor: bg, color: text }}>
        {/* Header mockup */}
        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ backgroundColor: bg }}>
          <span style={{ fontFamily: headingFont }} className="font-bold text-sm">Your Brand</span>
          <div className="flex gap-3 text-xs" style={{ fontFamily: bodyFont }}>
            <span>Shop</span>
            <span>About</span>
            <span style={{ color: primary }} className="font-semibold">Cart</span>
          </div>
        </div>

        {/* Announcement bar */}
        <div
          className="text-center text-xs py-1.5 font-medium"
          style={{ backgroundColor: theme.announcementBg || primary, color: theme.announcementText || '#fff', fontFamily: bodyFont }}
        >
          Free shipping on orders over ₹499
        </div>

        {/* Product card mockup */}
        <div className="p-4">
          <div className="flex gap-3">
            <div className="w-16 h-16 rounded-lg shrink-0" style={{ backgroundColor: secondary, opacity: 0.3 }} />
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: headingFont }} className="font-bold text-sm truncate">Premium Supplement</p>
              <p style={{ fontFamily: bodyFont }} className="text-xs opacity-70 mt-0.5">Daily wellness formula</p>
              <p style={{ fontFamily: headingFont, color: primary }} className="font-bold text-sm mt-1">₹999</p>
            </div>
          </div>

          <button
            type="button"
            className="w-full mt-4 py-2.5 rounded-lg text-white text-xs font-semibold uppercase tracking-wide"
            style={{ backgroundColor: primary, fontFamily: bodyFont }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">Updates in real-time as you change fonts and colors.</p>
    </div>
  );
}
