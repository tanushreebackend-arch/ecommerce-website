'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import PaymentIcons from '@/components/PaymentIcons';
import { BRAND_PATH } from '@/lib/routes';

export default function Footer() {
  const { settings } = useSettings();
  const footer = settings?.sections?.footer?.content as Record<string, string> | undefined;
  const product = settings?.product as Record<string, unknown> | undefined;
  const brandName = ((product?.brandName as string) || 'NOW FOODS').toUpperCase();

  const links = [
    { label: 'Shop', href: '/' },
    { label: 'Track Your Order', href: '/track-order' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="relative mt-0">
      <div style={{ overflow: 'hidden', lineHeight: 0, marginBottom: '-2px' }}>
        <svg
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          style={{ display: 'block', width: '200%', height: '60px' }}
          aria-hidden
        >
          <defs>
            <path id="wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
          </defs>
          <g className="wave-parallax">
            <use href="#wave" x="48" y="0" fill="rgba(201,168,76,0.7)" />
            <use href="#wave" x="48" y="3" fill="rgba(201,168,76,0.5)" />
            <use href="#wave" x="48" y="5" fill="rgba(201,168,76,0.3)" />
            <use href="#wave" x="48" y="7" fill="#c9a84c" />
          </g>
        </svg>
      </div>

      <div className="footer-luxury pt-14 pb-10">
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
            <div>
              <Link href={BRAND_PATH} className="font-heading text-3xl font-light mb-4 inline-block tracking-wide text-[var(--color-primary-foreground)]">
                {brandName}
              </Link>
              <p className="text-sm leading-[1.8] font-body font-light opacity-85 max-w-xs">
                Premium daily wellness supplements crafted with nature&apos;s finest ingredients for energy, immunity, and vitality.
              </p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm font-body font-light">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4>Newsletter</h4>
              <p className="text-sm font-body font-light opacity-85 mb-4">Exclusive offers and wellness insights.</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                <input
                  type="email"
                  placeholder={footer?.newsletterPlaceholder || 'Your email address'}
                  className="input-luxury flex-1 bg-transparent text-[var(--color-primary-foreground)] placeholder:opacity-50 border-b border-[var(--color-primary-foreground)]/40 focus:border-[var(--color-secondary)]"
                />
                <button className="btn-secondary shrink-0 py-3 px-6 text-[11px]">
                  {footer?.newsletterButton || 'Subscribe'}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <PaymentIcons className="payment-muted [&>div]:border-white/20 [&>div]:bg-white/5" />
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar py-4">
        <div className="container-main text-center">
          <p className="text-[11px] font-body font-light opacity-60 tracking-wide">
            {footer?.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
