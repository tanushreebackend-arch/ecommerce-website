'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface DigitalProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  fileType: string;
  fileName?: string;
}

export default function DigitalProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [purchasing, setPurchasing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api
      .getDigitalProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const completePurchase = async (razorpayOrderId?: string, razorpayPaymentId?: string, razorpaySignature?: string) => {
    if (!product) return;
    await api.purchaseDigitalProduct(product._id, {
      customerEmail: email,
      customerName: name || email.split('@')[0],
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    setSuccess(true);
    toast.success('Check your email for the download link');
  };

  const handleBuy = async () => {
    if (!product) return;
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    setPurchasing(true);
    try {
      const payment = await api.createPayment(product.price);

      if (payment.mock || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        await completePurchase();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
      await new Promise((resolve) => { script.onload = resolve; });

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: payment.amount,
        currency: 'INR',
        name: 'Digital Products',
        description: product.title,
        order_id: payment.orderId,
        prefill: { email, name: name || undefined },
        handler: async (response: Record<string, string>) => {
          try {
            const verified = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (!verified.verified) {
              toast.error('Payment verification failed');
              return;
            }
            await completePurchase(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Purchase failed');
          } finally {
            setPurchasing(false);
          }
        },
        modal: {
          ondismiss: () => setPurchasing(false),
        },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment failed');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="section-padding container-main">
        <p className="section-body-text">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section-padding container-main text-center">
        <p className="section-body-text mb-6">Product not found</p>
        <Link href="/digital-products" className="btn-primary inline-block">
          Back to Digital Products
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="section-padding container-main max-w-lg mx-auto text-center">
        <div className="w-14 h-14 border border-[var(--color-heading)] flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✓</span>
        </div>
        <h1 className="page-heading mb-3">Purchase complete</h1>
        <p className="section-body-text mx-auto mb-8">
          Check your email for the download link. We sent it to <strong>{email}</strong>.
        </p>
        <Link href="/digital-products" className="btn-secondary inline-block">
          Browse more products
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding luxury-section-bg">
      <div className="container-main max-w-4xl">
        <Link href="/digital-products" className="text-sm text-[var(--color-text)] hover:opacity-70 mb-8 inline-block">
          ← Back to Digital Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="relative aspect-square bg-[var(--color-image-bg)] border border-[var(--color-card-border)]">
            {product.coverImage ? (
              <Image
                src={product.coverImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 480px"
                unoptimized={product.coverImage.startsWith('http://localhost')}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-heading uppercase text-[var(--color-text-secondary)] opacity-30">
                  {product.fileType}
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="heading-gold-line mb-4" />
            <h1 className="product-title mb-4">{product.title}</h1>
            {product.description && (
              <p className="section-body-text mb-6">{product.description}</p>
            )}
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
              {product.fileType.toUpperCase()} download
            </p>
            <p className="product-price mb-8">₹{product.price.toLocaleString('en-IN')}</p>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Your name (optional)"
                className="input-luxury-box w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email for download link *"
                className="input-luxury-box w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="button"
              onClick={handleBuy}
              disabled={purchasing}
              className="btn-primary w-full"
            >
              {purchasing ? 'Processing...' : 'Buy Now'}
            </button>

            <p className="text-xs text-[var(--color-text-secondary)] mt-4 text-center">
              After payment, your download link will be emailed instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
