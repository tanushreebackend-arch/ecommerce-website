'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal';

export default function BrandContactSection() {
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

  const inputClass = 'input-luxury-box w-full';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main max-w-2xl">
          <h2 className="font-heading text-xl md:text-[28px] font-normal text-center text-[var(--color-heading)] mb-6">
            {content?.heading || 'Contact form'}
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <p className="text-brand font-normal text-base">Thank you for reaching out!</p>
              <p className="text-sm mt-2 text-[#555555]">We&apos;ll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
                <input
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                />
              </div>
              <input
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
              />
              <textarea
                placeholder="Comment"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputClass} resize-none min-h-[120px]`}
              />
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-4">
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
