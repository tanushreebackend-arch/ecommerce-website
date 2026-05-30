'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface InfographicLabel {
  position: string;
  text: string;
}

interface Category {
  name: string;
  bullets: string[];
}

interface ComparisonEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

const LABEL_POSITIONS = ['top', 'left', 'right', 'bottomLeft', 'bottomRight'];

export default function ComparisonEditor({ content, onChange }: ComparisonEditorProps) {
  const infographic = (content.infographic as {
    centerImage?: string;
    brandName?: string;
    labels?: InfographicLabel[];
  }) || { labels: [] };

  const categories = (content.categories as Category[]) || [];

  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('comparison', formData);
    return result.url as string;
  };

  const updateInfographic = (field: string, value: unknown) => {
    onChange({ ...content, infographic: { ...infographic, [field]: value } });
  };

  const updateCategory = (index: number, field: keyof Category, value: unknown) => {
    const next = [...categories];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...content, categories: next });
  };

  const updateBullet = (catIndex: number, bulletIndex: number, value: string) => {
    const next = [...categories];
    const bullets = [...(next[catIndex].bullets || [])];
    bullets[bulletIndex] = value;
    next[catIndex] = { ...next[catIndex], bullets };
    onChange({ ...content, categories: next });
  };

  const addCategory = () => {
    onChange({
      ...content,
      categories: [...categories, { name: 'New Category', bullets: ['', ''] }],
    });
  };

  const removeCategory = (index: number) => {
    onChange({ ...content, categories: categories.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-gray-500">Section Label</label>
        <input className="input-field mt-1" value={(content.sectionLabel as string) || ''} onChange={(e) => onChange({ ...content, sectionLabel: e.target.value })} placeholder="WHY DIFFERENT" />
      </div>
      <div>
        <label className="text-sm text-gray-500">Section Heading</label>
        <input
          className="input-field mt-1"
          value={(content.heading as string) || ''}
          onChange={(e) => onChange({ ...content, heading: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm text-gray-500">Intro Paragraph 1</label>
        <p className="text-xs text-gray-400 mb-1">Wrap bold phrases in **double asterisks**</p>
        <textarea
          className="input-field mt-1"
          rows={3}
          value={(content.intro as string) || ''}
          onChange={(e) => onChange({ ...content, intro: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm text-gray-500">Intro Paragraph 2</label>
        <textarea
          className="input-field mt-1"
          rows={3}
          value={(content.introSecondary as string) || ''}
          onChange={(e) => onChange({ ...content, introSecondary: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold">Categories & Bullet Points</label>
          <button type="button" onClick={addCategory} className="text-xs text-brand hover:underline">
            + Add category
          </button>
        </div>
        {categories.map((cat, i) => (
          <div key={i} className="border rounded-lg p-4 mb-3 space-y-2">
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Category name (e.g. Live Enzymes & Co-Enzymes)"
                value={cat.name || ''}
                onChange={(e) => updateCategory(i, 'name', e.target.value)}
              />
              <button type="button" onClick={() => removeCategory(i)} className="text-xs text-red-500 px-2">
                Remove
              </button>
            </div>
            {(cat.bullets || ['', '']).map((bullet, j) => (
              <input
                key={j}
                className="input-field text-sm"
                placeholder={`Bullet ${j + 1}`}
                value={bullet}
                onChange={(e) => updateBullet(i, j, e.target.value)}
              />
            ))}
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      <ImageUploadField
        label="Infographic Center Image (bowl / product photo in middle of diagram)"
        value={infographic.centerImage}
        onChange={(url) => updateInfographic('centerImage', url)}
        onUpload={uploadImage}
      />

      <div>
        <label className="text-sm text-gray-500">Brand Name (below bowl)</label>
        <input
          className="input-field mt-1"
          value={infographic.brandName || ''}
          onChange={(e) => updateInfographic('brandName', e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Arrow Labels</label>
        {LABEL_POSITIONS.map((position) => {
          const existing = (infographic.labels || []).find((l) => l.position === position);
          const labelIndex = (infographic.labels || []).findIndex((l) => l.position === position);
          return (
            <div key={position} className="mb-2">
              <label className="text-xs text-gray-400 capitalize">{position}</label>
              <input
                className="input-field mt-0.5 text-sm"
                value={existing?.text || ''}
                onChange={(e) => {
                  const labels = [...(infographic.labels || [])];
                  if (labelIndex >= 0) {
                    labels[labelIndex] = { position, text: e.target.value };
                  } else {
                    labels.push({ position, text: e.target.value });
                  }
                  updateInfographic('labels', labels);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
