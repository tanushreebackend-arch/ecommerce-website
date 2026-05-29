'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId') || '';
  const name = params.get('name') || 'there';

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">✓</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Thank you, {name}!</h1>
      <p className="text-gray-500 mb-2">Order #{orderId}</p>
      <p className="text-lg mb-8">Your order is confirmed</p>
      <p className="text-sm text-gray-500 mb-8">
        A confirmation email has been sent to your email address. Estimated delivery in 3-5 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/track-order?orderId=${orderId}`} className="btn-primary">Track Your Order</Link>
        <Link href="/" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
