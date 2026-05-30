'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { BRAND_PATH } from '@/lib/routes';

const DEFAULT_NAV_LINKS = [
  { label: 'Shop', href: '/' },
  { label: 'Blog', href: '/blog' },
  { label: 'Digital Products', href: '/digital-products' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Your Order', href: '/track-order' },
];

function resolveNavLinks(links?: { label: string; href: string }[]) {
  if (!links?.length) return DEFAULT_NAV_LINKS;

  const result = [...links];

  const injectLink = (link: { label: string; href: string }, afterHref: string | null, beforeHref: string | null) => {
    const exists = result.some(
      (l) => l.href === link.href || l.label.toLowerCase() === link.label.toLowerCase()
    );
    if (exists) return;

    if (afterHref) {
      const idx = result.findIndex((l) => l.href === afterHref || l.label.toLowerCase() === afterHref.replace('/', ''));
      if (idx >= 0) {
        result.splice(idx + 1, 0, link);
        return;
      }
    }
    if (beforeHref) {
      const idx = result.findIndex((l) => l.href === beforeHref || l.label.toLowerCase() === beforeHref.replace('/', ''));
      if (idx >= 0) {
        result.splice(idx, 0, link);
        return;
      }
    }
    result.push(link);
  };

  injectLink({ label: 'Blog', href: '/blog' }, '/', '/contact');
  injectLink({ label: 'Digital Products', href: '/digital-products' }, '/blog', '/contact');

  return result;
}

export default function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { getItemCount, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setItemCount(getItemCount());
    const unsub = useCartStore.subscribe((s) => setItemCount(s.items.reduce((sum, i) => sum + i.quantity, 0)));
    return unsub;
  }, [getItemCount]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const product = settings?.product as Record<string, unknown> | undefined;
  const navbarContent = settings?.sections?.navbar?.content as { logoUrl?: string; brandName?: string; links?: { label: string; href: string }[] } | undefined;
  const brandName = (navbarContent?.brandName || (product?.brandName as string) || 'NOW FOODS').toUpperCase();
  const navLinks = resolveNavLinks(navbarContent?.links);

  const isActive = (href: string, label: string) => {
    const path = label.toLowerCase() === 'shop' && href === '/shop' ? '/' : href;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const resolveHref = (link: { label: string; href: string }) =>
    link.label.toLowerCase() === 'shop' && link.href === '/shop' ? '/' : link.href;

  return (
    <>
      <nav className="nav-luxury sticky top-0 z-40 w-full">
        <div className="container-main flex items-center justify-between h-[60px]">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              className="nav-icon-btn md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            <Link href={BRAND_PATH} className="logo-luxury shrink-0">
              {brandName}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const href = resolveHref(link);
              const active = isActive(link.href, link.label);
              return (
                <Link
                  key={link.href + link.label}
                  href={href}
                  className={`nav-link-luxury ${active ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            <button type="button" className="nav-icon-btn" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <Link href="/login" className="nav-icon-btn" aria-label="Account">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button type="button" onClick={openCart} className="nav-icon-btn relative" aria-label="Cart">
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="nav-cart-badge font-body">{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-nav-overlay md:hidden">
          <div className="flex items-center justify-end h-[60px] px-4">
            <button
              type="button"
              className="nav-icon-btn p-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-col pt-4">
            {navLinks.map((link) => {
              const href = resolveHref(link);
              const active = isActive(link.href, link.label);
              return (
                <Link
                  key={link.href + link.label}
                  href={href}
                  className={`mobile-nav-link ${active ? 'active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
