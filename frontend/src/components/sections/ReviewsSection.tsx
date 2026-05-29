'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Star, BadgeCheck } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';
import { BRAND_PATH } from '@/lib/routes';

interface Review {
  _id: string;
  name: string;
  title: string;
  text: string;
  rating: number;
  photo?: { url?: string };
}

export default function ReviewsSection() {
  const pathname = usePathname();
  const productHref = pathname === BRAND_PATH ? '/#product' : '#product';
  const { settings } = useSettings();
  const content = settings?.sections?.reviewsSection?.content as Record<string, string> | undefined;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rating: 5, title: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getPublishedReviews().then(setReviews).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitReview(form);
      toast.success('Review submitted for approval!');
      setShowForm(false);
      setForm({ name: '', email: '', rating: 5, title: '', text: '' });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!content) return null;

  const heading = content.heading || '400+ People Are Already Feeling Better With NOW Foods SAMe';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label="TESTIMONIALS">{heading}</SectionHeading>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {reviews.slice(0, 3).map((review) => (
                <div key={review._id} className="luxury-card p-8 md:p-10 text-left relative">
                  <span className="review-quote-mark absolute top-4 left-6 leading-none" aria-hidden>&ldquo;</span>
                  <p className="font-heading text-lg md:text-xl mb-4 mt-8 text-[var(--color-heading)]">{review.title}</p>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={16} strokeWidth={1} className={j < review.rating ? 'star-gold' : 'text-[var(--color-card-border)]'} />
                    ))}
                  </div>
                  <p className="text-sm md:text-[15px] text-[var(--color-text-secondary)] leading-[1.8] font-body font-light mb-8">
                    {review.text}
                  </p>
                  <p className="reviewer-name text-base text-[var(--color-heading)]">{review.name}</p>
                  <span className="verified-badge mt-2">
                    <BadgeCheck size={13} strokeWidth={1.25} /> Verified Buyer
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="flex flex-col items-center">
            <button type="button" onClick={() => setShowForm(!showForm)} className="btn-outline px-10 py-4 mb-8">
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto text-left space-y-5 luxury-card p-8 mb-10">
                <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury-box w-full" />
                <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury-box w-full" />
                <input placeholder="Review Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxury-box w-full" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                      <Star size={20} strokeWidth={1} className={r <= form.rating ? 'star-gold' : 'text-[var(--color-card-border)]'} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Your review" required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input-luxury-box w-full resize-none" />
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            <a href={productHref} className="btn-secondary inline-block px-12 py-4">
              {content.ctaText || 'Buy Now & Save'}
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
