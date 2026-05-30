'use client';

import Image from 'next/image';
import { Star, BadgeCheck } from 'lucide-react';
import { formatReviewDate, type Review } from '@/lib/reviews';

interface ReviewCardProps {
  review: Review;
  variant?: 'featured' | 'grid';
}

export default function ReviewCard({ review, variant = 'grid' }: ReviewCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <article
      className={
        isFeatured
          ? 'luxury-card p-6 md:p-8 text-left relative h-full'
          : 'review-grid-card'
      }
    >
      {isFeatured && (
        <span className="review-quote-mark absolute top-4 left-6 leading-none" aria-hidden>
          &ldquo;
        </span>
      )}

      <p
        className={
          isFeatured
            ? 'font-heading text-base md:text-lg font-normal mb-2 mt-6 text-[var(--color-heading)]'
            : 'review-card-title'
        }
      >
        {review.title}
      </p>

      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star
            key={j}
            size={isFeatured ? 16 : 14}
            strokeWidth={1}
            className={j < review.rating ? 'star-fill' : 'star-empty'}
          />
        ))}
      </div>

      <p
        className={
          isFeatured
            ? 'text-sm md:text-[15px] text-[var(--color-text-secondary)] leading-[1.8] font-body font-light mb-4'
            : 'review-card-text'
        }
      >
        {review.text}
      </p>

      {review.photo?.url && (
        <div className={`relative w-full mb-4 overflow-hidden ${isFeatured ? 'max-h-[200px]' : 'max-h-[200px] rounded-sm'}`}>
          <Image
            src={review.photo.url}
            alt={`Photo by ${review.name}`}
            width={400}
            height={200}
            className="w-full max-h-[200px] object-cover"
            unoptimized={review.photo.url.startsWith('http://localhost')}
          />
        </div>
      )}

      {review.video?.url && (
        <video
          src={review.video.url}
          controls
          className="w-full max-h-[200px] mb-4 bg-black rounded-sm"
          preload="metadata"
        />
      )}

      <p className={isFeatured ? 'reviewer-name text-base text-[var(--color-heading)]' : 'review-card-name'}>
        {review.name}
      </p>

      {!isFeatured && review.createdAt && (
        <p className="review-card-date">{formatReviewDate(review.createdAt)}</p>
      )}

      {review.isVerifiedBuyer !== false && (
        <span className="verified-badge mt-2">
          <BadgeCheck size={13} strokeWidth={1.25} /> Verified Buyer
        </span>
      )}
    </article>
  );
}
