'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface VideoTestimonialsEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function VideoTestimonialsEditor({ content, onChange }: VideoTestimonialsEditorProps) {
  const placeholders = (content.placeholderImages as string[]) || ['', '', '', ''];

  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('videoTestimonials', formData);
    return result.url as string;
  };

  const updatePlaceholder = (index: number, url: string) => {
    const updated = [...placeholders];
    while (updated.length < 4) updated.push('');
    updated[index] = url;
    onChange({ ...content, placeholderImages: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-gray-500">Section Heading Line 1</label>
        <input className="input-field mt-1" value={(content.headingLine1 as string) || ''} onChange={(e) => onChange({ ...content, headingLine1: e.target.value })} placeholder="Real Stories, Real Results:" />
      </div>
      <div>
        <label className="text-sm text-gray-500">Section Heading Line 2</label>
        <input className="input-field mt-1" value={(content.headingLine2 as string) || ''} onChange={(e) => onChange({ ...content, headingLine2: e.target.value })} placeholder="Bee Pearl Is Changing Lives" />
      </div>
      <div>
        <label className="text-sm text-gray-500">CTA Button Text</label>
        <input className="input-field mt-1" value={(content.ctaText as string) || ''} onChange={(e) => onChange({ ...content, ctaText: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-semibold mb-3 block">Video Placeholder Images (4 slots)</label>
        <p className="text-xs text-gray-400 mb-3">Shown when no video is uploaded for that slot. Upload actual videos in Video Manager.</p>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <ImageUploadField
              key={i}
              label={`Slot ${i + 1} Placeholder`}
              value={placeholders[i] || ''}
              onChange={(url) => updatePlaceholder(i, url)}
              onUpload={uploadImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
