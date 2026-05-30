'use client';

import GenericImageSectionEditor from '@/components/GenericImageSectionEditor';
import ImageUploadField from '@/components/ImageUploadField';
import { adminApi } from '@/lib/api';
import { SectionLabelField, TextField } from './SectionEditorFields';

interface EditorProps {
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}

export function HeroSectionEditor({ content, onChange }: EditorProps) {
  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('heroSection', formData);
    return result.url as string;
  };

  return (
    <div className="space-y-4">
      <SectionLabelField content={content} onChange={onChange} />
      <TextField label="Headline" value={(content.headline as string) || ''} onChange={(v) => onChange({ ...content, headline: v })} />
      <TextField label="Headline 2 (with underline)" value={(content.headline2 as string) || ''} onChange={(v) => onChange({ ...content, headline2: v })} />
      <TextField label="Subtext (bold line)" value={(content.subtext as string) || ''} onChange={(v) => onChange({ ...content, subtext: v })} multiline />
      <TextField label="Subtext Secondary" value={(content.subtextSecondary as string) || ''} onChange={(v) => onChange({ ...content, subtextSecondary: v })} multiline />
      <TextField label="Rating Label" value={(content.ratingLabel as string) || ''} onChange={(v) => onChange({ ...content, ratingLabel: v })} placeholder="4.8 Stars from 400+ reviews" />
      <TextField label="Button Text" value={(content.buttonText as string) || ''} onChange={(v) => onChange({ ...content, buttonText: v })} />
      <TextField label="Button Link" value={(content.buttonHref as string) || ''} onChange={(v) => onChange({ ...content, buttonHref: v })} placeholder="/#product" />
      <ImageUploadField
        label="Hero Image"
        value={(content.backgroundImage as string) || ''}
        onChange={(url) => onChange({ ...content, backgroundImage: url })}
        onUpload={uploadImage}
      />
    </div>
  );
}

export function StatsSectionEditor({ content, onChange }: EditorProps) {
  const stat1 = (content.stat1 as { number: string; text: string }) || { number: '', text: '' };
  const stat2 = (content.stat2 as { number: string; text: string }) || { number: '', text: '' };

  return (
    <GenericImageSectionEditor
      sectionName="statsSection"
      content={content}
      onChange={onChange}
      imageField="backgroundImage"
      imageLabel="Section Image"
      textFields={[
        { key: 'sectionLabel', label: 'Section Label' },
        { key: 'heading', label: 'Heading' },
        { key: 'paragraph', label: 'Description', multiline: true },
        { key: 'closing', label: 'Closing Text', multiline: true },
      ]}
      extraFields={
        <>
          <TextField label="Stat 1 Number" value={stat1.number} onChange={(v) => onChange({ ...content, stat1: { ...stat1, number: v } })} />
          <TextField label="Stat 1 Text" value={stat1.text} onChange={(v) => onChange({ ...content, stat1: { ...stat1, text: v } })} multiline />
          <TextField label="Stat 2 Number" value={stat2.number} onChange={(v) => onChange({ ...content, stat2: { ...stat2, number: v } })} />
          <TextField label="Stat 2 Text" value={stat2.text} onChange={(v) => onChange({ ...content, stat2: { ...stat2, text: v } })} multiline />
        </>
      }
    />
  );
}

export function GoldStandardEditor({ content, onChange }: EditorProps) {
  const bullets = (content.bullets as string[]) || [];

  return (
    <GenericImageSectionEditor
      sectionName="goldStandard"
      content={content}
      onChange={onChange}
      imageField="image"
      imageLabel="Section Image"
      textFields={[
        { key: 'sectionLabel', label: 'Section Label' },
        { key: 'heading', label: 'Heading' },
        { key: 'paragraph', label: 'Paragraph', multiline: true },
        { key: 'paragraph2', label: 'Paragraph 2', multiline: true },
        { key: 'bulletLabel', label: 'Bullets Label' },
        { key: 'closing', label: 'Closing Text', multiline: true },
      ]}
      extraFields={
        <div>
          <label className="text-sm text-gray-500">Bullet Points (one per line)</label>
          <textarea
            className="input-field mt-1 font-mono text-xs"
            rows={6}
            value={bullets.join('\n')}
            onChange={(e) => onChange({ ...content, bullets: e.target.value.split('\n').filter(Boolean) })}
          />
        </div>
      }
    />
  );
}

