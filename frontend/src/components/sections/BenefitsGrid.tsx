'use client';

import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_CARDS = [
  {
    icon: '😊',
    title: 'Mood & Emotional Balance',
    description:
      'SAMe supports the synthesis of serotonin and dopamine — helping you feel more balanced, calm, and emotionally steady throughout the day.*',
  },
  {
    icon: '🧠',
    title: 'Nervous System Support',
    description:
      'Helps maintain healthy neurotransmitter levels for mental clarity, focus, and overall nervous system wellness — without stimulants.*',
  },
  {
    icon: '🦴',
    title: 'Joint Comfort & Mobility',
    description:
      'Clinical studies suggest SAMe may help alleviate minor aches from everyday strain or overexertion, supporting comfortable daily movement.*',
  },
  {
    icon: '⚡',
    title: 'Mental Clarity & Focus',
    description:
      'By supporting methylation and brain chemistry, SAMe helps clear mental fog and sustain sharper focus during busy days.*',
  },
  {
    icon: '💪',
    title: 'Whole-Body Wellness',
    description:
      'SAMe participates in over 200 biochemical reactions — supporting cellular energy, membrane health, and your body\'s natural balance.*',
  },
];

export default function BenefitsGrid() {
  const { settings } = useSettings();
  const raw = settings?.sections?.benefitsGrid?.content as Record<string, unknown> | undefined;
  if (!raw) return null;

  const apiCards = (raw.cards as typeof DEFAULT_CARDS) || [];
  const isLegacy =
    String(raw.heading || '').includes('Bee Pearl') ||
    apiCards.some((c) => c.title?.includes('Low Energy') || c.title?.includes('Weak Immunity') || c.title?.includes('Muscle Weakness'));
  const cards = isLegacy || apiCards.length !== 5 ? DEFAULT_CARDS : apiCards;
  const heading = isLegacy ? 'What NOW Foods SAMe Helps With' : (raw.heading as string) || 'What NOW Foods SAMe Helps With';

  return (
    <section className="section-padding bg-white">
      <ScrollReveal>
        <div className="container-main max-w-3xl">
          <SectionHeading centered className="mb-8">{heading}</SectionHeading>
          <div className="space-y-8">
            {cards.map((card, i) => (
              <div key={i} className="text-center sm:text-left">
                <h3 className="font-heading font-bold text-lg md:text-xl text-gray-900 mb-2">
                  {card.icon} {card.title}
                </h3>
                <p className="text-[15px] text-gray-700 leading-relaxed font-body">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
