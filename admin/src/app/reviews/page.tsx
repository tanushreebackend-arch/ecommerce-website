'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

interface Review {
  _id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  text: string;
  status: string;
  isPinned: boolean;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={16} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [tab, setTab] = useState<'pending' | 'published'>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = () => {
    const fn = tab === 'pending' ? adminApi.getPendingReviews : adminApi.getPublishedReviews;
    fn().then(setReviews).catch(console.error);
  };

  useEffect(() => { loadReviews(); }, [tab]);

  const handleApprove = async (id: string) => {
    await adminApi.approveReview(id);
    toast.success('Review approved & published!');
    loadReviews();
  };

  const handleReject = async (id: string) => {
    await adminApi.rejectReview(id);
    toast.success('Review rejected');
    loadReviews();
  };

  const handleUnpublish = async (id: string) => {
    await adminApi.unpublishReview(id);
    toast.success('Review unpublished');
    loadReviews();
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    await adminApi.pinReview(id, isPinned);
    toast.success(isPinned ? 'Pinned to top' : 'Unpinned');
    loadReviews();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Review Manager</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6 text-sm text-amber-900">
        Reviews submitted by users appear here first. You must approve them before they show on the website.
      </div>

      <div className="flex gap-2 mb-6">
        {(['pending', 'published'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide ${
              tab === t ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'pending' ? '⏳ Pending' : '✅ Published'}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review._id} className={`card ${tab === 'pending' ? 'border-l-4 border-l-amber-400' : ''}`}>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <div>
                <p className="font-bold text-lg">{review.name}</p>
                <StarRating rating={review.rating} />
                <p className="font-semibold text-gray-800 mt-2">{review.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {review.email} • Submitted {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {review.isPinned && tab === 'published' && (
                <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 PINNED</span>
              )}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-lg p-4">{review.text}</p>

            {tab === 'pending' ? (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApprove(review._id)}
                  className="flex-1 min-w-[180px] py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  ✅ APPROVE & PUBLISH
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  className="flex-1 min-w-[180px] py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors"
                >
                  ❌ REJECT
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handlePin(review._id, !review.isPinned)}
                  className={`py-2.5 px-5 rounded-lg text-sm font-semibold ${
                    review.isPinned ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {review.isPinned ? '📌 UNPIN' : '📌 PIN TO TOP'}
                </button>
                <button
                  onClick={() => handleUnpublish(review._id)}
                  className="py-2.5 px-5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100"
                >
                  UNPUBLISH
                </button>
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 text-center py-12">
            No {tab} reviews {tab === 'pending' ? 'waiting for approval' : 'on the website yet'}
          </p>
        )}
      </div>
    </div>
  );
}
