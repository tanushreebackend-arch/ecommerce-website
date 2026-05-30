'use client';

import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Image from 'next/image';

export default function ContactPage() {
  const { settings } = useSettings();
  const content = settings?.sections?.contact?.content as Record<string, string> | undefined;
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const bgImage = content?.backgroundImage;

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
    <div className="relative min-h-[70vh]">
      {bgImage && (
        <div className="absolute inset-0 z-0">
          <Image src={bgImage} alt="" fill className="object-cover" quality={100} sizes="100vw" />
          <div className="absolute inset-0 bg-white/85" />
        </div>
      )}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <AnimateOnScroll>
        <h1 className="page-heading text-center mb-3">{content?.heading || 'Get In Touch'}</h1>
        <p className="text-[#999999] text-center mb-10">{content?.subheading}</p>
        </AnimateOnScroll>

        {submitted ? (
          <AnimateOnScroll delay={0.1}>
          <div className="text-center border border-[var(--color-card-border)] p-8">
            <p className="section-lead text-brand">Thank you for reaching out!</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text)' }}>We&apos;ll get back to you as soon as possible.</p>
          </div>
          </AnimateOnScroll>
        ) : (
          <AnimateOnScroll delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 rounded-2xl p-6 border border-[var(--color-card-border)] shadow-sm">
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            <textarea placeholder="Message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
          </AnimateOnScroll>
        )}
      </div>
    </div>
  );
}
