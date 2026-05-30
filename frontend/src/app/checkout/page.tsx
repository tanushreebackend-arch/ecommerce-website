'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Ticket, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useSettings } from '@/context/SettingsContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { getFreeShippingThreshold } from '@/lib/shipping';
import PaymentIcons from '@/components/PaymentIcons';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface AvailableCoupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
}

function couponLabel(coupon: AvailableCoupon): string {
  const off = coupon.discountType === 'percentage' ? `${coupon.value}% off` : `₹${coupon.value} off`;
  const min = coupon.minOrder > 0 ? ` · Min. order ₹${coupon.minOrder.toLocaleString('en-IN')}` : '';
  return `${coupon.code} — ${off}${min}`;
}

export default function CheckoutPage() {
  const { items, getSubtotal, getTotalSavings, clearCart } = useCartStore();
  const { settings } = useSettings();
  const threshold = getFreeShippingThreshold(settings);

  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', apartment: '',
    city: '', state: '', pinCode: '', country: 'India', phone: '',
  });
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplying, setCouponApplying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const savings = getTotalSavings();
  const shippingCost = subtotal >= threshold ? 0 : 99;
  const total = subtotal + shippingCost - discount;

  useEffect(() => {
    api.getAvailableCoupons().then(setAvailableCoupons).catch(() => setAvailableCoupons([]));
  }, []);

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode('');
    setAppliedCode('');
  };

  const applyCoupon = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setCouponApplying(true);
    try {
      const result = await api.validateCoupon(trimmed, subtotal);
      setDiscount(result.discount);
      setCouponCode(result.code);
      setAppliedCode(result.code);
      toast.success('Coupon applied!');
    } catch (err) {
      setDiscount(0);
      setAppliedCode('');
      toast.error(err instanceof Error ? err.message : 'Invalid coupon');
    } finally {
      setCouponApplying(false);
    }
  };

  const handleApplyCoupon = () => applyCoupon(couponCode);

  const handleSelectCoupon = (code: string) => {
    if (!code) {
      removeCoupon();
      return;
    }
    setCouponCode(code);
    applyCoupon(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setLoading(true);

    try {
      if (paymentMethod === 'razorpay' && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        const payment = await api.createPayment(total);
        if (!payment.mock) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          document.body.appendChild(script);
          await new Promise((resolve) => { script.onload = resolve; });

          const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: payment.amount,
            currency: 'INR',
            name: 'Premium Wellness',
            order_id: payment.orderId,
            handler: async (response: Record<string, string>) => {
              await placeOrder(response.razorpay_order_id, response.razorpay_payment_id);
            },
          });
          rzp.open();
          setLoading(false);
          return;
        }
      }

      await placeOrder();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  const placeOrder = async (razorpayOrderId?: string, razorpayPaymentId?: string) => {
    const order = await api.createOrder({
      items: items.map((i) => ({
        productId: i.productId, packId: i.packId, name: i.name,
        packLabel: i.packLabel, price: i.price, originalPrice: i.originalPrice,
        quantity: i.quantity, image: i.image,
      })),
      subtotal, discount, shippingCost, total,
      couponUsed: discount > 0 ? appliedCode || couponCode : undefined,
      shippingAddress: form,
      customerEmail: form.email,
      customerName: `${form.firstName} ${form.lastName}`,
      customerPhone: form.phone,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
    });

    clearCart();
    window.location.href = `/order-confirmation?orderId=${order.order.orderId}&name=${form.firstName}`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#999999] mb-4">Your cart is empty</p>
          <a href="/" className="btn-primary">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="page-heading">Checkout</h1>

        <div className="flex gap-3">
          <button type="button" className="flex-1 py-3 border-2 rounded-lg font-medium text-sm" style={{ borderColor: 'var(--color-primary)' }}>
            Razorpay
          </button>
          <button type="button" className="flex-1 py-3 border rounded-lg font-medium text-sm">UPI</button>
        </div>

        <div className="relative text-center">
          <span className="bg-white px-4 text-[#999999] text-sm relative z-10">OR</span>
          <div className="absolute top-1/2 left-0 right-0 border-t" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email or Phone</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <fieldset className="space-y-4">
          <legend className="section-label mb-2 block">Delivery</legend>
          <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg">
            <option>India</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First name" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="px-4 py-3 border rounded-lg" />
            <input placeholder="Last name" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="px-4 py-3 border rounded-lg" />
          </div>
          <input placeholder="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" />
          <input placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={(e) => setForm({ ...form, apartment: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="px-4 py-3 border rounded-lg" />
            <input placeholder="State" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="px-4 py-3 border rounded-lg" />
            <input placeholder="PIN code" required value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
              className="px-4 py-3 border rounded-lg" />
          </div>
          <input placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg" />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="section-label mb-2 block">Payment</legend>
          {['razorpay', 'upi', 'cod'].map((method) => (
            <label key={method} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer">
              <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
              <span className="capitalize">{method === 'cod' ? 'Cash on Delivery' : method.toUpperCase()}</span>
            </label>
          ))}
        </fieldset>

        <button type="submit" disabled={loading} className="btn-primary w-full py-4">
          {loading ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
        </button>
        <div className="flex justify-center pt-2">
          <PaymentIcons />
        </div>
      </form>

      {/* Order Summary */}
      <div className="lg:sticky lg:top-24 h-fit">
        <div className="bg-[#F5F5F5] rounded-2xl p-6 space-y-4">
          <h2 className="section-label mb-2">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
                {item.image && <Image src={item.image} alt="" fill className="object-cover" />}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#555555] text-white text-xs rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="product-card-name truncate">{item.name}</p>
                <p className="text-xs text-[#999999]">{item.packLabel}</p>
                <p className="product-card-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}

          {/* Coupons */}
          <div className="rounded-xl border border-[var(--color-card-border)] bg-white p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-brand" />
              <p className="text-sm font-normal text-[#0A0A0A]">Coupons &amp; Offers</p>
            </div>

            {availableCoupons.length > 0 ? (
              <div>
                <label className="text-xs text-[#999999] mb-1 block">Select an offer</label>
                <select
                  value={appliedCode}
                  onChange={(e) => handleSelectCoupon(e.target.value)}
                  disabled={couponApplying}
                  className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                >
                  <option value="">Choose a coupon...</option>
                  {availableCoupons.map((coupon) => {
                    const eligible = subtotal >= coupon.minOrder;
                    return (
                      <option key={coupon.code} value={coupon.code} disabled={!eligible}>
                        {couponLabel(coupon)}{!eligible ? ' (add more items)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <p className="text-xs text-[#999999]">No active coupons right now. Enter a code below if you have one.</p>
            )}

            <div className="flex gap-2">
              <input
                placeholder="Or enter discount code"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                  if (appliedCode) removeCoupon();
                }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponApplying || !couponCode.trim()}
                className="btn-outline text-sm px-4 py-2 disabled:opacity-50"
              >
                Apply
              </button>
            </div>

            {appliedCode && discount > 0 && (
              <div className="flex items-center justify-between gap-2 border border-[var(--color-card-border)] bg-white px-3 py-2">
                <span className="text-xs font-medium text-[var(--color-heading)]">
                  🏷️ {appliedCode} applied — you save ₹{discount.toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="p-1 hover:bg-[#F5F5F5] text-[var(--color-heading)]"
                  aria-label="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
            {discount > 0 && <div className="flex justify-between text-[var(--color-heading)]"><span>Discount</span><span>-₹{discount.toLocaleString('en-IN')}</span></div>}
            {savings > 0 && (
              <div className="flex justify-between font-normal text-[var(--color-heading)]">
                <span>Total Savings</span><span>₹{savings.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <PaymentIcons />
          </div>
        </div>
      </div>
    </div>
  );
}
