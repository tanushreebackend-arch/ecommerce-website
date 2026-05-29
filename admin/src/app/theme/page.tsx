'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ThemePreview from '@/components/ThemePreview';

const GOOGLE_FONTS = [
  'Inter', 'Playfair Display', 'Montserrat', 'Roboto', 'Open Sans', 'Lato',
  'Poppins', 'Merriweather', 'Raleway', 'Nunito', 'Source Sans Pro', 'Oswald',
];

export default function ThemePage() {
  const [theme, setTheme] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getTheme().then(setTheme).catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await adminApi.updateTheme(theme);
      setTheme(updated);
      toast.success('Theme saved! Changes appear on the live site within 30 seconds.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const FontSelect = ({ label, field }: { label: string; field: string }) => (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <select className="input-field mt-1" value={theme[field] || ''} onChange={(e) => setTheme({ ...theme, [field]: e.target.value })}>
        {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
      </select>
    </div>
  );

  const ColorInput = ({ label, field }: { label: string; field: string }) => (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="flex gap-2 mt-1">
        <input type="color" value={theme[field] || '#000000'} onChange={(e) => setTheme({ ...theme, [field]: e.target.value })} className="w-10 h-10 rounded cursor-pointer" />
        <input className="input-field flex-1" value={theme[field] || ''} onChange={(e) => setTheme({ ...theme, [field]: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Font & Theme Manager</h1>
        <button onClick={handleSave} disabled={saving} className="btn-admin">{saving ? 'Saving...' : 'Save Theme'}</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="card space-y-4">
            <h2 className="font-semibold">Fonts</h2>
            <FontSelect label="Heading Font" field="headingFont" />
            <FontSelect label="Body Font" field="bodyFont" />
            <FontSelect label="Accent Font" field="accentFont" />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold">Core Colors</h2>
            <ColorInput label="Primary Color (buttons, badges, checkmarks)" field="primaryColor" />
            <ColorInput label="Secondary Color (Buy Now, gold accents, savings badges)" field="secondaryColor" />
            <ColorInput label="Page Background" field="bgColor" />
            <ColorInput label="Body Text Color" field="textColor" />
            <ColorInput label="Heading Text Color" field="headingColor" />
            <ColorInput label="Link Color" field="linkColor" />
          </div>

          <div className="card space-y-4">
            <h2 className="font-semibold">Section & Layout Colors</h2>
            <ColorInput label="Alternate Section Background (light grey sections)" field="sectionAltBg" />
            <ColorInput label="Footer Background" field="footerBg" />
            <ColorInput label="Card Border Color" field="cardBorderColor" />
            <ColorInput label="Announcement Bar Background" field="announcementBg" />
            <ColorInput label="Announcement Bar Text" field="announcementText" />
          </div>
        </div>

        <ThemePreview theme={theme} />
      </div>
    </div>
  );
}
