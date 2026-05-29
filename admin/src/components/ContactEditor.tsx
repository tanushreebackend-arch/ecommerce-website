'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface ContactEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function ContactEditor({ content, onChange }: ContactEditorProps) {
  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('contact', formData);
    return result.url as string;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-500">Page Heading</label>
        <input className="input-field mt-1" value={(content.heading as string) || ''} onChange={(e) => onChange({ ...content, heading: e.target.value })} />
      </div>
      <div>
        <label className="text-sm text-gray-500">Subheading</label>
        <input className="input-field mt-1" value={(content.subheading as string) || ''} onChange={(e) => onChange({ ...content, subheading: e.target.value })} />
      </div>
      <ImageUploadField
        label="Background Image"
        value={(content.backgroundImage as string) || ''}
        onChange={(url) => onChange({ ...content, backgroundImage: url })}
        onUpload={uploadImage}
      />
    </div>
  );
}
