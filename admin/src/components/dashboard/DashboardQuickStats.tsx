'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface DashboardQuickStatsProps {
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
  satisfactionScore: number;
}

const easeOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

export function DashboardQuickStats({
  conversionRate,
  avgOrderValue,
  returnRate,
  satisfactionScore,
}: DashboardQuickStatsProps) {
  const items = [
    {
      label: 'Conversion Rate',
      display: (
        <>
          <CountUp end={conversionRate} duration={1.5} decimals={1} suffix="%" easingFn={easeOutQuad} />
        </>
      ),
    },
    {
      label: 'Avg Order Value',
      display: (
        <>
          ₹<CountUp end={avgOrderValue} duration={1.5} separator="," easingFn={easeOutQuad} />
        </>
      ),
    },
    {
      label: 'Return Rate',
      display: (
        <>
          <CountUp end={returnRate} duration={1.5} decimals={1} suffix="%" easingFn={easeOutQuad} />
        </>
      ),
    },
    {
      label: 'Satisfaction Score',
      display: (
        <>
          <CountUp end={satisfactionScore} duration={1.5} decimals={1} easingFn={easeOutQuad} />
          <span className="text-xl font-bold text-[#0A0A0A]">/5</span>
        </>
      ),
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0, 0, 0.2, 1] }}
    >
      {items.map((item) => (
        <div key={item.label} className="dash-quick-stat-card">
          <div className="dash-quick-stat-value">{item.display}</div>
          <p className="dash-quick-stat-label">{item.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
