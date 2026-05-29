'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Circle } from 'lucide-react';
import api from '@/lib/api';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

function TrackOrderContent() {
  const params = useSearchParams();
  const [orderId, setOrderId] = useState(params.get('orderId') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.trackOrder(orderId, email);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order not found');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.orderStatus as string) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Track Your Order</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input placeholder="Order ID" required value={orderId} onChange={(e) => setOrderId(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        <input type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {order && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <p className="font-bold mb-1">Order #{order.orderId as string}</p>
          <p className="text-sm text-gray-500 mb-6">Total: ₹{(order.total as number)?.toLocaleString('en-IN')}</p>

          <div className="space-y-4">
            {STATUS_STEPS.map((step, i) => {
              const isComplete = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step} className={`flex items-center gap-3 ${isComplete ? 'text-green-600' : 'text-gray-400'}`}>
                  {isComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                  <span className={`font-medium ${isCurrent ? 'font-bold' : ''}`}>{STATUS_LABELS[step]}</span>
                </div>
              );
            })}
          </div>

          {Boolean(order.trackingNumber) && (
            <div className="mt-6 pt-6 border-t text-sm">
              <p><strong>Courier:</strong> {(order.courierName as string) || 'Standard Delivery'}</p>
              <p><strong>Tracking #:</strong> {order.trackingNumber as string}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
