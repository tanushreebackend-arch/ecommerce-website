'use client';

import BlogForm from '@/components/BlogForm';

export default function NewBlogPage() {
  return (
    <div className="w-full max-w-full -m-8 p-6">
      <h1 className="text-2xl font-bold mb-8">Add New Blog</h1>
      <BlogForm />
    </div>
  );
}
