'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { DashboardCharts, type ChartDay } from '@/components/dashboard/DashboardCharts';
import { DashboardWelcomeHeader } from '@/components/dashboard/DashboardWelcomeHeader';
import { DashboardQuickStats } from '@/components/dashboard/DashboardQuickStats';
import { DashboardRecentOrders } from '@/components/dashboard/DashboardRecentOrders';
import { adminApi } from '@/lib/api';

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

interface Review {
  rating: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    adminApi.getDashboard().then(setStats).catch(console.error);
    adminApi
      .getPublishedReviews()
      .then((reviews: Review[]) => {
        if (!Array.isArray(reviews) || reviews.length === 0) {
          setAvgRating(0);
          return;
        }
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        setAvgRating(Math.round((sum / reviews.length) * 10) / 10);
      })
      .catch(() => setAvgRating(0));
  }, []);

  const quickStats = useMemo(() => {
    if (!stats) return { conversionRate: 0, avgOrderValue: 0, returnRate: 0, satisfactionScore: 0 };
    return {
      conversionRate: 0,
      avgOrderValue: stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0,
      returnRate: 0,
      satisfactionScore: avgRating,
    };
  }, [stats, avgRating]);

  if (!stats) {
    return (
      <div className="dash-page">
        <div className="animate-pulse text-[#999999] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Revenue', value: stats.totalRevenue, isCurrency: true, chartVariant: 'revenue-area' as const },
    { label: 'Total Orders', value: stats.totalOrders, chartVariant: 'orders-bar' as const },
    { label: 'Total Customers', value: stats.totalCustomers },
    { label: 'Total Products', value: stats.totalProducts },
    { label: 'Orders Today', value: stats.ordersToday },
    { label: 'Orders This Month', value: stats.ordersMonth },
    { label: 'Revenue Today', value: stats.revenueToday, isCurrency: true, chartVariant: 'revenue-sparkline' as const },
    { label: 'Revenue This Month', value: stats.revenueMonth, isCurrency: true, chartVariant: 'revenue-sparkline' as const },
    { label: 'Pending Reviews', value: stats.pendingReviews },
    { label: 'New Enquiries', value: stats.newEnquiries },
  ];

  return (
    <div className="dash-page">
      <DashboardWelcomeHeader />

      {stats.lowStock && (
        <div className="dash-alert mb-5">
          ⚠️ Low stock alert: Only {stats.stockCount} items remaining
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-5">
        {cards.map((card, index) => (
          <DashboardStatCard
            key={card.label}
            label={card.label}
            value={card.value}
            index={index}
            isCurrency={card.isCurrency}
            chartVariant={card.chartVariant}
            chartData={card.chartVariant ? stats.chartData : undefined}
          />
        ))}
      </div>

      <DashboardCharts data={stats.chartData} />

      <DashboardQuickStats
        conversionRate={quickStats.conversionRate}
        avgOrderValue={quickStats.avgOrderValue}
        returnRate={quickStats.returnRate}
        satisfactionScore={quickStats.satisfactionScore}
      />

      <DashboardRecentOrders />
    </div>
  );
}
