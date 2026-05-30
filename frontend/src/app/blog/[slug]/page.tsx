'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface BlogPost {
  title: string;
  slug: string;
  coverImage?: string;
  content: string;
  author: string;
  publishedAt?: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api
      .getBlog(slug)
      .then(setBlog)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <section className="section-padding luxury-section-bg min-h-[50vh] flex items-center justify-center">
        <p className="section-body-text font-body">Loading...</p>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="section-padding luxury-section-bg min-h-[50vh]">
        <div className="container-main text-center">
          <h1 className="section-heading mb-4">Article not found</h1>
          <Link href="/blog" className="btn-outline inline-block">
            ← Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="luxury-section-bg">
      {blog.coverImage && (
        <AnimateOnScroll>
        <div className="relative w-full max-h-[500px] aspect-[21/9] md:aspect-auto md:h-[500px] overflow-hidden bg-[var(--color-image-bg)]">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={blog.coverImage.startsWith('http://localhost')}
          />
        </div>
        </AnimateOnScroll>
      )}

      <div className="section-padding">
        <div className="container-main max-w-3xl">
          <AnimateOnScroll>
          <Link href="/blog" className="inline-block text-[10px] font-body uppercase tracking-[2px] text-[var(--color-heading)] mb-8 hover:opacity-70 transition-opacity">
            ← Back to Blog
          </Link>

          <div className="heading-decor mb-6" aria-hidden />
          <h1 className="page-heading font-heading mb-6 tracking-wide">
            {blog.title}
          </h1>

          <p className="text-sm font-body font-light text-[var(--color-text-secondary)] mb-6 pb-4 border-b border-[var(--color-card-border)]">
            {formatDate(blog.publishedAt || blog.createdAt)}
            <span className="mx-3 text-[var(--color-card-border)]">·</span>
            By {blog.author}
          </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={0.15}>
          <div
            className="prose-content quill-content font-body font-light text-[var(--color-text)] leading-[1.8] max-w-[680px]"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          </AnimateOnScroll>
        </div>
      </div>
    </article>
  );
}
