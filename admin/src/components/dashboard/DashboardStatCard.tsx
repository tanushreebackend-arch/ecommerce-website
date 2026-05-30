'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const easeOutQuad = (t: number, b: number, c: number, d: number) => {
  t /= d;
  return -c * t * (t - 2) + b;
};

interface DashboardStatCardProps {
  label: string;
  value: number;
  index: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
}

export function DashboardStatCard({
  label,
  value,
  index,
  isCurrency = false,
  prefix,
  suffix,
}: DashboardStatCardProps) {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0, 0, 0.2, 1] }}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">
        <CountUp
          start={0}
          end={value}
          duration={2}
          prefix={isCurrency ? '₹' : prefix}
          suffix={suffix}
          separator=","
          easingFn={easeOutQuad}
        />
      </p>
    </motion.div>
  );
}
