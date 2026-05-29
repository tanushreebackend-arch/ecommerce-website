'use client';

import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_PRODUCT_IMG = 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=80&h=80&fit=crop';

const COMPETITOR_LABELS: Record<string, string> = {
  'SAMe Potency': 'Standard 200 mg',
  Stabilization: 'Unstable SAMe',
  'Mood Support': 'Basic B-Complex',
  'Joint Comfort': 'OTC Pain Relievers',
  'Tablet Size': 'Large Enteric Tablets',
  Methylation: 'Folate Supplement',
  'Vitamin B Complex': 'Beef Liver',
  'Vitamin B12': 'Beef Liver',
  'Vitamin D': 'Milk',
  'Vitamin D3': 'Milk',
  Iron: 'Spinach',
  Magnesium: 'Kale',
  'Vitamin C': 'Oranges',
  'Amino Acids': 'Eggs',
  Zinc: 'Pumpkin Seeds',
  'Omega-3': 'Walnuts',
};

const DEFAULT_CARDS = [
  {
    nutrient: 'SAMe Potency',
    claim: '2X MORE SAMe per tablet than standard 200 mg formulas*',
    competitorLabel: 'Standard 200 mg SAMe',
    benefits: ['Maximum strength dosing', 'Fewer tablets daily', 'Better value per mg', 'Consistent potency'],
  },
  {
    nutrient: 'Stabilization',
    claim: 'Stabilized formula — no enteric coating needed*',
    competitorLabel: 'Unstable SAMe',
    benefits: ['Protected from degradation', 'Room-temperature stable', 'Easy to take anywhere', 'Reliable absorption'],
  },
  {
    nutrient: 'Mood Support',
    claim: 'Direct neurotransmitter support — not just B-vitamins*',
    competitorLabel: 'Basic B-Complex',
    benefits: ['Supports serotonin pathways', 'Emotional well-being', 'Mental clarity', 'Nervous system health'],
  },
  {
    nutrient: 'Joint Comfort',
    claim: 'Studied for joint function — natural approach*',
    competitorLabel: 'OTC Pain Relievers',
    benefits: ['Supports cartilage health', 'Everyday mobility', 'No stomach irritation*', 'Long-term wellness'],
  },
  {
    nutrient: 'Tablet Size',
    claim: 'Smaller tablet — easier to swallow daily*',
    competitorLabel: 'Large Enteric Tablets',
    benefits: ['Compact size', 'No coating needed', 'Better compliance', 'Comfortable daily use'],
  },
  {
    nutrient: 'Methylation',
    claim: 'Broad methylation support beyond folate alone*',
    competitorLabel: 'Folate Supplement',
    benefits: ['200+ biochemical reactions', 'Brain energy support', 'Cell membrane health', 'Whole-body balance'],
  },
];

const DEFAULT_COMPETITOR_IMAGES: Record<string, string> = {
  'Vitamin B Complex': 'https://images.unsplash.com/photo-1607623757155-030ed0615a88?w=80&h=80&fit=crop',
  'Vitamin B12': 'https://images.unsplash.com/photo-1607623757155-030ed0615a88?w=80&h=80&fit=crop',
  'Vitamin D': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop',
  'Vitamin D3': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=80&h=80&fit=crop',
  Iron: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&h=80&fit=crop',
  Magnesium: 'https://images.unsplash.com/photo-1606312619079-d48e4c5a9350?w=80&h=80&fit=crop',
  'Vitamin C': 'https://images.unsplash.com/photo-1547514704-5f1164e781a9?w=80&h=80&fit=crop',
  'Amino Acids': 'https://images.unsplash.com/photo-1587486913048-7a64a9340a64?w=80&h=80&fit=crop',
  Zinc: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=80&h=80&fit=crop',
  'Omega-3': 'https://images.unsplash.com/photo-1599599810769-4c4e0a4e2f0e?w=80&h=80&fit=crop',
};

function FoodImage({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20 rounded-full overflow-hidden border-[3px] border-white shadow-md ring-1 ring-gray-200">
        <Image src={src} alt={label} fill className="object-cover" sizes="80px" quality={100} unoptimized={src.startsWith('http://localhost')} />
      </div>
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide font-body">{label}</span>
    </div>
  );
}

export default function NutrientComparison() {
  const { settings } = useSettings();
  const content = settings?.sections?.nutrientComparison?.content as Record<string, unknown> | undefined;
  const product = settings?.product as Record<string, unknown> | undefined;
  if (!content) return null;

  const productImage =
    (product?.comparisonImage as { url?: string })?.url ||
    (content.productImage as string) ||
    DEFAULT_PRODUCT_IMG;

  const apiCards = (content.cards as typeof DEFAULT_CARDS) || [];
  const isLegacy =
    apiCards.some((c) => ['Vitamin B Complex', 'Vitamin D', 'Iron', 'Magnesium', 'Vitamin C', 'Omega-3'].includes(c.nutrient)) ||
    String(content.heading || '').includes('Bee Pearl');
  const cards = isLegacy || apiCards.length < 6 ? DEFAULT_CARDS : apiCards;
  const heading = isLegacy ? 'Why NOW Foods SAMe 400 mg Stands Out' : (content.heading as string) || 'Why NOW Foods SAMe 400 mg Stands Out';
  const intro = isLegacy
    ? 'Here\'s why NOW Foods SAMe 400 mg stands out — stabilized, maximum-strength SAMe your body actually uses.*'
    : (content.intro as string) ||
      'Here\'s why NOW Foods SAMe 400 mg stands out — stabilized, maximum-strength SAMe your body actually uses.*';

  return (
    <section className="section-padding luxury-section-cream luxury-texture">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label="NUTRITION COMPARISON" subheading={intro}>
            {heading}
          </SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cards.map((card, i) => {
              const competitorSrc = (card as { competitorImage?: string }).competitorImage || DEFAULT_COMPETITOR_IMAGES[card.nutrient] || DEFAULT_PRODUCT_IMG;
              const competitorLabel = card.competitorLabel || COMPETITOR_LABELS[card.nutrient] || 'Food';

              return (
                <div key={i} className="luxury-card overflow-hidden">
                  <div className="bg-[var(--color-primary)] px-4 py-3">
                    <h3 className="font-heading text-lg text-[var(--color-primary-foreground)]">{card.nutrient}</h3>
                  </div>
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center gap-5 mb-4">
                      <FoodImage src={productImage} label="Ours" />
                      <span className="font-heading font-bold text-gray-400 text-base tracking-wider">VS</span>
                      <FoodImage src={competitorSrc} label={competitorLabel} />
                    </div>
                    <p className="font-body text-[11px] font-medium text-[var(--color-secondary)] uppercase tracking-[3px] mb-4 leading-snug">
                      {card.claim}
                    </p>
                    <ul className="space-y-2 text-center">
                      {card.benefits.map((b, j) => (
                        <li key={j} className="text-sm font-body border-b border-gray-50 pb-2 last:border-0" style={{ color: 'var(--color-text)' }}>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
