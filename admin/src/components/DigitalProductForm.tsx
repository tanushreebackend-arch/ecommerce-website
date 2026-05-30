'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

export interface DigitalProductFormData {
  title: string;
  description: string;
  price: number;
  fileUrl: string;
  fileName: string;
  fileType: string;
  coverImage: string;
  status: 'active' | 'inactive';
}

interface Props {
  initial?: Partial<DigitalProductFormData>;
  productId?: string;
}

export default function DigitalProductForm({ initial, productId }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const [form, setForm] = useState<DigitalProductFormData>({
    title: initial?.title || '',
    description: initial?.description || '',
    price: initial?.price ?? 0,
    fileUrl: initial?.fileUrl || '',
    fileName: initial?.fileName || '',
    fileType: initial?.fileType || 'pdf',
    coverImage: initial?.coverImage || '',
    status: initial?.status || 'active',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const result = await adminApi.uploadDigitalProductFile(fd) as {
        fileUrl: string;
        fileName: string;
        fileType: string;
      };
      setForm((f) => ({
        ...f,
        fileUrl: result.fileUrl,
        fileName: result.fileName,
        fileType: result.fileType,
      }));
      toast.success('File uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'File upload failed');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await adminApi.uploadDigitalProductCover(fd) as { url: string };
      setForm((f) => ({ ...f, coverImage: result.url }));
      toast.success('Cover image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cover upload failed');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.fileUrl) {
      toast.error('Please upload a product file');
      return;
    }
    if (form.price < 0) {
      toast.error('Price must be 0 or greater');
      return;
    }

    setSaving(true);
    try {
      if (productId) {
        await adminApi.updateDigitalProduct(productId, form);
        toast.success('Product updated');
      } else {
        await adminApi.createDigitalProduct(form);
        toast.success('Product created');
      }
      router.push('/digital-products');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 max-w-2xl">
      <div>
        <label className="text-sm text-gray-600">Title *</label>
        <input
          className="input-field mt-1"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea
          className="input-field mt-1 min-h-[100px]"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Price (₹) *</label>
        <input
          type="number"
          min={0}
          step={1}
          className="input-field mt-1"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Cover image</label>
        <div className="mt-1 space-y-2">
          <input
            className="input-field"
            placeholder="Image URL"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
          />
          <div className="flex items-center gap-3">
            <label className="btn-admin cursor-pointer text-sm py-2 px-4 inline-block">
              {uploadingCover ? 'Uploading...' : 'Upload cover'}
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
            </label>
            {form.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.coverImage} alt="" className="h-14 w-14 object-cover border rounded" />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Product file (PDF, ZIP, DOC) * — max 50MB</label>
        <input
          type="file"
          accept=".pdf,.zip,.doc,.docx,application/pdf,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="input-field mt-1"
          onChange={handleFileUpload}
          disabled={uploadingFile}
        />
        {form.fileName && (
          <p className="text-sm text-green-700 mt-2">
            ✓ {form.fileName} ({form.fileType.toUpperCase()})
          </p>
        )}
        {uploadingFile && <p className="text-sm text-gray-500 mt-1">Uploading file...</p>}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-600">Status</label>
        <button
          type="button"
          onClick={() => setForm({ ...form, status: form.status === 'active' ? 'inactive' : 'active' })}
          className={`px-3 py-1.5 rounded text-sm font-medium ${
            form.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {form.status === 'active' ? 'Active' : 'Inactive'}
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-admin">
          {saving ? 'Saving...' : productId ? 'Update Product' : 'Save Product'}
        </button>
        <button type="button" onClick={() => router.push('/digital-products')} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
          Cancel
        </button>
      </div>
    </form>
  );
}
