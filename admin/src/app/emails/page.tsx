'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type EmailSettings = {
  welcomeEnabled: boolean;
  orderConfirmationEnabled: boolean;
  abandonedCartEnabled: boolean;
  abandonedCartDelayHours: number;
  abandonedCartUrgencyText: string;
  welcomeCtaText: string;
  orderCtaText: string;
  abandonedCartCtaText: string;
  bannerColor: string;
};

const DELAY_OPTIONS = [
  { value: 1, label: '1 hour' },
  { value: 1.5, label: '1.5 hours' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
];

export default function EmailsPage() {
  const [settings, setSettings] = useState<EmailSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewType, setPreviewType] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getEmailSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateEmailSettings(settings);
      setSettings(updated);
      toast.success('Email settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({
    label,
    field,
    description,
  }: {
    label: string;
    field: keyof EmailSettings;
    description?: string;
  }) => (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        className="mt-1"
        checked={Boolean(settings?.[field])}
        onChange={(e) => setSettings((s) => (s ? { ...s, [field]: e.target.checked } : s))}
      />
      <span>
        <span className="font-medium block">{label}</span>
        {description && <span className="text-sm text-gray-500">{description}</span>}
      </span>
    </label>
  );

  if (!settings) {
    return <div className="p-8 text-gray-500">Loading email settings...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Email Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure automated welcome, order, and abandoned cart emails</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-admin">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card space-y-6">
          <h2 className="font-semibold">Email Toggles</h2>
          <Toggle field="welcomeEnabled" label="Welcome email" description="Sent when a user signs up" />
          <Toggle field="orderConfirmationEnabled" label="Order confirmation" description="Sent when an order is placed" />
          <Toggle
            field="abandonedCartEnabled"
            label="Abandoned cart email"
            description="Sent when a logged-in user leaves items in cart"
          />

          <div>
            <label className="text-sm text-gray-500">Abandoned cart delay</label>
            <select
              className="input-field mt-1"
              value={settings.abandonedCartDelayHours}
              onChange={(e) =>
                setSettings({ ...settings, abandonedCartDelayHours: parseFloat(e.target.value) })
              }
            >
              {DELAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Banner color (green accent)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="color"
                value={settings.bannerColor || '#22c55e'}
                onChange={(e) => setSettings({ ...settings, bannerColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                className="input-field flex-1"
                value={settings.bannerColor || ''}
                placeholder="Leave empty to use theme secondary color"
                onChange={(e) => setSettings({ ...settings, bannerColor: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Email Copy & CTAs</h2>
          <div>
            <label className="text-sm text-gray-500">Welcome CTA button</label>
            <input
              className="input-field mt-1"
              value={settings.welcomeCtaText}
              onChange={(e) => setSettings({ ...settings, welcomeCtaText: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Order confirmation CTA button</label>
            <input
              className="input-field mt-1"
              value={settings.orderCtaText}
              onChange={(e) => setSettings({ ...settings, orderCtaText: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Abandoned cart CTA button</label>
            <input
              className="input-field mt-1"
              value={settings.abandonedCartCtaText}
              onChange={(e) => setSettings({ ...settings, abandonedCartCtaText: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Abandoned cart urgency text (use X for stock count)</label>
            <textarea
              className="input-field mt-1 min-h-[80px]"
              value={settings.abandonedCartUrgencyText}
              onChange={(e) => setSettings({ ...settings, abandonedCartUrgencyText: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="card mt-6 space-y-4">
        <h2 className="font-semibold">Preview Templates</h2>
        <div className="flex flex-wrap gap-3">
          {(['welcome', 'order', 'abandoned'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                previewType === type ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setPreviewType(type)}
            >
              Preview {type === 'welcome' ? 'Welcome' : type === 'order' ? 'Order' : 'Abandoned Cart'}
            </button>
          ))}
        </div>
        {previewType && (
          <div className="border rounded-lg overflow-hidden bg-gray-100">
            <iframe
              title={`${previewType} email preview`}
              src={`${API_URL}/api/admin/emails/preview/${previewType}`}
              className="w-full min-h-[640px] bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
