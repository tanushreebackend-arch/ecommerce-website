'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

const DEFAULT = {
  heading: 'The NOW Foods Quality Standard',
  paragraph:
    'Since 1968, NOW Foods has been a leader in natural supplements — manufactured in GMP-certified facilities with rigorous quality testing.',
  paragraph2:
    'Every batch of SAMe 400 mg is stabilized for potency and delivered in a convenient maximum-strength dose your body can use.*',
  bullets: [
    'Stabilized SAMe for reliable potency and absorption.*',
    'Supports neurotransmitter synthesis for mood and mental clarity.*',
    'Helps maintain joint comfort from everyday strain.*',
  ],
  closing:
    'Feel balanced from the inside out. Support your mood, mind, and movement with clinically studied SAMe — from a brand you can trust.',
};

export default function GoldStandard() {
  const { settings } = useSettings();
  const raw = settings?.sections?.goldStandard?.content as Record<string, unknown> | undefined;
  const product = settings?.product as Record<string, unknown> | undefined;
  const productImages = (product?.images as { url: string }[]) || [];
  if (!raw) return null;

  const isLegacy = String(raw.paragraph || '').includes('purest ingredients from trusted suppliers') || String(raw.paragraph || '').includes('Bee Bread');
  const content: Record<string, unknown> = isLegacy
    ? { ...DEFAULT, image: raw.image || productImages[1]?.url || productImages[0]?.url }
    : { ...DEFAULT, ...raw };
  const bullets = (content.bullets as string[]) || DEFAULT.bullets;
  const sideImage = (content.image as string) || productImages[1]?.url || productImages[0]?.url;

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <SectionHeading label="QUALITY STANDARD" centered={false}>
                {content.heading as string}
              </SectionHeading>
              <p className="section-body-text mb-4 !max-w-none">{content.paragraph as string}</p>
              {(content.paragraph2 as string) && (
                <p className="section-body-text mb-5 !max-w-none">{content.paragraph2 as string}</p>
              )}
              <p className="text-[11px] font-body uppercase tracking-[3px] text-[var(--color-secondary)] mb-3">These nutrients</p>
              <ul className="space-y-3 mb-5">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 section-body-text !max-w-none">
                    <Check size={14} strokeWidth={1.25} className="text-[var(--color-secondary)] mt-1 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="section-body-text italic !max-w-none">
                {(content.closing as string) || DEFAULT.closing}
              </p>
            </div>
            {sideImage && (
              <div className="relative aspect-square overflow-hidden luxury-card">
                <Image
                  src={sideImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 560px"
                  quality={100}
                  unoptimized={sideImage.startsWith('http://localhost')}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
