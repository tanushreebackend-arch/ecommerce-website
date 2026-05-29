'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ChevronRight } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function MarketingHero() {
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const images = (product?.images as { url: string }[]) || [];
  const brandName = String(product?.brandName || 'NOW FOODS').toUpperCase();
  const productName = (product?.name as string) || 'NOW FOODS SAMe 400 mg';
  const productShort = productName.split('—')[0]?.trim() || 'SAMe 400 mg';
  const productLabel = productShort.replace(/^NOW FOODS\s/i, '').trim() || 'SAMe 400 mg';
  const rating = (product?.rating as number) || 4.8;
  const heroImage = images[0]?.url;

  return (
    <section className="section-padding luxury-section-cream luxury-texture pt-10 md:pt-14 pb-16 md:pb-20">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(rating) ? 'star-gold' : 'text-[var(--color-card-border)]'}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-gray-700 uppercase font-body">
                {rating} Stars from 400+ reviews
              </span>
            </div>

            <h1 className="font-heading text-[1.75rem] sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-bold leading-[1.12] tracking-wide text-gray-900 mb-4 uppercase">
              You&apos;re not tired, burned out, or lazy
            </h1>

            <p className="font-heading text-[1.75rem] sm:text-4xl md:text-[2.65rem] lg:text-[2.85rem] font-bold leading-[1.12] tracking-wide text-gray-900 mb-6 uppercase relative inline-block">
              You need balance.
              <span
                className="absolute left-0 -bottom-1 h-[5px] w-full rounded-sm"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            </p>

            <p className="text-[15px] md:text-base text-gray-900 leading-relaxed font-body mb-3 max-w-xl">
              <strong>{brandName} restores what your body has been missing.</strong>
            </p>
            <p className="text-[15px] md:text-base text-gray-700 leading-relaxed font-body mb-8 max-w-xl">
              With stabilized S-Adenosyl-L-Methionine, {brandName} {productLabel} supports mood, nervous system health,
              and joint comfort — your shortcut to emotional balance, mental clarity, and comfortable movement in 30 days.*
            </p>

            <Link
              href="/#product"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-sm md:text-[15px] rounded-full shadow-md hover:scale-[1.02] transition-transform uppercase tracking-wide"
            >
              Try {brandName} {productLabel.split(' ')[0]}
              <ChevronRight size={18} strokeWidth={3} />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[400px] lg:max-w-[460px]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={productShort}
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                  sizes="(max-width: 1024px) 90vw, 460px"
                  quality={100}
                  unoptimized={heroImage.startsWith('http://localhost')}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-[#f5f5f0] text-gray-400 font-body text-sm border border-[var(--color-card-border)]">
                  Product image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
