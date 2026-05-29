'use client';

import { useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import ImageCropModal from '@/components/ImageCropModal';
import toast from 'react-hot-toast';

interface ProductImage {
  url: string;
  publicId?: string;
  sortOrder?: number;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  onUpload: (files: Blob[]) => Promise<ProductImage[]>;
  onReplace: (index: number, file: Blob) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  onReorder: (order: number[]) => Promise<void>;
}

export default function ProductImageManager({
  images,
  onUpload,
  onReplace,
  onDelete,
  onReorder,
}: ProductImageManagerProps) {
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState('');
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const openCrop = (file: File, index: number | null) => {
    setReplaceIndex(index);
    setPendingName(file.name);
    setCropSrc(URL.createObjectURL(file));
  };

  const handleCropApply = async (blob: Blob) => {
    setCropSrc(null);
    setBusy(true);
    try {
      if (replaceIndex !== null) {
        await onReplace(replaceIndex, blob);
        toast.success('Image replaced');
      } else {
        await onUpload([blob]);
        toast.success('Image added');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      setReplaceIndex(null);
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Delete this image?')) return;
    setBusy(true);
    try {
      await onDelete(index);
      toast.success('Image deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDrop = async (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const order = images.map((_, i) => i);
    const [moved] = order.splice(dragIndex, 1);
    order.splice(targetIndex, 0, moved);
    setDragIndex(null);
    setBusy(true);
    try {
      await onReorder(order);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reorder failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {images.map((img, i) => (
          <div
            key={`${img.publicId || img.url}-${i}`}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className={`relative rounded-xl overflow-hidden border-2 bg-gray-50 aspect-square group ${
              dragIndex === i ? 'border-green-500 opacity-60' : 'border-gray-200'
            }`}
          >
            <span className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div className="absolute top-2 right-2 z-10 cursor-grab text-white drop-shadow">
              <GripVertical size={16} />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex gap-0.5 p-1 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                disabled={busy}
                onClick={() => { setReplaceIndex(i); replaceInputRef.current?.click(); }}
                className="flex-1 text-[10px] py-1.5 bg-white/90 rounded text-gray-800 font-medium"
              >
                Replace
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => { setReplaceIndex(i); addInputRef.current?.click(); }}
                className="flex-1 text-[10px] py-1.5 bg-white/90 rounded text-gray-800 font-medium"
              >
                Crop
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handleDelete(i)}
                className="flex-1 text-[10px] py-1.5 bg-red-500 text-white rounded font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={busy}
          onClick={() => { setReplaceIndex(null); addInputRef.current?.click(); }}
          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-600 hover:text-green-700 transition-colors text-sm"
        >
          <span className="text-2xl mb-1">+</span>
          Add New
        </button>
      </div>

      <input
        ref={addInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) openCrop(file, replaceIndex);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && replaceIndex !== null) openCrop(file, replaceIndex);
          e.target.value = '';
        }}
      />

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={pendingName}
          onClose={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); setReplaceIndex(null); }}
          onApply={(blob) => { URL.revokeObjectURL(cropSrc); handleCropApply(blob); }}
        />
      )}

      <p className="text-xs text-gray-400">Drag thumbnails to reorder. Hover for Replace, Crop, or Delete.</p>
    </div>
  );
}
