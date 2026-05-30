'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface DigitalProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  fileType: string;
}

export default function DigitalProductsPage() {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getDigitalProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding luxury-section-bg min-h-[60vh]">
      <div className="container-main">
        <AnimateOnScroll>
          <SectionHeading label="INSTANT DOWNLOAD">Digital Products</SectionHeading>
        </AnimateOnScroll>

        {loading ? (
          <p className="text-center section-body-text">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center section-body-text mx-auto">No digital products available yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, i) => (
              <AnimateOnScroll key={product._id} delay={i * 0.1}>
                <article className="product-card-luxury overflow-hidden flex flex-col h-full">
                  <div className="relative aspect-[4/3] bg-[var(--color-image-bg)]">
                    {product.coverImage ? (
                      <Image
                        src={product.coverImage}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 380px"
                        unoptimized={product.coverImage.startsWith('http://localhost')}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-heading uppercase text-[var(--color-text-secondary)] opacity-40">
                          {product.fileType}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="heading-gold-line mb-3" />
                    <h2 className="product-card-name mb-2">{product.title}</h2>
                    {product.description && (
                      <p className="text-sm text-[var(--color-text)] mb-4 line-clamp-3 flex-1">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-[var(--color-card-border)]">
                      <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                      <Link href={`/digital-products/${product._id}`} className="btn-primary py-2.5 px-5 text-[10px]">
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </article>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
