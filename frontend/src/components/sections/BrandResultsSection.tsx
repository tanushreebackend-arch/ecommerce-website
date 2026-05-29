'use client';

import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';

const DEFAULT_STATS = [
  {
    percent: 93,
    text: 'Reported improved mood balance and emotional well-being without the afternoon crash.*',
  },
  {
    percent: 89,
    text: 'Noticed significantly sharper focus and reduced mental fog during daily tasks.*',
  },
  {
    percent: 95,
    text: 'Felt a measurable improvement in overall vitality and joint comfort from daily strain.*',
  },
];

function CircularStat({ percent, text }: { percent: number; text: string }) {
  const size = 96;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex gap-5 items-start py-6 border-b border-gray-200 last:border-b-0">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-heading font-bold text-lg text-gray-900">
          {percent}%
        </span>
      </div>
      <p className="text-[15px] leading-relaxed text-gray-800 font-body pt-5">{text}</p>
    </div>
  );
}

export default function BrandResultsSection() {
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const brandName = String(product?.brandName || 'NOW FOODS').toUpperCase();
  const raw = settings?.sections?.brandResults?.content as Record<string, unknown> | undefined;

  const title = (raw?.title as string) || 'REAL RESULTS IN 30 DAYS';
  const intro =
    (raw?.intro as string) ||
    `We asked our customers how they felt after 4 weeks of daily ${brandName} SAMe use.`;
  const sideHeading = (raw?.sideHeading as string) || 'Here is what they said:';
  const stats = Array.isArray(raw?.stats) && (raw.stats as typeof DEFAULT_STATS).length
    ? (raw.stats as typeof DEFAULT_STATS)
    : DEFAULT_STATS;

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-tight tracking-wide text-gray-900 mb-5">
                {title}
              </h1>
              <p className="text-[15px] md:text-base text-gray-700 leading-relaxed font-body max-w-md">
                {intro}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-2">{sideHeading}</h2>
              <div>
                {stats.map((stat, i) => (
                  <CircularStat key={i} percent={stat.percent} text={stat.text} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
