'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { adminApi } from '@/lib/api';

interface CoverImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export default function CoverImagePicker({ value, onChange }: CoverImagePickerProps) {
  const [tab, setTab] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const preview = value || '';

  const applyUrl = () => {
    onChange(urlInput.trim());
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { url } = (await adminApi.uploadBlogCover(formData)) as { url: string };
      onChange(url);
      setUrlInput(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div>
      <label className="text-sm text-gray-500 block mb-2">Cover Image</label>
      <div className="flex gap-2 mb-3">
        {(['url', 'upload'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              tab === t ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {t === 'url' ? 'Image URL' : 'Upload Image'}
          </button>
        ))}
      </div>

      {tab === 'url' ? (
        <div className="flex gap-2 mb-4">
          <input
            className="input-field flex-1"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <button type="button" onClick={applyUrl} className="btn-admin shrink-0 px-4">
            Apply
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-admin-outline px-4 py-2"
          >
            {uploading ? 'Uploading...' : 'Choose file from device'}
          </button>
        </div>
      )}

      {preview ? (
        <div className="relative inline-block max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Cover preview"
            className="max-h-56 w-auto max-w-full rounded-lg border border-gray-200 object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 px-3 py-1 text-xs bg-white/95 border border-gray-200 rounded-lg shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="h-40 max-w-md rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
          No cover image selected
        </div>
      )}
    </div>
  );
}
