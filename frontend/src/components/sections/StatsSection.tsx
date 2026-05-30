'use client';

import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useSection } from '@/hooks/useSection';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

export default function StatsSection() {
  const { content, isVisible } = useSection('statsSection');
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const productImages = (product?.images as { url: string }[]) || [];

  if (!isVisible) return null;

  const stat1 = (content.stat1 as { number: string; text: string }) || { number: '', text: '' };
  const stat2 = (content.stat2 as { number: string; text: string }) || { number: '', text: '' };
  const bgImage =
    (content.backgroundImage as string) || productImages[2]?.url || productImages[0]?.url || '';
  const sectionLabel = (content.sectionLabel as string) || 'THE SCIENCE';

  return (
    <section className="section-padding luxury-section-white luxury-texture">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {bgImage && (
              <div className="relative min-h-[280px] lg:min-h-[400px] overflow-hidden luxury-card order-2 lg:order-1">
                <Image
                  src={bgImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 560px"
                  quality={100}
                  unoptimized={bgImage.startsWith('http://localhost')}
                />
              </div>
            )}
            <div className="order-1 lg:order-2 py-2">
              <SectionHeading label={sectionLabel} centered={false}>
                {(content.heading as string) || ''}
              </SectionHeading>
              <div className="space-y-2 section-body-text !max-w-none">
                {(content.paragraph as string) && <p>{content.paragraph as string}</p>}
                {stat1?.number && (
                  <p>
                    <strong className="font-heading font-medium text-xl md:text-2xl text-[var(--color-heading)]">
                      {stat1.number}
                    </strong>{' '}
                    {stat1.text?.replace(/^\d+%\s*/, '') || stat1.text}
                  </p>
                )}
                {stat2?.number && (
                  <p>
                    <strong className="font-heading font-medium text-xl md:text-2xl text-[var(--color-heading)]">
                      {stat2.number}
                    </strong>{' '}
                    {stat2.text?.replace(/^\d+%\s*/, '') || stat2.text}
                  </p>
                )}
                {(content.closing as string) && (
                  <p className="font-medium text-[var(--color-heading)]">{content.closing as string}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
