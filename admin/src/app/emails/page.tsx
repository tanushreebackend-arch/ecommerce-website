'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

type EmailSettings = {
  storeName: string;
  welcomeEnabled: boolean;
  orderConfirmationEnabled: boolean;
  abandonedCartEnabled: boolean;
  abandonedCartDelayHours: number;
  abandonedCartUrgencyText: string;
  welcomeSubject: string;
  welcomeBodyText: string;
  orderConfirmationSubject: string;
  abandonedCartSubject: string;
  abandonedCartBodyText: string;
  welcomeCtaText: string;
  orderCtaText: string;
  abandonedCartCtaText: string;
};

const PREVIEW_TYPES = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'order', label: 'Order Confirmation' },
  { id: 'abandoned', label: 'Abandoned Cart' },
  { id: 'digital', label: 'Digital Product' },
] as const;

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
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');

  useEffect(() => {
    adminApi.getEmailSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    if (!previewType) {
      setPreviewHtml('');
      setPreviewError('');
      return;
    }

    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError('');

    adminApi
      .getEmailPreview(previewType)
      .then((html) => {
        if (!cancelled) setPreviewHtml(html);
      })
      .catch((err) => {
        if (!cancelled) {
          setPreviewHtml('');
          setPreviewError(err instanceof Error ? err.message : 'Preview failed');
        }
      })
      .finally(() => {
        if (!cancelled) setPreviewLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [previewType]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await adminApi.updateEmailSettings(settings);
      setSettings(updated);
      toast.success('Settings saved successfully!');
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
          <p className="text-sm text-gray-500 mt-1">Minimal black &amp; white templates for automated customer emails</p>
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
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Email Copy & CTAs</h2>

          <div>
            <label className="text-sm text-gray-500">Store Name</label>
            <input
              className="input-field mt-1"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              placeholder="NOW Foods"
            />
            <p className="text-xs text-gray-400 mt-1">Used in email headers and copy. Use {'{storeName}'} in subject/body fields.</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Welcome email</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Subject line</label>
                <input
                  className="input-field mt-1"
                  value={settings.welcomeSubject}
                  onChange={(e) => setSettings({ ...settings, welcomeSubject: e.target.value })}
                  placeholder="Welcome to {storeName}"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Body text</label>
                <textarea
                  className="input-field mt-1 min-h-[100px]"
                  value={settings.welcomeBodyText}
                  onChange={(e) => setSettings({ ...settings, welcomeBodyText: e.target.value })}
                  placeholder="Thank you for joining {storeName}..."
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Order confirmation</p>
            <div>
              <label className="text-sm text-gray-500">Subject line</label>
              <input
                className="input-field mt-1"
                value={settings.orderConfirmationSubject}
                onChange={(e) => setSettings({ ...settings, orderConfirmationSubject: e.target.value })}
                placeholder="Order Confirmed"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Abandoned cart</p>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-500">Subject line</label>
                <input
                  className="input-field mt-1"
                  value={settings.abandonedCartSubject}
                  onChange={(e) => setSettings({ ...settings, abandonedCartSubject: e.target.value })}
                  placeholder="You left something behind"
                />
              </div>
              <div>
                <label className="text-sm text-gray-500">Body text</label>
                <textarea
                  className="input-field mt-1 min-h-[100px]"
                  value={settings.abandonedCartBodyText}
                  onChange={(e) => setSettings({ ...settings, abandonedCartBodyText: e.target.value })}
                  placeholder="You left a few items in your cart..."
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
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
      </div>

      <div className="card mt-6 space-y-4">
        <div>
          <h2 className="font-semibold">Preview Templates</h2>
          <p className="text-sm text-gray-500 mt-1">Clean white layout, black text, single CTA — letter-style emails</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {PREVIEW_TYPES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                previewType === id ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setPreviewType(id)}
            >
              Preview {label}
            </button>
          ))}
        </div>
        {previewType && (
          <div className="border border-[#e5e5e5] rounded-sm overflow-hidden bg-white">
            {previewLoading && (
              <div className="flex items-center justify-center min-h-[720px] text-sm text-gray-500">
                Loading preview…
              </div>
            )}
            {!previewLoading && previewError && (
              <div className="flex items-center justify-center min-h-[240px] px-6 text-sm text-red-600 text-center">
                {previewError}
              </div>
            )}
            {!previewLoading && !previewError && previewHtml && (
              <iframe
                title={`${previewType} email preview`}
                srcDoc={previewHtml}
                className="w-full min-h-[720px] bg-white border-0"
                sandbox="allow-same-origin"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
