'use client';

import Link from 'next/link';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import ScrollReveal from '@/components/ScrollReveal';
import { useSection } from '@/hooks/useSection';

export default function CtaBanner() {
  const { content, isVisible } = useSection('ctaBanner');

  if (!isVisible) return null;

  const headline = (content.headline as string) || 'Ready to feel the difference?';
  const subtext = (content.subtext as string) || 'Join thousands who trust NOW Foods SAMe for daily mood and wellness support.*';
  const buttonText = (content.buttonText as string) || 'Shop Now';
  const buttonHref = (content.buttonHref as string) || '/#product';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <AnimateOnScroll>
            <div
              className="luxury-card p-10 md:p-14 text-center border border-[var(--color-card-border)]"
              style={
                content.backgroundImage
                  ? {
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${content.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              <h2
                className={`font-heading text-2xl md:text-3xl font-normal mb-4 tracking-wide ${
                  content.backgroundImage ? 'text-white' : 'text-[var(--color-heading)]'
                }`}
              >
                {headline}
              </h2>
              {subtext && (
                <p
                  className={`font-body text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed ${
                    content.backgroundImage ? 'text-white/90' : 'text-[var(--color-text)]'
                  }`}
                >
                  {subtext}
                </p>
              )}
              <Link href={buttonHref} className="product-btn-primary inline-flex w-auto max-w-full px-12">
                {buttonText}
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </ScrollReveal>
    </section>
  );
}
