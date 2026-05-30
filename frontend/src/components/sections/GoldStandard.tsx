'use client';

import Image from 'next/image';
import { Check } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useSection } from '@/hooks/useSection';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';

export default function GoldStandard() {
  const { content, isVisible } = useSection('goldStandard');
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const productImages = (product?.images as { url: string }[]) || [];

  if (!isVisible) return null;

  const bullets = (content.bullets as string[]) || [];
  const sideImage = (content.image as string) || productImages[1]?.url || productImages[0]?.url || '';
  const sectionLabel = (content.sectionLabel as string) || 'QUALITY STANDARD';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <SectionHeading label={sectionLabel} centered={false}>
                {(content.heading as string) || ''}
              </SectionHeading>
              {(content.paragraph as string) && (
                <p className="section-body-text mb-2 !max-w-none">{content.paragraph as string}</p>
              )}
              {(content.paragraph2 as string) && (
                <p className="section-body-text mb-2 !max-w-none">{content.paragraph2 as string}</p>
              )}
              {(content.bulletLabel as string) && (
                <p className="section-label mb-2">{content.bulletLabel as string}</p>
              )}
              {bullets.length > 0 && (
                <ul className="space-y-2 mb-2">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 section-body-text !max-w-none">
                      <Check size={14} strokeWidth={1.25} className="text-[var(--color-heading)] mt-1 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {(content.closing as string) && (
                <p className="section-body-text italic !max-w-none">{content.closing as string}</p>
              )}
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
