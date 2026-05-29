'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

function PolicyPage({ type }: { type: string }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    api.getPolicy(type).then((data) => {
      setContent(data.content || '');
      setTitle(data.title || type);
    }).catch(console.error);
  }, [type]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 capitalize">{title.replace(/-/g, ' ')}</h1>
      <div className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default function ShippingPolicyPage() { return <PolicyPage type="shipping" />; }
