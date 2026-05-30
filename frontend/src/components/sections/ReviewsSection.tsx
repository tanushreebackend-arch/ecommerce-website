'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSection } from '@/hooks/useSection';
import api from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';
import AnimateOnScroll, { AnimateOnScrollItem } from '@/components/AnimateOnScroll';
import SectionHeading from '@/components/SectionHeading';
import ReviewCard from '@/components/reviews/ReviewCard';
import ReviewForm from '@/components/reviews/ReviewForm';
import { selectFeaturedReviews, type Review } from '@/lib/reviews';
import { BRAND_PATH } from '@/lib/routes';

export default function ReviewsSection() {
  const pathname = usePathname();
  const productHref = pathname === BRAND_PATH ? '/#product' : '#product';
  const { content, isVisible } = useSection('reviewsSection');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.getPublishedReviews().then(setReviews).catch(console.error);
  }, []);

  if (!isVisible) return null;

  const sectionLabel = (content.sectionLabel as string) || 'TESTIMONIALS';
  const heading = (content.heading as string) || '';
  const featuredReviews = selectFeaturedReviews(reviews, 3);

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel}>{heading}</SectionHeading>

          <AnimateOnScroll stagger className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {featuredReviews.map((review) => (
              <AnimateOnScrollItem key={review._id}>
                <ReviewCard review={review} variant="featured" />
              </AnimateOnScrollItem>
            ))}
          </AnimateOnScroll>

          <AnimateOnScroll>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="btn-outline px-10 py-4"
              >
                {showForm ? 'Cancel' : 'Write a Review'}
              </button>

              {showForm && (
                <ReviewForm onSuccess={() => setShowForm(false)} onCancel={() => setShowForm(false)} />
              )}

              <Link href="/reviews" className="see-all-reviews-btn">
                See All Reviews
              </Link>

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
