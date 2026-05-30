'use client';

import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

export function DashboardCharts({ data }: DashboardChartsProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0, 0, 0.2, 1] }}
    >
      <div className="card">
        <h2 className="font-semibold mb-4">Revenue (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
            <Tooltip
              formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
            />
            <Bar
              dataKey="revenue"
              fill="#000000"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Orders (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#000000"
              strokeWidth={2}
              dot={{ r: 4, fill: '#000000' }}
              isAnimationActive
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
