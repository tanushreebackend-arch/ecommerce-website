'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomeContactSection() {
  const { settings } = useSettings();
  const content = settings?.sections?.contact?.content as Record<string, string> | undefined;
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitEnquiry(form);
      setSubmitted(true);
      toast.success('Message sent!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding section-alt">
      <ScrollReveal>
        <div className="container-main max-w-xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            {content?.heading || 'Contact form'}
          </h2>

          {submitted ? (
            <div className="text-center bg-white rounded-2xl p-8 border border-[var(--color-card-border)]">
              <p className="text-brand font-semibold text-lg">Thank you for reaching out!</p>
              <p className="text-sm mt-2 text-gray-600">We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 border border-[var(--color-card-border)] shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <textarea
                placeholder="Comment"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none font-body focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
