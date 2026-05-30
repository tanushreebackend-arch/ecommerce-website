'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ThemePreview from '@/components/ThemePreview';
import FontSelector from '@/components/FontSelector';

const DEFAULTS = {
  primaryColor: '#000000',
  secondaryColor: '#000000',
  navbarBg: '#000000',
};

export default function ThemePage() {
  const [theme, setTheme] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getTheme().then((data) => {
      setTheme({
        primaryColor: data.buttonColor || data.primaryColor || DEFAULTS.primaryColor,
        secondaryColor: data.accentColor || data.secondaryColor || DEFAULTS.secondaryColor,
        navbarBg: data.navbarColor || data.navbarBg || DEFAULTS.navbarBg,
        headingFont: data.headingFont || 'Inter',
        bodyFont: data.bodyFont || 'Inter',
        accentFont: data.accentFont || data.bodyFont || 'Inter',
        announcementBg: data.announcementBg || data.accentColor || DEFAULTS.secondaryColor,
        announcementText: data.announcementText || '#ffffff',
      });
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        primaryColor: theme.primaryColor || DEFAULTS.primaryColor,
        secondaryColor: theme.secondaryColor || DEFAULTS.secondaryColor,
        navbarBg: theme.navbarBg || DEFAULTS.navbarBg,
        headingFont: theme.headingFont || 'Inter',
        bodyFont: theme.bodyFont || 'Inter',
        accentFont: theme.accentFont || theme.bodyFont || 'Inter',
        announcementBg: theme.secondaryColor || DEFAULTS.secondaryColor,
        announcementText: theme.announcementText || '#ffffff',
        bgColor: '#FFFFFF',
        textColor: '#444444',
        headingColor: '#000000',
        linkColor: '#000000',
        sectionAltBg: '#FFFFFF',
        footerBg: '#000000',
        cardBorderColor: '#E5E5E5',
      };
      const updated = await adminApi.updateTheme(payload);
      setTheme({
        primaryColor: updated.buttonColor || updated.primaryColor || DEFAULTS.primaryColor,
        secondaryColor: updated.accentColor || updated.secondaryColor || DEFAULTS.secondaryColor,
        navbarBg: updated.navbarColor || updated.navbarBg || DEFAULTS.navbarBg,
        headingFont: updated.headingFont || 'Inter',
        bodyFont: updated.bodyFont || 'Inter',
        accentFont: updated.accentFont || updated.bodyFont || 'Inter',
        announcementBg: updated.announcementBg || updated.accentColor || DEFAULTS.secondaryColor,
        announcementText: updated.announcementText || '#ffffff',
      });
      toast.success('Theme saved! Changes appear on the live site within 30 seconds.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const ColorInput = ({ label, field, hint }: { label: string; field: string; hint?: string }) => (
    <div>
      <label className="text-sm font-medium text-gray-800">{label}</label>
      {hint && <p className="text-xs text-gray-500 mt-0.5 mb-1">{hint}</p>}
      <div className="flex gap-2 mt-1">
        <input
          type="color"
          value={theme[field] || DEFAULTS[field as keyof typeof DEFAULTS] || '#000000'}
          onChange={(e) => setTheme({ ...theme, [field]: e.target.value })}
          className="w-10 h-10 rounded cursor-pointer border border-gray-200"
        />
        <input
          className="input-field flex-1"
          value={theme[field] || ''}
          onChange={(e) => setTheme({ ...theme, [field]: e.target.value })}
          placeholder={DEFAULTS[field as keyof typeof DEFAULTS]}
        />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Font & Theme Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Button, accent, and navbar colors control the live storefront.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-admin">{saving ? 'Saving...' : 'Save Theme'}</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold">Brand Colors</h2>
            <ColorInput
              label="Accent Color"
              field="secondaryColor"
              hint="Stars, decorative lines, nav underlines, announcement bar"
            />
            <ColorInput
              label="Navbar Background Color"
              field="navbarBg"
              hint="Top navigation bar background"
            />
            <ColorInput
              label="Button Color"
              field="primaryColor"
              hint="Primary buttons (Add to Cart) — text stays white"
            />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold">Fonts</h2>
            <FontSelector label="Heading Font" value={theme.headingFont || 'Inter'} onChange={(headingFont) => setTheme({ ...theme, headingFont })} />
            <FontSelector label="Body Font" value={theme.bodyFont || 'Inter'} onChange={(bodyFont) => setTheme({ ...theme, bodyFont })} />
            <FontSelector label="Accent Font" value={theme.accentFont || 'Inter'} onChange={(accentFont) => setTheme({ ...theme, accentFont })} />
          </div>

          <div className="card bg-gray-50 border-dashed">
            <h2 className="font-semibold text-sm mb-2">Fixed palette (not editable)</h2>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>Background: #FFFFFF</li>
              <li>Headings: #000000</li>
              <li>Body text: #444444</li>
              <li>Borders: #E5E5E5</li>
              <li>Footer: #000000</li>
            </ul>
          </div>
        </div>

        <ThemePreview theme={theme} />
      </div>
    </div>
  );
}
