'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Check, Minus, Plus, Truck } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCartStore } from '@/store/cartStore';
import PaymentIcons from '@/components/PaymentIcons';
import ProductImageZoom from '@/components/product/ProductImageZoom';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import FaqAccordion from '@/components/sections/FaqAccordion';
import { useFaqItems } from '@/components/sections/FaqSection';
import { getFreeShippingThreshold } from '@/lib/shipping';

interface Pack {
  _id: string;
  label: string;
  description?: string;
  price: number;
  originalPrice: number;
  savingsPercent: number;
  badge?: string;
}

const DEFAULT_PARA1 =
  'NOW Foods SAMe 400 mg delivers stabilized S-Adenosyl-L-Methionine — a compound your body naturally produces that supports neurotransmitter balance and emotional well-being.*';
const DEFAULT_PARA2 =
  'Take one tablet daily on an empty stomach to support mood, nervous system health, and joint comfort from everyday strain — backed by decades of SAMe research.*';
const DEFAULT_BENEFITS = [
  'Supports emotional well-being & mood balance*',
  'Nervous system & neurotransmitter support*',
  'Helps joint comfort from overexertion*',
  'Stabilized 400 mg — smaller, easy-to-swallow tablet',
];

function boldKeywords(text: string) {
  const keywords = ['SAMe', 'mood', 'joint', 'wellness', 'neurotransmitter', 'methylation', 'balance', 'focus', 'comfort'];
  let result = text;
  keywords.forEach((kw) => {
    const re = new RegExp(`\\b(${kw})\\b`, 'gi');
    result = result.replace(re, '<strong>$1</strong>');
  });
  return result;
}

