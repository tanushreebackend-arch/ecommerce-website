'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/api';
import DigitalProductForm, { DigitalProductFormData } from '@/components/DigitalProductForm';

export default function EditDigitalProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [initial, setInitial] = useState<Partial<DigitalProductFormData> | null>(null);

  useEffect(() => {
    adminApi.getDigitalProduct(id).then(setInitial).catch(console.error);
  }, [id]);

  if (!initial) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Edit Digital Product</h1>
      <DigitalProductForm initial={initial} productId={id} />
    </div>
  );
}
