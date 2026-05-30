'use client';

import { useSection } from '@/hooks/useSection';
import ScrollReveal from '@/components/ScrollReveal';
import AnimateOnScroll, { AnimateOnScrollItem } from '@/components/AnimateOnScroll';
import SectionHeading from '@/components/SectionHeading';

interface StatItem {
  number: string;
  description: string;
}

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
  const { content, isVisible } = useSection('scienceStats');

  if (!isVisible) return null;

  const stats = ((content.stats as StatItem[]) || []).slice(0, 4);
  const sectionLabel = (content.sectionLabel as string) || 'CLINICAL RESEARCH';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <AnimateOnScroll>
            <SectionHeading
              label={sectionLabel}
              subheading={(content.subtitle as string) || undefined}
            >
              {(content.title as string) || ''}
            </SectionHeading>
          </AnimateOnScroll>
          {stats.length > 0 && (
            <AnimateOnScroll stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <AnimateOnScrollItem key={i} className="text-center px-2">
                  <p className="text-2xl md:text-[28px] mb-2">
                    <StatNumber value={stat.number} />
                  </p>
                  <p className="text-sm md:text-[15px] leading-[1.8] font-body font-light text-[var(--color-text)]">
                    {stat.description}
                  </p>
                </AnimateOnScrollItem>
              ))}
            </AnimateOnScroll>
          )}
          {(content.closingText as string) && (
            <AnimateOnScroll delay={0.2}>
              <p className="text-center text-sm md:text-base font-body font-light mt-6 max-w-2xl mx-auto text-[var(--color-text)]">
                {content.closingText as string}
              </p>
            </AnimateOnScroll>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}
