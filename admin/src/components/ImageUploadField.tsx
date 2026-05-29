'use client';

import { useRef, useState } from 'react';
import ImageCropModal from '@/components/ImageCropModal';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: Blob, fileName: string) => Promise<string>;
  aspectDefault?: '1:1' | '4:3' | '16:9' | 'free';
  className?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  onUpload,
  className = '',
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const displayUrl = preview || value;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingName(file.name);
    setCropSrc(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleCropApply = async (blob: Blob, previewUrl: string) => {
    setCropSrc(null);
    setPreview(previewUrl);
    setUploading(true);
    try {
      const url = await onUpload(blob, pendingName || 'image.jpg');
      onChange(url);
      setPreview(url);
    } catch {
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={className}>
      <label className="text-sm text-gray-500 block mb-2">{label}</label>
      <div className="relative w-full max-w-[200px] aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
        {displayUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displayUrl} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
            >
              Change Image
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full h-full flex items-center justify-center text-gray-400 text-sm hover:bg-gray-100 transition-colors"
          >
            + Upload Image
          </button>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs text-gray-600">
            Uploading...
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          fileName={pendingName}
          onClose={() => { URL.revokeObjectURL(cropSrc); setCropSrc(null); }}
          onApply={handleCropApply}
        />
      )}
    </div>
  );
}
