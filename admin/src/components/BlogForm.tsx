'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import CoverImagePicker from '@/components/CoverImagePicker';

export interface BlogFormData {
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  author: string;
  content: string;
  status: 'draft' | 'published';
}

const emptyForm: BlogFormData = {
  title: '',
  slug: '',
  coverImage: '',
  excerpt: '',
  author: 'Admin',
  content: '',
  status: 'draft',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface BlogFormProps {
  blogId?: string;
  initial?: Partial<BlogFormData>;
}

export default function BlogForm({ blogId, initial }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormData>({ ...emptyForm, ...initial });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({ ...emptyForm, ...initial });
      setSlugEdited(Boolean(initial.slug));
    }
  }, [initial]);

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugEdited ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSaving(true);
    try {
      if (blogId) {
        await adminApi.updateBlog(blogId, form);
        toast.success('Blog updated!');
      } else {
        await adminApi.createBlog(form);
        toast.success('Blog created!');
      }
      router.push('/blog');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 w-full max-w-full">
      <div>
        <label className="text-sm text-gray-500">Title</label>
        <input
          className="input-field mt-1"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm text-gray-500">Slug</label>
        <input
          className="input-field mt-1 font-mono text-sm"
          value={form.slug}
          onChange={(e) => {
            setSlugEdited(true);
            setForm({ ...form, slug: slugify(e.target.value) });
          }}
          required
        />
      </div>
      <CoverImagePicker
        value={form.coverImage}
        onChange={(coverImage) => setForm({ ...form, coverImage })}
      />
      <div>
        <label className="text-sm text-gray-500">Excerpt (max 200 chars)</label>
        <textarea
          className="input-field mt-1 min-h-[80px]"
          maxLength={200}
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">{form.excerpt.length}/200</p>
      </div>
      <div>
        <label className="text-sm text-gray-500">Author</label>
        <input
          className="input-field mt-1"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm text-gray-500">Content</label>
        <div className="mt-1 w-full">
          <RichTextEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-500 block mb-2">Status</label>
        <div className="flex gap-4">
          {(['draft', 'published'] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer capitalize">
              <input
                type="radio"
                name="status"
                checked={form.status === s}
                onChange={() => setForm({ ...form, status: s })}
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-admin">
          {saving ? 'Saving...' : blogId ? 'Update Blog' : 'Save Blog'}
        </button>
        <button type="button" onClick={() => router.push('/blog')} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
