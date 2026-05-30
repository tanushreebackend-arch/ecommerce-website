'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm, { BlogFormData } from '@/components/BlogForm';
import { adminApi } from '@/lib/api';

interface BlogRecord extends BlogFormData {
  _id: string;
}

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<BlogFormData> | null>(null);

  useEffect(() => {
    if (!id) return;
    adminApi
      .getAllBlogs()
      .then((blogs: unknown) => {
        const list = blogs as BlogRecord[];
        const blog = list.find((b) => b._id === id);
        if (blog) {
          setInitial({
            title: blog.title,
            slug: blog.slug,
            coverImage: blog.coverImage,
            excerpt: blog.excerpt,
            author: blog.author,
            content: blog.content,
            status: blog.status,
          });
        }
      })
      .catch(console.error);
  }, [id]);

  if (!initial) {
    return (
      <div className="w-full max-w-full -m-8 p-6">
        <p className="text-gray-500">Loading blog...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full -m-8 p-6">
      <h1 className="text-2xl font-bold mb-8">Edit Blog</h1>
      <BlogForm blogId={id} initial={initial} />
    </div>
  );
}