export default function ProductHero() {
  const { settings } = useSettings();
  const addItem = useCartStore((s) => s.addItem);
  const product = settings?.product as Record<string, unknown> | undefined;
  const packs = (settings?.packs || []) as unknown as Pack[];
  const images = (product?.images as { url: string }[]) || [];
  const benefits = (product?.benefits as string[]) || [];
  const freeShippingThreshold = getFreeShippingThreshold(settings);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedPack, setSelectedPack] = useState<string>(packs[0]?._id || '');
  const [quantity, setQuantity] = useState(1);
  const [subscribeRefills, setSubscribeRefills] = useState(false);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const { items: faqItems } = useFaqItems();

  const currentPack = packs.find((p) => p._id === selectedPack) || packs[0];
  const displayPrice = currentPack?.price || (product?.salePrice as number) || 999;
  const originalPrice = (currentPack?.originalPrice || product?.mrp) as number;
  const rating = (product?.rating as number) || 4.7;
  const description = (product?.description as string) || '';
  const isLegacyDesc = !description || description.includes('revolutionary daily supplement') || description.includes('Bee Pearl');
  const para1 = isLegacyDesc ? DEFAULT_PARA1 : (description.split(/(?<=\.)\s+/).filter(Boolean)[0] || description);
  const para2 = isLegacyDesc
    ? DEFAULT_PARA2
    : description.split(/(?<=\.)\s+/).filter(Boolean).slice(1).join(' ') || DEFAULT_PARA2;
  const displayBenefits =
    benefits.length >= 4 && !String(benefits[0]).includes('Boosts natural') ? benefits : DEFAULT_BENEFITS;

  const handleAddToCart = () => {
    if (!currentPack || !product) return;
    addItem({
      productId: (product._id as string) || 'product',
      packId: currentPack._id,
      name: (product.name as string) || 'Product',
      packLabel: currentPack.label,
      price: currentPack.price,
      originalPrice: currentPack.originalPrice,
      quantity,
      image: images[0]?.url || '',
    });
  };

  useEffect(() => {
    if (buttonsRef.current) {
      (window as unknown as { productButtonsRef: HTMLElement }).productButtonsRef = buttonsRef.current;
    }
  }, []);

  useEffect(() => {
    if (packs[0]?._id && !selectedPack) setSelectedPack(packs[0]._id);
  }, [packs, selectedPack]);

  if (!product) return null;

  return (
    <section id="product" className="section-padding hero-luxury">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start overflow-visible">
          <AnimateOnScroll className="lg:sticky lg:top-24 lg:self-start overflow-visible">
            {images[selectedImage] && (
              <ProductImageZoom
                src={images[selectedImage].url}
                alt={(product.name as string) || 'Product'}
                priority
                unoptimized={images[selectedImage].url.startsWith('http://localhost')}
              />
            )}
            <div className="flex gap-3 overflow-x-auto pb-1 mt-4">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-[72px] h-[72px] shrink-0 overflow-hidden thumb-luxury ${selectedImage === i ? 'active' : ''}`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" sizes="72px" quality={100} unoptimized={img.url.startsWith('http://localhost')} />
                </button>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.1} className="flex flex-col font-body">
            <div className="product-decor-line" aria-hidden />
            <h1 className="product-title mb-3">{product.name as string}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} strokeWidth={1} className={i < Math.floor(rating) ? 'star-fill' : 'star-empty'} />
                ))}
              </div>
              <span className="text-sm font-body font-light text-[#0A0A0A]">{rating}/5</span>
              <span className="text-[#E8E8E8]">|</span>
              <button className="text-sm font-body font-light text-[#0A0A0A] hover:opacity-70 transition-opacity">
                127 reviews
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {['30 Capsules', '870mg per serving'].map((badge) => (
                <span key={badge} className="variant-tag">
                  {badge}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
              <span className="product-price">₹{displayPrice.toLocaleString('en-IN')}</span>
              <span className="product-price-old font-body">
                ₹{originalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="product-tax-note mb-4 font-body tracking-wide">Inclusive of all taxes</p>

            {(product.stock as number) <= 50 && (
              <span className="stock-badge mb-4">
                Only {product.stock as number} left in stock
              </span>
            )}

            <div className="space-y-2 mb-4 product-description">
              <p dangerouslySetInnerHTML={{ __html: boldKeywords(para1) }} />
              <p dangerouslySetInnerHTML={{ __html: boldKeywords(para2) }} />
            </div>

            <ul className="space-y-2 mb-4 max-w-[680px]">
              {displayBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-body font-light text-[#555555] leading-[1.8]">
                  <Check size={14} strokeWidth={1.25} className="text-[#0A0A0A] mt-1 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="divider-with-text">
              <span className="text-[11px] font-body uppercase tracking-[1.5px] text-[var(--color-text-secondary)] shrink-0">
                Choose Your Pack
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {packs.map((pack, i) => {
                const selected = selectedPack === pack._id;
                const qualifiesFreeShip = pack.price >= freeShippingThreshold;
                return (
                  <AnimateOnScroll key={pack._id} delay={i * 0.1}>
                  <div>
                    <label className={`pack-card flex items-center justify-between p-5 cursor-pointer ${selected ? 'selected' : ''}`}>
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <input type="radio" name="pack" checked={selected} onChange={() => setSelectedPack(pack._id)} className="mt-1 accent-[var(--color-heading)] shrink-0" />
                        <div className="min-w-0">
                          <p className="font-heading text-base font-normal text-[var(--color-heading)]">{pack.label}</p>
                          {pack.description && <p className="text-xs text-[var(--color-text)] mt-1 font-body font-light">{pack.description}</p>}
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="savings-badge">Save {pack.savingsPercent}%</span>
                            {pack.badge && <span className="text-[11px] font-body uppercase tracking-wider text-[var(--color-text)]">{pack.badge}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="font-heading text-base font-medium">₹{pack.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs product-price-old font-body font-light">₹{pack.originalPrice.toLocaleString('en-IN')}</p>
                      </div>
                    </label>
                    {qualifiesFreeShip && selected && (
                      <p className="mt-2 text-[11px] font-body uppercase tracking-[2px] text-[var(--color-text)] text-center">+ Free Shipping</p>
                    )}
                  </div>
                  </AnimateOnScroll>
                );
              })}
            </div>

            <div className="mb-4 p-5 luxury-card">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={subscribeRefills} onChange={(e) => setSubscribeRefills(e.target.checked)} className="mt-1 accent-[var(--color-heading)] shrink-0" />
                <div>
                  <p className="font-body text-sm font-normal uppercase tracking-[1.5px] text-[var(--color-heading)]">Automatic Refills</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-body font-light">Delivered monthly — save on every order</p>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <span className="section-label">Quantity</span>
              <div className="qty-luxury flex items-center">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">
                  <Minus size={14} strokeWidth={1.25} />
                </button>
                <span className="px-6 font-body font-light text-base min-w-[48px] text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                  <Plus size={14} strokeWidth={1.25} />
                </button>
              </div>
            </div>

            <AnimateOnScroll delay={0.15}>
            <div ref={buttonsRef} className="space-y-3 mb-4">
              <button type="button" onClick={handleAddToCart} className="product-btn-primary">
                Add to Cart
              </button>
              <button type="button" onClick={() => { handleAddToCart(); window.location.href = '/checkout'; }} className="product-btn-secondary">
                Buy Now
              </button>
            </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 py-4 border-y border-[var(--color-card-border)]">
              {[
                { label: 'Secure Checkout' },
                { label: `Free Shipping ₹${freeShippingThreshold}+` },
                { label: '30-Day Returns' },
                { label: 'Lab Tested' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-1">
                  <span className="text-[10px] font-body uppercase tracking-[2px] text-[var(--color-text-secondary)] leading-relaxed">{item.label}</span>
                </div>
              ))}
            </div>
            </AnimateOnScroll>

            {faqItems.length > 0 && (
              <AnimateOnScroll delay={0.25}>
              <div className="mb-4">
                <p className="section-label mb-2">Quick Questions</p>
                <FaqAccordion items={faqItems} compact defaultOpen={null} />
              </div>
              </AnimateOnScroll>
            )}

            <AnimateOnScroll delay={0.3}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4 font-body font-light">
              <span className="inline-flex items-center gap-2 text-[#0A0A0A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
                In Stock
              </span>
              <span className="text-[#E8E8E8]">|</span>
              <span className="inline-flex items-center gap-2 text-[#555555]">
                <Truck size={14} strokeWidth={1.25} />
                {(product.deliveryText as string) || 'Expected delivery in 3-5 business days'}
              </span>
            </div>

            <PaymentIcons />
            </AnimateOnScroll>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
