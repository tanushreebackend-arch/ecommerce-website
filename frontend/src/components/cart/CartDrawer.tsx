'use client';

import { X, Minus, Plus, Trash2, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSettings } from '@/context/SettingsContext';
import { getFreeShippingThreshold } from '@/lib/shipping';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal, getTotalSavings } = useCartStore();
  const { settings } = useSettings();

  const threshold = getFreeShippingThreshold(settings);
  const subtotal = getSubtotal();
  const savings = getTotalSavings();
  const progress = Math.min((subtotal / threshold) * 100, 100);
  const remaining = Math.max(threshold - subtotal, 0);
  const freeShipping = subtotal >= threshold;
  /** Truck sits at fill edge; clamp so it stays inside the track */
  const truckLeft = freeShipping ? 100 : Math.min(Math.max(progress, 6), 94);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={closeCart} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col slide-up">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading text-lg font-bold">Cart • {items.length} items</h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button onClick={closeCart} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress — CoreVita style */}
            <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
              {freeShipping ? (
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Congrats! You get <span className="font-bold">FREE shipping!</span>
                </p>
              ) : (
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Spend ₹{remaining.toLocaleString('en-IN')} more to get{' '}
                  <span className="font-bold">FREE shipping!</span>
                </p>
              )}
              <div className="relative h-7">
                <div className="shipping-progress-track absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
                  <div className="shipping-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div
                  className="shipping-progress-truck"
                  style={{ left: `calc(${truckLeft}% - 14px)` }}
                  aria-hidden
                >
                  <Truck size={13} strokeWidth={2.25} style={{ color: 'var(--color-secondary)' }} />
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 pb-4 border-b">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {item.image && <Image src={item.image} alt="" fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.packLabel}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-gray-400 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-green-600">(You save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString('en-IN')})</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-100">
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-100">
                          <Plus size={14} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t space-y-3">
              {savings > 0 && (
                <div className="flex justify-between text-sm font-semibold" style={{ color: 'var(--color-secondary)' }}>
                  <span>Total Savings</span>
                  <span>₹{savings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full block text-center">
                Check out
              </Link>
              <div className="flex justify-center gap-2 text-xs text-gray-400">
                <span>Visa</span><span>•</span><span>UPI</span><span>•</span><span>Razorpay</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
