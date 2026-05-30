'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import SectionHeading from '@/components/SectionHeading';
import AnimateOnScroll from '@/components/AnimateOnScroll';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  excerpt: string;
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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBlogs()
      .then((data) => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-padding luxury-section-bg luxury-texture min-h-[60vh]">
      <div className="container-main">
        <AnimateOnScroll>
          <SectionHeading label="WELLNESS INSIGHTS">Our Blog</SectionHeading>
        </AnimateOnScroll>

        {loading ? (
          <p className="text-center section-body-text font-body">Loading articles...</p>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="page-heading font-heading mb-4">No blogs at the moment</p>
            <p className="section-body-text mx-auto">Check back soon for wellness tips and insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <AnimateOnScroll key={blog._id} delay={i * 0.1}>
                <article className="product-card-luxury overflow-hidden flex flex-col h-full">
                  {blog.coverImage ? (
                    <div className="relative aspect-[16/10] bg-[var(--color-image-bg)]">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 380px"
                        unoptimized={blog.coverImage.startsWith('http://localhost')}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-[var(--color-section-alt)]" />
                  )}
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <time className="product-card-category mb-3 block">
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </time>
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
      </div>
    </section>
  );
}
