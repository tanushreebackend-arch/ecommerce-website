'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';
import { useSection } from '@/hooks/useSection';
import api from '@/lib/api';

interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt?: string;
  createdAt: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HomeBlogSection() {
  const { content, isVisible } = useSection('blogSection');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    api.getBlogs().then((data) => setBlogs(Array.isArray(data) ? data.slice(0, 3) : [])).catch(() => setBlogs([]));
  }, []);

  if (!isVisible) return null;

  const sectionLabel = (content.sectionLabel as string) || 'WELLNESS INSIGHTS';
  const heading = (content.heading as string) || 'Our Blog';
  const subtext = (content.subtext as string) || '';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel} subheading={subtext}>
            {heading}
          </SectionHeading>

          {blogs.length === 0 ? (
            <p className="text-center text-[var(--color-text-secondary)] font-body text-sm">No blog posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog, i) => (
                <AnimateOnScroll key={blog._id} delay={i * 0.1}>
                  <article className="product-card-luxury flex flex-col h-full overflow-hidden">
                    {blog.coverImage && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={blog.coverImage}
                          alt={blog.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:768px) 100vw, 33vw"
                          unoptimized={blog.coverImage.startsWith('http://localhost')}
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-[2px] text-[var(--color-text-secondary)] mb-2 font-body">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>
                      <h3 className="product-card-name mb-3 leading-snug">{blog.title}</h3>
                      <p className="section-body-text text-sm flex-1 mb-6 !max-w-none">{blog.excerpt}</p>
                      <Link href={`/blog/${blog.slug}`} className="btn-outline inline-block text-center text-[10px] py-3 px-6 w-fit">
                        Read More
                      </Link>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/blog" className="btn-secondary inline-block px-10 py-4 w-auto">
              View All Articles
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
