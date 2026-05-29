'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface GenericImageSectionEditorProps {
  sectionName: string;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  imageField: string;
  imageLabel: string;
  textFields?: { key: string; label: string; multiline?: boolean }[];
  extraFields?: React.ReactNode;
}

export default function GenericImageSectionEditor({
  sectionName,
  content,
  onChange,
  imageField,
  imageLabel,
  textFields = [],
  extraFields,
}: GenericImageSectionEditorProps) {
  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage(sectionName, formData);
    return result.url as string;
  };

  return (
    <div className="space-y-4">
      {textFields.map(({ key, label, multiline }) => (
        <div key={key}>
          <label className="text-sm text-gray-500">{label}</label>
          {multiline ? (
            <textarea className="input-field mt-1" rows={3} value={(content[key] as string) || ''} onChange={(e) => onChange({ ...content, [key]: e.target.value })} />
          ) : (
            <input className="input-field mt-1" value={(content[key] as string) || ''} onChange={(e) => onChange({ ...content, [key]: e.target.value })} />
          )}
        </div>
      ))}
      <ImageUploadField
        label={imageLabel}
        value={(content[imageField] as string) || ''}
        onChange={(url) => onChange({ ...content, [imageField]: url })}
        onUpload={uploadImage}
      />
      {extraFields}
    </div>
  );
}
