'use client';

import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';

interface NutrientCard {
  nutrient: string;
  claim: string;
  benefits: string[];
  competitorImage?: string;
  competitorLabel?: string;
}

interface NutrientComparisonEditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export default function NutrientComparisonEditor({ content, onChange }: NutrientComparisonEditorProps) {
  const cards = (content.cards as NutrientCard[]) || [];
  const productImage = (content.productImage as string) || '';

  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('nutrientComparison', formData);
    return result.url as string;
  };

  const updateCard = (index: number, field: keyof NutrientCard, value: string) => {
    const updated = cards.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    onChange({ ...content, cards: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm text-gray-500">Section Label</label>
        <input className="input-field mt-1" value={(content.sectionLabel as string) || ''} onChange={(e) => onChange({ ...content, sectionLabel: e.target.value })} placeholder="NUTRITION COMPARISON" />
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
        <label className="text-sm text-gray-500">Intro / Subtext</label>
        <textarea className="input-field mt-1" rows={2} value={(content.intro as string) || ''} onChange={(e) => onChange({ ...content, intro: e.target.value })} />
      </div>

      <ImageUploadField
        label="Product Image for ALL comparison cards (OURS)"
        value={productImage}
        onChange={(url) => onChange({ ...content, productImage: url })}
        onUpload={uploadImage}
      />

      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Comparison Cards</h3>
        {cards.map((card, i) => (
          <div key={i} className="border rounded-xl p-4 space-y-3 bg-gray-50/50">
            <p className="font-semibold text-brand">{card.nutrient}</p>
            <ImageUploadField
              label={`Competitor food image — ${card.nutrient}`}
              value={card.competitorImage}
              onChange={(url) => updateCard(i, 'competitorImage', url)}
              onUpload={uploadImage}
            />
            <div>
              <label className="text-xs text-gray-500">Competitor Label</label>
              <input
                className="input-field mt-1 text-sm"
                value={card.competitorLabel || ''}
                placeholder="e.g. Beef Liver"
                onChange={(e) => updateCard(i, 'competitorLabel', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
