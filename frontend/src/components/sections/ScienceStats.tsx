'use client';

import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_STATS = [
  { number: '40+', description: 'Years of SAMe research in mood and emotional well-being studies.*' },
  { number: '2 wks', description: 'Minimum recommended use before evaluating benefits — consistency matters.*' },
  { number: '400mg', description: 'Maximum-strength dose per tablet — fewer pills needed daily.*' },
  { number: 'GMP', description: 'Manufactured in GMP-certified facilities with strict quality standards.*' },
];

function StatNumber({ value }: { value: string }) {
  if (!value.includes('%')) {
    return (
      <span className="font-heading font-medium leading-none text-2xl md:text-[28px] text-[var(--color-heading)]">
        {value}
      </span>
    );
  }
  const num = value.replace('%', '');
  return (
    <span className="font-heading font-medium leading-none text-[var(--color-heading)]">
      {num}
      <sup className="text-[0.5em] font-normal ml-0.5 align-super">%</sup>
    </span>
  );
}

export default function ScienceStats() {
  const { settings } = useSettings();
  const raw = settings?.sections?.scienceStats?.content as Record<string, unknown> | undefined;
  if (!raw) return null;

  const apiStats = (raw.stats as typeof DEFAULT_STATS) || [];
  const isLegacy =
    apiStats.some((s) => ['47%', '33%', '62%', '89%'].includes(s.number)) ||
    String(raw.subtitle || '').includes('Bee Bread');
  const stats = isLegacy || apiStats.length < 4 ? DEFAULT_STATS : apiStats.slice(0, 4);
  const title = (raw.title as string) || 'The Science Behind SAMe';
  const subtitle = isLegacy ? 'What research says about S-Adenosyl-L-Methionine:' : (raw.subtitle as string) || 'What research says about S-Adenosyl-L-Methionine:';
  const closingText = isLegacy
    ? 'With NOW Foods SAMe 400 mg, you\'re supporting the natural pathways your body uses for mood, mind, and movement.*'
    : (raw.closingText as string) || 'With NOW Foods SAMe 400 mg, you\'re supporting the natural pathways your body uses for mood, mind, and movement.*';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal stagger>
        <div className="container-main">
          <SectionHeading label="CLINICAL RESEARCH" subheading={subtitle}>
            {title}
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-2">
                <p className="text-2xl md:text-[28px] mb-2">
                  <StatNumber value={stat.number} />
                </p>
                <p className="text-sm md:text-[15px] leading-[1.8] font-body font-light opacity-90">{stat.description}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm md:text-base font-body font-light mt-6 max-w-2xl mx-auto opacity-90">
            {closingText}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
