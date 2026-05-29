'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const POLICIES = [
  { type: 'refund', label: 'Refund Policy' },
  { type: 'privacy', label: 'Privacy Policy' },
  { type: 'terms', label: 'Terms of Service' },
  { type: 'shipping', label: 'Shipping Policy' },
];

export default function PoliciesPage() {
  const [active, setActive] = useState('refund');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getPolicy(active).then((p) => {
      setTitle(p.title || '');
      setContent(p.content || '');
    }).catch(console.error);
  }, [active]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updatePolicy(active, { title, content });
      toast.success('Policy saved!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Policy Pages</h1>
        <button onClick={handleSave} disabled={saving} className="btn-admin">{saving ? 'Saving...' : 'Save Policy'}</button>
      </div>

      <div className="flex gap-2 mb-6">
        {POLICIES.map((p) => (
          <button key={p.type} onClick={() => setActive(p.type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${active === p.type ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="card space-y-4">
        <input className="input-field" placeholder="Page Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="input-field font-mono text-sm" rows={20} placeholder="HTML content..."
          value={content} onChange={(e) => setContent(e.target.value)} />
        <p className="text-xs text-gray-400">Supports HTML. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; tags for formatting.</p>
      </div>
    </div>
  );
}
