'use client';

import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import FaqAccordion, { FaqItem } from '@/components/sections/FaqAccordion';

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: 'How does it work?',
    answer: 'Our formula delivers concentrated bioavailable nutrients directly to your cells. The advanced delivery system ensures rapid absorption within minutes of taking your daily dose.',
  },
  {
    question: 'What does it help with?',
    answer: 'It helps with low energy, weak immunity, brain fog, slow recovery, stress, and nutrient deficiencies. Most users notice improvements in energy and focus within the first few days.',
  },
  {
    question: 'When will I see results?',
    answer: 'Many users report feeling more energetic within the first few days. Significant improvements in immunity and mental clarity are typically noticed after 2-3 weeks of consistent use.',
  },
  {
    question: 'Who can use it?',
    answer: "It's designed for adults 18+ looking to optimize their health naturally. Busy professionals, athletes, and health-conscious individuals see the best results. Not recommended for pregnant or nursing women.",
  },
  {
    question: 'Is it safe? Any side effects?',
    answer: 'Yes, completely safe. Made from 100% natural ingredients with no artificial additives. Manufactured in GMP-certified facilities. No known side effects when taken as directed.',
  },
];

export function useFaqItems() {
  const { settings } = useSettings();
  const content = settings?.sections?.faq?.content as { heading?: string; items?: FaqItem[] } | undefined;
  return {
    heading: content?.heading || 'Frequently Asked Questions',
    items: content?.items?.length ? content.items : DEFAULT_FAQS,
  };
}

export default function FaqSection() {
  const { heading, items } = useFaqItems();

  return (
    <section className="section-padding bg-[#f7f8f5]">
      <ScrollReveal>
        <div className="container-main max-w-3xl">
          <h2 className="section-heading text-center mb-8">{heading}</h2>
          <FaqAccordion items={items} />
        </div>
      </ScrollReveal>
    </section>
  );
}

export { DEFAULT_FAQS };
