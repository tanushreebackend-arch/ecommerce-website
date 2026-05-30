'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts';
import { STAT_CARD_ICONS } from './dashboardStyles';
import { ShoppingBag } from 'lucide-react';
import type { ChartDay } from './DashboardCharts';

const easeOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

export type StatCardChartVariant = 'revenue-area' | 'orders-bar' | 'revenue-sparkline';

interface DashboardStatCardProps {
  label: string;
  value: number;
  index: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  chartVariant?: StatCardChartVariant;
  chartData?: ChartDay[];
}

function StatCardMiniChart({
  variant,
  data,
}: {
  variant: StatCardChartVariant;
  data: ChartDay[];
}) {
  const chartData = data.map((d) => ({
    label: d.label,
    revenue: d.revenue,
    orders: d.orders,
  }));

  if (!chartData.length) return null;

  if (variant === 'revenue-area') {
    return (
      <ResponsiveContainer width="100%" height={50}>
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="statRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(249,115,22,0.1)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0)" />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#F97316"
            strokeWidth={1.5}
            fill="url(#statRevenueFill)"
            isAnimationActive
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  if (variant === 'orders-bar') {
    return (
      <ResponsiveContainer width="100%" height={50}>
        <BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Bar
            dataKey="orders"
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
            isAnimationActive
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={50}>
      <LineChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#22C55E"
          strokeWidth={1.5}
          dot={false}
          isAnimationActive
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DashboardStatCard({
  label,
  value,
  index,
  isCurrency = false,
  prefix,
  suffix,
  chartVariant,
  chartData,
}: DashboardStatCardProps) {
  const Icon = STAT_CARD_ICONS[label] ?? ShoppingBag;
  const showChart = chartVariant && chartData && chartData.length > 0;

  return (
    <motion.div
      className={`dash-stat-card${showChart ? ' dash-stat-card--chart' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0, 0, 0.2, 1] }}
    >
      <div className="dash-stat-card-top">
        <div className="dash-stat-card-left">
          <p className="dash-stat-label">{label}</p>
          <p className="dash-stat-value">
            <CountUp
              start={0}
              end={value}
              duration={1.5}
              prefix={isCurrency ? '₹' : prefix}
              suffix={suffix}
              separator=","
              easingFn={easeOutQuad}
            />
          </p>
          <p className="dash-stat-subtext">vs last month</p>
        </div>
        <div className="dash-stat-icon-wrap">
          <Icon size={20} strokeWidth={1.75} className="text-[#0A0A0A]" />
        </div>
      </div>
      {showChart && (
        <div className="dash-stat-mini-chart">
          <StatCardMiniChart variant={chartVariant} data={chartData} />
        </div>
      )}
    </motion.div>
  );
}
