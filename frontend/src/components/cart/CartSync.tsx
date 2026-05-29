'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

export default function CartSync() {
  const items = useCartStore((s) => s.items);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await api.getMe();
        await api.syncCart(
          items.map(({ productId, packId, name, packLabel, price, originalPrice, quantity, image }) => ({
            productId,
            packId,
            name,
            packLabel,
            price,
            originalPrice,
            quantity,
            image,
          }))
        );
      } catch {
        // Not logged in or sync failed — ignore silently
      }
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [items]);

  return null;
}
