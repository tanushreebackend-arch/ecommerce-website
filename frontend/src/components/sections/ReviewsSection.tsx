'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Star, BadgeCheck } from 'lucide-react';
import { useSection } from '@/hooks/useSection';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import ScrollReveal from '@/components/ScrollReveal';
import AnimateOnScroll, { AnimateOnScrollItem } from '@/components/AnimateOnScroll';
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
  const { content, isVisible } = useSection('reviewsSection');
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

  if (!isVisible) return null;

  const sectionLabel = (content.sectionLabel as string) || 'TESTIMONIALS';
  const heading = (content.heading as string) || '';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel}>{heading}</SectionHeading>

          <AnimateOnScroll stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {reviews.slice(0, 3).map((review) => (
                <AnimateOnScrollItem key={review._id}>
                <div className="luxury-card p-6 md:p-8 text-left relative h-full">
                  <span className="review-quote-mark absolute top-4 left-6 leading-none" aria-hidden>&ldquo;</span>
                  <p className="font-heading text-base md:text-lg font-normal mb-2 mt-6 text-[var(--color-heading)]">{review.title}</p>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={16} strokeWidth={1} className={j < review.rating ? 'star-fill' : 'star-empty'} />
                    ))}
                  </div>
                  <p className="text-sm md:text-[15px] text-[var(--color-text-secondary)] leading-[1.8] font-body font-light mb-4">
                    {review.text}
                  </p>
                  <p className="reviewer-name text-base text-[var(--color-heading)]">{review.name}</p>
                  <span className="verified-badge mt-2">
                    <BadgeCheck size={13} strokeWidth={1.25} /> Verified Buyer
                  </span>
                </div>
                </AnimateOnScrollItem>
              ))}
          </AnimateOnScroll>

          <AnimateOnScroll>
          <div className="flex flex-col items-center">
            <button type="button" onClick={() => setShowForm(!showForm)} className="btn-outline px-10 py-4 mb-4">
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto text-left space-y-4 luxury-card p-6 mb-6">
                <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury-box w-full" />
                <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury-box w-full" />
                <input placeholder="Review Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-luxury-box w-full" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setForm({ ...form, rating: r })}>
                      <Star size={20} strokeWidth={1} className={r <= form.rating ? 'star-fill' : 'star-empty'} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Your review" required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="input-luxury-box w-full resize-none" />
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            <a href={productHref} className="product-btn-secondary inline-flex w-auto px-12 py-4">
              {(content.ctaText as string) || 'Buy Now & Save'}
            </a>
          </div>
          </AnimateOnScroll>
        </div>
      </ScrollReveal>
    </section>
  );
}
