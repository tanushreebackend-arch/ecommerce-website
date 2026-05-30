'use client';

import { useSection } from '@/hooks/useSection';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

interface BenefitCard {
  icon?: string;
  title: string;
  description: string;
}

export default function BenefitsGrid() {
  const { content, isVisible } = useSection('benefitsGrid');

  if (!isVisible) return null;

  const cards = (content.cards as BenefitCard[]) || [];
  const sectionLabel = (content.sectionLabel as string) || 'FEATURES';
  const heading = (content.heading as string) || '';
  const subtext = (content.subtext as string) || '';

  return (
    <section className="section-padding bg-white">
      <ScrollReveal>
        <div className="container-main max-w-3xl">
          <SectionHeading label={sectionLabel} subheading={subtext} centered className="mb-8">
            {heading}
          </SectionHeading>
          <div className="space-y-8">
            {cards.map((card, i) => (
              <div key={i} className="text-center sm:text-left">
                <h3 className="font-heading font-normal text-base text-[var(--color-heading)] mb-2">
                  {card.icon ? `${card.icon} ` : ''}{card.title}
                </h3>
                <p className="text-[15px] text-[var(--color-text)] leading-relaxed font-body">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
