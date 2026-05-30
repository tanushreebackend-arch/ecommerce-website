'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import AnimateOnScroll from '@/components/AnimateOnScroll';

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
    <AnimateOnScroll className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="page-heading mb-8 capitalize">{title.replace(/-/g, ' ')}</h1>
      <div className="prose-content" dangerouslySetInnerHTML={{ __html: content }} />
    </AnimateOnScroll>
  );
}

export default function TermsPage() { return <PolicyPage type="terms" />; }
