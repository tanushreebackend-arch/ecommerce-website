'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ReviewCard from '@/components/reviews/ReviewCard';
import type { Review } from '@/lib/reviews';

export default function AllReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPublishedReviews()
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/#product');
    }
  };

  return (
    <section className="section-padding luxury-section-white min-h-[60vh]">
      <div className="container-main">
        <button type="button" onClick={handleBack} className="reviews-back-btn mb-8">
          ← BACK TO SHOP
        </button>

        <header className="text-center mb-10">
          <h1 className="reviews-page-heading">ALL REVIEWS</h1>
          <p className="reviews-page-subtext">What our customers are saying</p>
        </header>

        {loading ? (
          <p className="text-center text-[var(--color-text-secondary)] font-body text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-[var(--color-text-secondary)] font-body text-sm">No reviews yet.</p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
