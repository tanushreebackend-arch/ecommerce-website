'use client';

import Link from 'next/link';
import { useSettings } from '@/context/SettingsContext';
import PaymentIcons from '@/components/PaymentIcons';
import { BRAND_PATH } from '@/lib/routes';

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3l1-4h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.7l-4.7-6.1L6.6 22H2.5l7.3-8.4L1 2h6.9l4.2 5.5L18.9 2zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: 'Shop', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Digital Products', href: '/digital-products' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Your Order', href: '/track-order' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Twitter', href: 'https://twitter.com', Icon: XIcon },
];

export default function Footer() {
  const { settings } = useSettings();
  const footer = settings?.sections?.footer?.content as Record<string, string> | undefined;
  const product = settings?.product as Record<string, unknown> | undefined;
  const brandName = ((product?.brandName as string) || 'NOW FOODS').toUpperCase();

  const tagline =
    footer?.tagline ||
    "Premium daily wellness supplements crafted with nature's finest ingredients for energy, immunity, and vitality.";

  return (
    <footer className="footer-premium">
      <div className="container-main footer-premium-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {/* Brand */}
          <div>
            <Link href={BRAND_PATH} className="footer-brand-name">
              {brandName}
            </Link>
            <p className="footer-tagline">{tagline}</p>
            <div className="footer-social">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-link"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-heading">Quick Links</h4>
            <span className="footer-heading-line" aria-hidden />
            <ul className="footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="footer-col-heading">Newsletter</h4>
            <span className="footer-heading-line" aria-hidden />
            <p className="footer-newsletter-text">
              {footer?.newsletterText || 'Exclusive offers and wellness insights delivered to your inbox.'}
            </p>
            <form
              className="footer-newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder={footer?.newsletterPlaceholder || 'Your email address'}
                className="footer-newsletter-input"
                aria-label="Email address"
              />
              <button type="submit" className="footer-subscribe-btn">
                {footer?.newsletterButton || 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-premium-bottom">
        <div className="container-main footer-premium-bottom-inner">
          <p className="footer-copyright">
            {footer?.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}
          </p>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}
