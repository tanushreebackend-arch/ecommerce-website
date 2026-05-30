'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import { useCartStore } from '@/store/cartStore';

export default function StickyBar() {
  const { settings } = useSettings();
  const addItem = useCartStore((s) => s.addItem);
  const [visible, setVisible] = useState(false);

  const product = settings?.product as Record<string, unknown> | undefined;
  const packs = settings?.packs as unknown as { _id: string; label: string; price: number; originalPrice: number; savingsPercent?: number }[] | undefined;
  const images = (product?.images as { url: string }[]) || [];
  const currentPack = packs?.[0];

  useEffect(() => {
    const buttonsEl = (window as unknown as { productButtonsRef?: HTMLElement }).productButtonsRef;
    if (!buttonsEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(buttonsEl);
    return () => observer.disconnect();
  }, [product]);

  if (!product || !currentPack) return null;

  const handleAddToCart = () => {
    addItem({
      productId: (product._id as string) || 'product',
      packId: currentPack._id,
      name: (product.name as string) || 'Product',
      packLabel: currentPack.label,
      price: currentPack.price,
      originalPrice: currentPack.originalPrice,
      quantity: 1,
      image: images[0]?.url || '',
    });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      }`}
    >
      <div className={`sticky-bar-luxury border-t border-[var(--color-card-border)] ${visible ? 'slide-up-bar' : ''}`}>
        <div className="container-main py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {images[0] && (
              <div className="relative w-12 h-12 overflow-hidden shrink-0 border border-[var(--color-card-border)] bg-[var(--color-image-bg)]">
                <Image src={images[0].url} alt="" fill className="object-cover" sizes="48px" unoptimized={images[0].url.startsWith('http://localhost')} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-heading text-sm md:text-base truncate text-[var(--color-heading)]">{product.name as string}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span className="sticky-price">₹{currentPack.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[var(--color-text-secondary)] line-through font-body font-light">
                  ₹{currentPack.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button type="button" onClick={handleAddToCart} className="btn-primary py-3 px-5 text-[10px] hidden sm:inline-flex">
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => { handleAddToCart(); window.location.href = '/checkout'; }}
              className="btn-secondary py-3 px-5 text-[10px]"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
