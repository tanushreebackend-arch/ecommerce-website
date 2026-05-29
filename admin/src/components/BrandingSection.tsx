'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface BrandingSectionProps {
  product: Record<string, unknown>;
  onUpdate: (product: Record<string, unknown>) => void;
}

export default function BrandingSection({ product, onUpdate }: BrandingSectionProps) {
  const logoUrl = (product.logo as { url?: string })?.url || '';
  const comparisonUrl = (product.comparisonImage as { url?: string })?.url || '';

  const uploadLogo = async (blob: Blob, fileName: string) => {
    const fd = new FormData();
    fd.append('logo', blob, fileName);
    const updated = await adminApi.uploadLogo(fd);
    onUpdate(updated);
    toast.success('Logo uploaded');
    return (updated.logo as { url: string }).url;
  };

  const uploadComparison = async (blob: Blob, fileName: string) => {
    const fd = new FormData();
    fd.append('image', blob, fileName);
    const updated = await adminApi.uploadComparisonImage(fd);
    onUpdate(updated);
    toast.success('Comparison image uploaded');
    return (updated.comparisonImage as { url: string }).url;
  };

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold">Branding</h2>
      <div>
        <label className="text-sm text-gray-500">Website / Brand Name</label>
        <input
          className="input-field mt-1"
          value={(product.brandName as string) || ''}
          placeholder="Premium Wellness"
          onChange={(e) => onUpdate({ ...product, brandName: e.target.value })}
        />
        <p className="text-xs text-gray-400 mt-1">Shown in the navbar next to the logo.</p>
      </div>
      <ImageUploadField label="Navbar Logo" value={logoUrl} onChange={() => {}} onUpload={uploadLogo} />
      <ImageUploadField
        label="Nutrient Comparison — OURS image (all cards)"
        value={comparisonUrl}
        onChange={() => {}}
        onUpload={uploadComparison}
      />
    </div>
  );
}
