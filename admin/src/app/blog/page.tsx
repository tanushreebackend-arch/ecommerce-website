'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  author: string;
  publishedAt?: string;
  createdAt: string;
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllBlogs();
      setBlogs(data as Blog[]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (blog: Blog) => {
    const next = blog.status === 'published' ? 'draft' : 'published';
    try {
      const updated = await adminApi.updateBlog(blog._id, { status: next });
      setBlogs((prev) => prev.map((b) => (b._id === blog._id ? (updated as Blog) : b)));
      toast.success(next === 'published' ? 'Blog published' : 'Moved to draft');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await adminApi.deleteBlog(deleteId);
      setBlogs((prev) => prev.filter((b) => b._id !== deleteId));
      toast.success('Blog deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (blog: Blog) => {
    const d = blog.publishedAt || blog.createdAt;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Blog</h1>
        <Link href="/blog/new" className="btn-admin">
          Add New Blog
        </Link>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 p-4">Loading...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500 p-4">No blog posts yet. Create your first one!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="py-3 pr-4 font-medium">Title</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Date</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b last:border-0">
                  <td className="py-3 pr-4">
                    <p className="font-medium text-gray-900">{blog.title}</p>
                    <p className="text-xs text-gray-400 font-mono">/{blog.slug}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        blog.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{formatDate(blog)}</td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleStatus(blog)}
                        className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50"
                      >
                        {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/blog/${blog._id}/edit`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        aria-label="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(blog._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Delete blog post?</h2>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
