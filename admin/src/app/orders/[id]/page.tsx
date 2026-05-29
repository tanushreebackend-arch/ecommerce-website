'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');

  useEffect(() => {
    adminApi.getOrder(params.id as string).then((o) => {
      setOrder(o);
      setStatus(o.orderStatus);
      setTrackingNumber(o.trackingNumber || '');
      setCourierName(o.courierName || '');
    }).catch(console.error);
  }, [params.id]);

  const handleUpdate = async () => {
    try {
      const updated = await adminApi.updateOrderStatus(params.id as string, {
        orderStatus: status, trackingNumber, courierName,
      });
      setOrder(updated);
      toast.success('Order updated!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  if (!order) return <div>Loading...</div>;

  const address = order.shippingAddress as Record<string, string>;
  const items = order.items as { name: string; packLabel: string; price: number; quantity: number; image?: string }[];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Order #{order.orderId as string}</h1>
      <p className="text-gray-500 mb-8">{new Date(order.createdAt as string).toLocaleString()}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="font-semibold">Customer Info</h2>
          <p><strong>Name:</strong> {order.customerName as string}</p>
          <p><strong>Email:</strong> {order.customerEmail as string}</p>
          <p><strong>Phone:</strong> {(order.customerPhone as string) || '—'}</p>
          {address && (
            <div>
              <strong>Address:</strong>
              <p className="text-sm text-gray-600 mt-1">
                {address.firstName} {address.lastName}<br />
                {address.address}{address.apartment && `, ${address.apartment}`}<br />
                {address.city}, {address.state} {address.pinCode}<br />
                {address.country}
              </p>
            </div>
          )}
        </div>

        <div className="card space-y-4">
          <h2 className="font-semibold">Update Status</h2>
          <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <input className="input-field" placeholder="Tracking Number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          <input className="input-field" placeholder="Courier Name" value={courierName} onChange={(e) => setCourierName(e.target.value)} />
          <button onClick={handleUpdate} className="btn-admin">Update Order</button>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-semibold mb-4">Items</h2>
          {items?.map((item, i) => (
            <div key={i} className="flex justify-between py-2 border-b last:border-0 text-sm">
              <span>{item.name} ({item.packLabel}) x{item.quantity}</span>
              <span className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>₹{(order.total as number).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
