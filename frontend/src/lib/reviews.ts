export interface Review {
  _id: string;
  name: string;
  email?: string;
  title: string;
  text: string;
  rating: number;
  photo?: { url?: string; publicId?: string };
  video?: { url?: string; publicId?: string };
  isPinned?: boolean;
  isVerifiedBuyer?: boolean;
  status?: string;
  createdAt?: string;
}

/** Up to `max` reviews: pinned first, then fill with unpinned if slots remain. */
export function selectFeaturedReviews(reviews: Review[], max = 3): Review[] {
  const pinned = reviews.filter((r) => r.isPinned);
  const unpinned = reviews.filter((r) => !r.isPinned);
  const featured: Review[] = [];

  for (const review of pinned) {
    if (featured.length >= max) break;
    featured.push(review);
  }

  for (const review of unpinned) {
    if (featured.length >= max) break;
    featured.push(review);
  }

  return featured;
}

export function formatReviewDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