export function ScienceStatsEditor({ content, onChange }: EditorProps) {
  const stats = (content.stats as { number: string; description: string }[]) || [];

  return (
    <div className="space-y-4">
      <SectionLabelField content={content} onChange={onChange} />
      <TextField label="Title" value={(content.title as string) || ''} onChange={(v) => onChange({ ...content, title: v })} />
      <TextField label="Subtitle" value={(content.subtitle as string) || ''} onChange={(v) => onChange({ ...content, subtitle: v })} multiline />
      <TextField label="Closing Text" value={(content.closingText as string) || ''} onChange={(v) => onChange({ ...content, closingText: v })} multiline />
      <div>
        <label className="text-sm font-semibold mb-2 block">Stats (JSON array)</label>
        <textarea
          className="input-field font-mono text-xs"
          rows={10}
          value={JSON.stringify(stats, null, 2)}
          onChange={(e) => {
            try { onChange({ ...content, stats: JSON.parse(e.target.value) }); } catch { /* ignore */ }
          }}
        />
        <p className="text-xs text-gray-400 mt-1">Format: [{`{ "number": "40+", "description": "..." }`}]</p>
      </div>
    </div>
  );
}

export function BenefitsGridEditor({ content, onChange }: EditorProps) {
  const cards = (content.cards as { icon?: string; title: string; description: string }[]) || [];

  return (
    <div className="space-y-4">
      <SectionLabelField content={content} onChange={onChange} />
      <TextField label="Heading" value={(content.heading as string) || ''} onChange={(v) => onChange({ ...content, heading: v })} />
      <TextField label="Subtext" value={(content.subtext as string) || ''} onChange={(v) => onChange({ ...content, subtext: v })} multiline />
      <div>
        <label className="text-sm font-semibold mb-2 block">Feature Cards (JSON)</label>
        <textarea
          className="input-field font-mono text-xs"
          rows={12}
          value={JSON.stringify(cards, null, 2)}
          onChange={(e) => {
            try { onChange({ ...content, cards: JSON.parse(e.target.value) }); } catch { /* ignore */ }
          }}
        />
      </div>
    </div>
  );
}

export function SimpleHeadingEditor({
  content,
  onChange,
  fields = ['heading', 'subtext'] as const,
}: EditorProps & { fields?: readonly ('heading' | 'subtext' | 'ctaText')[] }) {
  return (
    <div className="space-y-4">
      <SectionLabelField content={content} onChange={onChange} />
      {fields.includes('heading') && (
        <TextField label="Heading" value={(content.heading as string) || ''} onChange={(v) => onChange({ ...content, heading: v })} />
      )}
      {fields.includes('subtext') && (
        <TextField label="Subtext" value={(content.subtext as string) || ''} onChange={(v) => onChange({ ...content, subtext: v })} multiline />
      )}
      {fields.includes('ctaText') && (
        <TextField label="CTA Button Text" value={(content.ctaText as string) || ''} onChange={(v) => onChange({ ...content, ctaText: v })} />
      )}
    </div>
  );
}

export function CtaBannerEditor({ content, onChange }: EditorProps) {
  const uploadImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage('ctaBanner', formData);
    return result.url as string;
  };

  return (
    <div className="space-y-4">
      <TextField label="Headline" value={(content.headline as string) || ''} onChange={(v) => onChange({ ...content, headline: v })} />
      <TextField label="Subtext" value={(content.subtext as string) || ''} onChange={(v) => onChange({ ...content, subtext: v })} multiline />
      <TextField label="Button Text" value={(content.buttonText as string) || ''} onChange={(v) => onChange({ ...content, buttonText: v })} />
      <TextField label="Button Link" value={(content.buttonHref as string) || ''} onChange={(v) => onChange({ ...content, buttonHref: v })} placeholder="/#product" />
      <ImageUploadField
        label="Background Image (optional)"
        value={(content.backgroundImage as string) || ''}
        onChange={(url) => onChange({ ...content, backgroundImage: url })}
        onUpload={uploadImage}
      />
    </div>
  );
}

export function ReviewsSectionEditor({ content, onChange }: EditorProps) {
  return (
    <SimpleHeadingEditor content={content} onChange={onChange} fields={['heading', 'ctaText']} />
  );
}
