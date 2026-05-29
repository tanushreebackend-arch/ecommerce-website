'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, User, ShoppingBag } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';
import { BRAND_PATH } from '@/lib/routes';

export default function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { getItemCount, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(getItemCount());
    const unsub = useCartStore.subscribe((s) => setItemCount(s.items.reduce((sum, i) => sum + i.quantity, 0)));
    return unsub;
  }, [getItemCount]);

  const product = settings?.product as Record<string, unknown> | undefined;
  const navbarContent = settings?.sections?.navbar?.content as { logoUrl?: string; brandName?: string; links?: { label: string; href: string }[] } | undefined;
  const logoUrl = navbarContent?.logoUrl || (product?.logo as { url?: string })?.url;
  const brandName = (navbarContent?.brandName || (product?.brandName as string) || 'NOW FOODS').toUpperCase();
  const navLinks = navbarContent?.links || [
    { label: 'Shop', href: '/' },
    { label: 'Contact', href: '/contact' },
    { label: 'Track Your Order', href: '/track-order' },
  ];

  const isActive = (href: string, label: string) => {
    const path = label.toLowerCase() === 'shop' && href === '/shop' ? '/' : href;
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="nav-luxury sticky top-0 z-40 w-full">
      <div className="container-main flex items-center justify-between h-16 md:h-[76px]">
        <Link href={BRAND_PATH} className="flex items-center gap-3">
          {logoUrl ? (
            <Image src={logoUrl} alt={brandName} width={40} height={40} className="object-cover rounded-sm" quality={100} />
          ) : (
            <div className="w-10 h-10 rounded-sm bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-foreground)] font-heading text-lg">
              {brandName.charAt(0)}
            </div>
          )}
          <span className="logo-luxury hidden sm:block">{brandName}</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const href = link.label.toLowerCase() === 'shop' && link.href === '/shop' ? '/' : link.href;
            const active = isActive(link.href, link.label);
            return (
              <Link
                key={link.href + link.label}
                href={href}
                className={`nav-link-luxury ${active ? 'text-[var(--color-primary)]' : ''}`}
                style={active ? { borderBottom: '2px solid var(--color-secondary)' } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <button className="p-2.5 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors" aria-label="Search">
            <Search size={20} strokeWidth={1.25} />
          </button>
          <Link href="/login" className="p-2.5 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors" aria-label="Account">
            <User size={20} strokeWidth={1.25} />
          </Link>
          <button
            onClick={openCart}
            className="p-2.5 text-[var(--color-text)] hover:text-[var(--color-secondary)] transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag size={20} strokeWidth={1.25} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-sm text-[9px] text-[var(--color-text)] flex items-center justify-center font-body font-medium bg-[var(--color-secondary)]">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
