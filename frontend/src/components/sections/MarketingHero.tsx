'use client';

import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import { useSection } from '@/hooks/useSection';
import { useSettings } from '@/context/SettingsContext';

export default function MarketingHero() {
  const { content, isVisible } = useSection('heroSection');
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const images = (product?.images as { url: string }[]) || [];
  const rating = (product?.rating as number) || 4.8;

  if (!isVisible) return null;

  const headline = (content.headline as string) || "You're not tired, burned out, or lazy";
  const headline2 = (content.headline2 as string) || 'You need balance.';
  const subtext = (content.subtext as string) || '';
  const subtextSecondary = (content.subtextSecondary as string) || '';
  const buttonText = (content.buttonText as string) || 'Shop Now';
  const buttonHref = (content.buttonHref as string) || '/#product';
  const backgroundImage = (content.backgroundImage as string) || images[0]?.url || '';
  const ratingLabel = (content.ratingLabel as string) || `${rating} Stars from 400+ reviews`;

  return (
    <section className="section-padding luxury-section-white luxury-texture">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <AnimateOnScroll>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(rating) ? 'star-fill' : 'star-empty'} />
                  ))}
                </div>
                <span className="text-[11px] font-normal tracking-[0.2em] text-[var(--color-text-secondary)] uppercase font-body">
                  {ratingLabel}
                </span>
              </div>

              <h1 className="font-heading text-xl sm:text-[22px] md:text-[28px] font-normal leading-snug tracking-wide text-[var(--color-heading)] mb-4 uppercase">
                {headline}
              </h1>

              {headline2 && (
                <p className="font-heading text-xl sm:text-[22px] md:text-[28px] font-normal leading-snug tracking-wide text-[var(--color-heading)] mb-6 uppercase relative inline-block">
                  {headline2}
                  <span className="absolute left-0 -bottom-1 h-[2px] w-[40px] bg-[var(--accent-color)]" />
                </p>
              )}

              {subtext && (
                <p className="text-sm text-[var(--color-heading)] leading-[1.7] font-body mb-3 max-w-xl">{subtext}</p>
              )}
              {subtextSecondary && (
                <p className="text-sm text-[var(--color-text)] leading-[1.7] font-body mb-8 max-w-xl">{subtextSecondary}</p>
              )}

              <Link
                href={buttonHref}
                className="product-btn-primary inline-flex items-center gap-2 px-8 py-4 w-auto max-w-full"
              >
                {buttonText}
                <ChevronRight size={18} strokeWidth={3} />
              </Link>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
              <div className="relative aspect-square w-full max-w-[400px] lg:max-w-[460px]">
                {backgroundImage ? (
                  <Image
                    src={backgroundImage}
                    alt=""
                    fill
                    className="object-contain drop-shadow-xl"
                    priority
                    sizes="(max-width: 1024px) 90vw, 460px"
                    quality={100}
                    unoptimized={backgroundImage.startsWith('http://localhost')}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-secondary)] font-body text-sm border border-[var(--color-card-border)]">
                    Hero image
                  </div>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
