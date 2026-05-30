'use client';

import { useEffect, useRef, useState } from 'react';
import { PREMIUM_FONTS, getFontFallback } from '@/lib/premiumFonts';

interface FontSelectorProps {
  label?: string;
  value: string;
  onChange: (font: string) => void;
  className?: string;
}

export default function FontSelector({ label, value, onChange, className = '' }: FontSelectorProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = PREMIUM_FONTS.find((f) => f.name === value) || PREMIUM_FONTS[0];
  const fallback = getFontFallback(selected.name);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={className} ref={rootRef}>
      {label && <label className="text-sm text-gray-500 block mb-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="input-field mt-0 w-full text-left flex items-center justify-between gap-2"
          style={{ fontFamily: `'${selected.name}', ${fallback}` }}
        >
          <span>{selected.name}</span>
          <span className="text-gray-400 text-xs">{open ? '▲' : '▼'}</span>
        </button>
        {open && (
          <ul className="absolute z-50 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
            {PREMIUM_FONTS.map((font) => (
              <li key={font.slug}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    font.name === value ? 'bg-green-50 text-green-900' : 'text-gray-800'
                  }`}
                  style={{ fontFamily: `'${font.name}', ${font.fallback}` }}
                  onClick={() => {
                    onChange(font.name);
                    setOpen(false);
                  }}
                >
                  {font.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
