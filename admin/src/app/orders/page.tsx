'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    adminApi.getOrders().then(setOrders).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Order Manager</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 pr-4">Order ID</th>
              <th className="pb-3 pr-4">Customer</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Items</th>
              <th className="pb-3 pr-4">Total</th>
              <th className="pb-3 pr-4">Payment</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-3 pr-4">
                  <Link href={`/orders/${order.orderId}`} className="text-green-700 hover:underline font-medium">{order.orderId}</Link>
                </td>
                <td className="py-3 pr-4">{order.customerName}</td>
                <td className="py-3 pr-4">{order.customerEmail}</td>
                <td className="py-3 pr-4">{order.items?.length || 0} item(s)</td>
                <td className="py-3 pr-4 font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                <td className="py-3 pr-4 capitalize">{order.paymentStatus}</td>
                <td className="py-3 pr-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">{order.orderStatus.replace(/_/g, ' ')}</span>
                </td>
                <td className="py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
