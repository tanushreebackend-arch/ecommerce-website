'use client';

import Image from 'next/image';
import { Sparkles, Leaf, Zap, Heart } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const BULLET_ICONS = [Sparkles, Leaf, Zap, Heart];

const DEFAULT = {
  heading: 'How Does SAMe Work?',
  subheading: 'The Science Behind S-Adenosyl-L-Methionine',
  body: 'SAMe (S-Adenosyl-L-Methionine) is a compound your body produces naturally — but stress, aging, and lifestyle can deplete your levels over time.',
  bodySecondary:
    'Unlike a basic multivitamin, NOW Foods SAMe 400 mg delivers stabilized SAMe that supports methylation — the biochemical process behind mood, brain chemistry, and joint comfort.*',
  bullets: [
    '**Mood & Emotional Well-Being** — supports serotonin and dopamine pathways*',
    '**Nervous System Support** — helps maintain healthy neurotransmitter balance*',
    '**Joint Comfort** — studied for relief from everyday strain and overexertion*',
    '**400 mg Strength** — maximum potency in a compact, easy-to-swallow tablet*',
  ],
  closingText:
    'Take one tablet daily on an empty stomach. Most people notice benefits within 2 weeks of consistent use.*',
  image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&fit=crop',
};

export default function HowItWorks() {
  const { settings } = useSettings();
  const raw = settings?.sections?.howItWorks?.content as Record<string, unknown> | undefined;
  if (!raw) return null;

  const isLegacy =
    String(raw.body || '').includes('nutrient gap') ||
    String(raw.bodySecondary || '').includes('Bee Pearl') ||
    String(raw.bodySecondary || '').includes('Bee Bread') ||
    String(raw.subheading || '').includes('Premium Wellness');
  const content = isLegacy
    ? { ...DEFAULT, image: (raw.image as string) || DEFAULT.image }
    : { ...DEFAULT, ...raw };
  const bullets = (content.bullets as string[]) || DEFAULT.bullets;

  return (
    <section className="section-padding section-alt">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col justify-center py-2">
              <SectionHeading subheading={content.subheading as string}>{content.heading as string}</SectionHeading>
              <p className="text-[15px] text-[#555555] leading-relaxed mb-4 font-body -mt-4">{content.body as string}</p>
              {Boolean(content.bodySecondary) && (
                <p className="text-[15px] text-[#555555] leading-relaxed mb-5 font-body">{content.bodySecondary as string}</p>
              )}
              <ul className="space-y-4 mb-5">
                {bullets.map((b, i) => {
                  const Icon = BULLET_ICONS[i % BULLET_ICONS.length];
                  return (
                    <li key={i} className="flex items-start gap-3 text-[15px] text-[#555555] font-body">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--color-card-border)] bg-white">
                        <Icon size={16} className="text-brand" />
                      </span>
                      <span className="pt-1" dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  );
                })}
              </ul>
              {content.closingText && (
                <p className="text-[15px] text-[#555555] leading-relaxed font-body">{content.closingText as string}</p>
              )}
            </div>
            {Boolean(content.image) && (
              <div className="relative min-h-[360px] lg:min-h-[520px] rounded-2xl overflow-hidden shadow-md border border-[var(--color-card-border)]">
                <Image src={content.image as string} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 560px" quality={100} />
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
