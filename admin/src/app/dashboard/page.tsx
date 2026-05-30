'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import Link from 'next/link';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { DashboardCharts, type ChartDay } from '@/components/dashboard/DashboardCharts';

interface DashboardStats {
  ordersToday: number;
  ordersMonth: number;
  revenueToday: number;
  revenueMonth: number;
  pendingReviews: number;
  newEnquiries: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStock: boolean;
  stockCount: number;
  chartData: ChartDay[];
  recentOrders: {
    orderId: string;
    customerName: string;
    total: number;
    orderStatus: string;
    createdAt: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="animate-pulse">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Revenue', value: stats.totalRevenue, isCurrency: true },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Total Customers', value: stats.totalCustomers },
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Orders Today', value: stats.ordersToday },
    { label: 'Orders This Month', value: stats.ordersMonth },
    { label: 'Revenue Today', value: stats.revenueToday, isCurrency: true },
    { label: 'Revenue This Month', value: stats.revenueMonth, isCurrency: true },
    { label: 'Pending Reviews', value: stats.pendingReviews },
    { label: 'New Enquiries', value: stats.newEnquiries },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {stats.lowStock && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-yellow-800 text-sm">
          ⚠️ Low stock alert: Only {stats.stockCount} items remaining
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card, index) => (
          <DashboardStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            index={index}
            isCurrency={card.isCurrency}
          />
        ))}
      </div>

      <DashboardCharts data={stats.chartData} />

      <div className="card">
        <h2 className="font-semibold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-3 pr-4">Order ID</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/orders/${order.orderId}`}
                      className="text-green-700 hover:underline font-medium"
                    >
                      {order.orderId}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{order.customerName}</td>
                  <td className="py-3 pr-4">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 capitalize">
                      {order.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
