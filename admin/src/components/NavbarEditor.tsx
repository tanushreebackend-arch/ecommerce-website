'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface NavbarEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function NavbarEditor({ content, onChange }: NavbarEditorProps) {
  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('navbar', formData);
    return result.url as string;
  };

  return (
    <div className="space-y-4">
      <ImageUploadField
        label="Navbar Logo"
        value={(content.logoUrl as string) || ''}
        onChange={(url) => onChange({ ...content, logoUrl: url })}
        onUpload={uploadImage}
      />
      <div>
        <label className="text-sm text-gray-500">Brand / Website Name</label>
        <input
          className="input-field mt-1"
          value={(content.brandName as string) || ''}
          placeholder="Premium Wellness"
          onChange={(e) => onChange({ ...content, brandName: e.target.value })}
        />
      </div>
      <p className="text-xs text-gray-400">Also editable in Product Manager → Branding. Navbar values here take priority.</p>
    </div>
  );
}
