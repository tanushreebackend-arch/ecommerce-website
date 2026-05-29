'use client';

import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

const DEFAULT = {
  heading: 'Why Your Body Needs SAMe',
  paragraph:
    'Stress, aging, and poor diet can lower your natural SAMe levels — affecting mood, mental energy, and how your joints feel day to day.',
  stat1: { number: '80%', text: 'of adults report feeling stressed enough to affect daily mood and focus' },
  stat2: { number: '65%', text: 'experience occasional joint stiffness from daily activity or exercise' },
  closing:
    'Replenishing SAMe supports the biochemical pathways your brain and body rely on — for mood balance, mental clarity, and comfortable movement.*',
};

export default function StatsSection() {
  const { settings } = useSettings();
  const raw = settings?.sections?.statsSection?.content as Record<string, unknown> | undefined;
  const product = settings?.product as Record<string, unknown> | undefined;
  const productImages = (product?.images as { url: string }[]) || [];
  if (!raw) return null;

  const isLegacy = String(raw.paragraph || '').includes('Industrial farming') || String(raw.paragraph || '').includes('Bee Pearl') || String(raw.paragraph || '').includes('nutrient-dead soil') || String(raw.heading || '').includes('Modern Food');
  const content: Record<string, unknown> = isLegacy
    ? { ...DEFAULT, backgroundImage: raw.backgroundImage || productImages[2]?.url || productImages[0]?.url }
    : { ...DEFAULT, ...raw };

  const stat1 = content.stat1 as { number: string; text: string };
  const stat2 = content.stat2 as { number: string; text: string };
  const bgImage = (content.backgroundImage as string) || productImages[2]?.url || productImages[0]?.url;

  return (
    <section className="section-padding luxury-section-dark luxury-texture">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {bgImage && (
              <div className="relative min-h-[360px] lg:min-h-[520px] overflow-hidden luxury-card order-2 lg:order-1">
                <Image
                  src={bgImage}
                  alt="Wellness lifestyle"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 560px"
                  quality={100}
                  unoptimized={bgImage.startsWith('http://localhost')}
                />
              </div>
            )}
            <div className="order-1 lg:order-2 py-2">
              <SectionHeading label="THE SCIENCE" centered={false}>
                {content.heading as string}
              </SectionHeading>
              <div className="space-y-5 section-body-text !max-w-none">
                <p>{content.paragraph as string}</p>
                <p>
                  <strong className="font-heading font-semibold text-2xl md:text-3xl text-[var(--color-secondary)]">
                    {stat1?.number}
                  </strong>{' '}
                  {stat1?.text?.replace(/^\d+%\s*/, '') || stat1?.text}
                </p>
                <p>
                  <strong className="font-heading font-semibold text-2xl md:text-3xl text-[var(--color-secondary)]">
                    {stat2?.number}
                  </strong>{' '}
                  {stat2?.text?.replace(/^\d+%\s*/, '') || stat2?.text}
                </p>
                <p className="font-medium text-[var(--color-primary-foreground)]">{content.closing as string}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
