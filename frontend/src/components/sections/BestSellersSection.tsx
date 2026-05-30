'use client';

import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';
import { useSection } from '@/hooks/useSection';
import { useSettings } from '@/context/SettingsContext';

export default function BestSellersSection() {
  const { content, isVisible } = useSection('bestSellers');
  const { settings } = useSettings();
  const product = settings?.product as Record<string, unknown> | undefined;
  const packs = (settings?.packs || []) as { _id: string; label: string; price: number; originalPrice: number }[];
  const images = (product?.images as { url: string }[]) || [];

  if (!isVisible || !product) return null;

  const sectionLabel = (content.sectionLabel as string) || 'BEST SELLERS';
  const heading = (content.heading as string) || 'Our Top Pick';
  const subtext = (content.subtext as string) || '';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel} subheading={subtext}>
            {heading}
          </SectionHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {packs.slice(0, 3).map((pack) => (
              <Link
                key={pack._id}
                href="/#product"
                className="product-card-luxury p-6 flex flex-col items-center text-center group"
              >
                {images[0] && (
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={images[0].url}
                      alt={(product.name as string) || 'Product'}
                      fill
                      className="object-contain"
                      sizes="128px"
                      unoptimized={images[0].url.startsWith('http://localhost')}
                    />
                  </div>
                )}
                <h3 className="product-card-name mb-2 group-hover:opacity-80 transition-opacity">
                  {(product.name as string) || 'Product'}
                </h3>
                <p className="text-[11px] uppercase tracking-[1px] text-[var(--color-text-secondary)] mb-3 font-body">
                  {pack.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="product-card-price">₹{pack.price.toLocaleString('en-IN')}</span>
                  <span className="product-price-old text-sm">₹{pack.originalPrice.toLocaleString('en-IN')}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
