'use client';

import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ChartDay {
  date: string;
  label: string;
  orders: number;
  revenue: number;
}

interface DashboardChartsProps {
  data: ChartDay[];
}

function ChartTooltip({
  active,
  payload,
  label,
  isCurrency,
  accentColor = '#F97316',
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
  isCurrency?: boolean;
  accentColor?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const formatted = isCurrency
    ? `₹${Number(value).toLocaleString('en-IN')}`
    : Number(value).toLocaleString('en-IN');

  return (
    <div className="dash-chart-tooltip" style={{ borderColor: accentColor }}>
      <p className="dash-chart-tooltip-label">{label}</p>
      <p className="dash-chart-tooltip-value" style={{ color: accentColor }}>
        {formatted}
      </p>
    </div>
  );
}

function DateRangeLabel({ data }: { data: ChartDay[] }) {
  if (!data.length) return <span className="dash-chart-range">Last 7 days</span>;
  const start = data[0]?.label;
  const end = data[data.length - 1]?.label;
  return (
    <span className="dash-chart-range">
      {start} — {end}
    </span>
  );
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0, 0, 0.2, 1] }}
    >
      <div className="dash-chart-card">
        <div className="dash-chart-header">
          <div>
            <h2 className="dash-chart-title">Revenue</h2>
            <p className="dash-chart-subtitle">Last 7 days</p>
          </div>
          <DateRangeLabel data={data} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249,115,22,0.15)" />
                <stop offset="100%" stopColor="rgba(249,115,22,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#F5F5F5" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<ChartTooltip isCurrency accentColor="#F97316" />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#F97316"
              strokeWidth={2}
              fill="url(#revenueAreaFill)"
              dot={{ r: 4, fill: '#F97316', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#F97316' }}
              isAnimationActive
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-chart-card">
        <div className="dash-chart-header">
          <div>
            <h2 className="dash-chart-title">Orders</h2>
            <p className="dash-chart-subtitle">Last 7 days</p>
          </div>
          <DateRangeLabel data={data} />
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} stroke="#F5F5F5" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#999999' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip accentColor="#3B82F6" />} />
            <Bar
              dataKey="orders"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
