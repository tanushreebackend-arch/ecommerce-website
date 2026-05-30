'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { getOrderStatusBadge } from './dashboardStyles';

interface OrderRow {
  orderId: string;
  customerName: string;
  total: number;
  orderStatus: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const type = getOrderStatusBadge(status);
  const label = status.replace(/_/g, ' ');

  if (type === 'processing') {
    return <span className="dash-order-badge dash-order-badge-processing">{label}</span>;
  }
  if (type === 'delivered') {
    return <span className="dash-order-badge dash-order-badge-delivered">{label}</span>;
  }
  return <span className="dash-order-badge dash-order-badge-pending">{label}</span>;
}

export function DashboardRecentOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    adminApi
      .getOrders()
      .then((data) => setOrders(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(console.error);
  }, []);

  return (
    <motion.div
      className="dash-table-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0, 0, 0.2, 1] }}
    >
      <div className="dash-table-header">
        <h2 className="dash-chart-title">Recent Orders</h2>
        <Link href="/orders" className="dash-table-link">
          View All →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full dash-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="dash-table-empty">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.orderId}>
                  <td>
                    <Link href={`/orders/${order.orderId}`} className="dash-order-id">
                      {order.orderId}
                    </Link>
                  </td>
                  <td>{order.customerName}</td>
                  <td>₹{order.total.toLocaleString('en-IN')}</td>
                  <td>
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="text-[#999999]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
