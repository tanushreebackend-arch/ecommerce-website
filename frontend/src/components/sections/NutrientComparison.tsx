'use client';

import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useSection } from '@/hooks/useSection';
import ScrollReveal from '@/components/ScrollReveal';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop';

interface NutrientCard {
  nutrient: string;
  claim: string;
  competitorLabel?: string;
  competitorImage?: string;
  benefits: string[];
}

function FoodImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-md ring-1 ring-[var(--color-card-border)]">
        <Image src={src} alt={label} fill className="object-cover" sizes="80px" quality={100} unoptimized={src.startsWith('http://localhost')} />
      </div>
      <span className="text-[10px] font-normal text-[var(--color-text-secondary)] uppercase tracking-wide font-body">{label}</span>
    </div>
  );
}

export default function NutrientComparison() {
  const { content, isVisible } = useSection('nutrientComparison');
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;

  if (!isVisible) return null;

  const productImage =
    (product?.comparisonImage as { url?: string })?.url ||
    (content.productImage as string) ||
    DEFAULT_PRODUCT_IMG;

  const cards = (content.cards as NutrientCard[]) || [];
  const sectionLabel = (content.sectionLabel as string) || 'NUTRITION COMPARISON';
  const heading = (content.heading as string) || '';
  const intro = (content.intro as string) || '';

  return (
    <section className="section-padding luxury-section-white luxury-texture">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel} subheading={intro}>
            {heading}
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, i) => {
              const competitorSrc = card.competitorImage || DEFAULT_PRODUCT_IMG;
              const competitorLabel = card.competitorLabel || 'Alternative';

              return (
                <AnimateOnScroll key={i} delay={i * 0.1}>
                <div className="comparison-card">
                  <div className="bg-[var(--button-color)] px-4 py-3">
                    <h3 className="font-heading text-base font-normal text-white">{card.nutrient}</h3>
                  </div>
                  <div className="comparison-card-body p-6 text-center">
                    <div className="flex items-center justify-center gap-5 mb-4">
                      <FoodImage src={productImage} label="Ours" />
                      <span className="font-heading font-normal text-sm text-[var(--color-text-secondary)] tracking-wider">VS</span>
                      <FoodImage src={competitorSrc} label={competitorLabel} />
                    </div>
                    <p className="font-body text-[11px] font-normal text-[var(--color-heading)] uppercase tracking-[2px] mb-4 leading-snug">
                      {card.claim}
                    </p>
                    <ul className="space-y-2 text-center">
                      {card.benefits.map((b, j) => (
                        <li key={j} className="text-sm font-body border-b border-[var(--color-card-border)] pb-2 last:border-0 text-[var(--color-text)]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
