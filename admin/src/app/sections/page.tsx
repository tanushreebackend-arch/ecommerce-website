'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import toast from 'react-hot-toast';
import FaqEditor from '@/components/FaqEditor';
import ComparisonEditor from '@/components/ComparisonEditor';
import NutrientComparisonEditor from '@/components/NutrientComparisonEditor';
import SectionPreview from '@/components/SectionPreview';
import NavbarEditor from '@/components/NavbarEditor';
import VideoTestimonialsEditor from '@/components/VideoTestimonialsEditor';
import ContactEditor from '@/components/ContactEditor';
import GenericImageSectionEditor from '@/components/GenericImageSectionEditor';
import ImageUploadField from '@/components/ImageUploadField';
import { SectionVisibilityToggle } from '@/components/editors/SectionEditorFields';
import {
  HeroSectionEditor,
  StatsSectionEditor,
  GoldStandardEditor,
  ScienceStatsEditor,
  BenefitsGridEditor,
  SimpleHeadingEditor,
  CtaBannerEditor,
  ReviewsSectionEditor,
} from '@/components/editors/SectionEditors';

const SECTION_LABELS: Record<string, string> = {
  heroSection: 'Hero Section',
  benefitsGrid: 'Features / Benefits',
  bestSellers: 'Best Sellers',
  statsSection: 'The Science',
  goldStandard: 'Quality Standard',
  scienceStats: 'Clinical Research',
  comparison: 'Why Different',
  videoTestimonials: 'Real Stories (Videos)',
  nutrientComparison: 'Nutrition Comparison',
  reviewsSection: 'Testimonials (Reviews)',
  blogSection: 'Blog Section',
  ctaBanner: 'CTA Banner',
  announcement: 'Announcement Bar',
  faq: 'FAQ Section',
  navbar: 'Navbar',
  footer: 'Footer',
  contact: 'Contact Page',
};

const IMAGE_FIELD_KEYS = ['image', 'imageUrl', 'backgroundImage', 'logoUrl', 'heroImage'];

export default function SectionsPage() {
  const [activeSection, setActiveSection] = useState('heroSection');
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [isVisible, setIsVisible] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSection(activeSection).then((s) => {
      setContent(s.content || {});
      setIsVisible(s.isVisible !== false);
    }).catch(console.error);
  }, [activeSection]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSection(activeSection, { content, isVisible });
      toast.success('Section saved!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: string, value: unknown) => {
    setContent({ ...content, [key]: value });
  };

  const uploadSectionImage = async (blob: Blob, fileName: string) => {
    const formData = new FormData();
    formData.append('image', blob, fileName);
    const result = await adminApi.uploadSectionImage(activeSection, formData);
    return result.url as string;
  };

  const renderEditor = () => {
    if (activeSection === 'heroSection') {
      return <HeroSectionEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'benefitsGrid') {
      return <BenefitsGridEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'bestSellers') {
      return <SimpleHeadingEditor content={content} onChange={setContent} fields={['heading', 'subtext']} />;
    }
    if (activeSection === 'blogSection') {
      return <SimpleHeadingEditor content={content} onChange={setContent} fields={['heading', 'subtext']} />;
    }
    if (activeSection === 'ctaBanner') {
      return <CtaBannerEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'statsSection') {
      return <StatsSectionEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'goldStandard') {
      return <GoldStandardEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'scienceStats') {
      return <ScienceStatsEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'reviewsSection') {
      return <ReviewsSectionEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'announcement') {
      return (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Announcement Text</label>
            <input
              className="input-field mt-1"
              value={(content.text as string) || ''}
              onChange={(e) => updateField('text', e.target.value)}
              placeholder="FREE SHIPPING ON ALL ORDERS ABOVE ₹1299"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              className="input-field mt-1"
              value={(content.shippingThreshold as number) ?? ''}
              onChange={(e) => {
                const threshold = Number(e.target.value);
                const text = (content.text as string) || 'FREE SHIPPING ON ALL ORDERS ABOVE ₹499';
                const updatedText = /[₹$]\s*[\d,]+/.test(text)
                  ? text.replace(/[₹$]\s*[\d,]+/, `₹${threshold.toLocaleString('en-IN')}`)
                  : `FREE SHIPPING ON ALL ORDERS ABOVE ₹${threshold.toLocaleString('en-IN')}`;
                setContent({ ...content, shippingThreshold: threshold, text: updatedText });
              }}
              placeholder="1299"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={content.visible !== false} onChange={(e) => updateField('visible', e.target.checked)} />
            Show announcement bar
          </label>
        </div>
      );
    }
    if (activeSection === 'faq') {
      return <FaqEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'navbar') {
      return <NavbarEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'contact') {
      return <ContactEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'videoTestimonials') {
      return <VideoTestimonialsEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'comparison') {
      return <ComparisonEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'nutrientComparison') {
      return <NutrientComparisonEditor content={content} onChange={setContent} />;
    }
    if (activeSection === 'footer') {
      return (
        <GenericImageSectionEditor
          sectionName="footer"
          content={content}
          onChange={setContent}
          imageField="logoUrl"
          imageLabel="Footer Logo"
          textFields={[
            { key: 'copyright', label: 'Copyright Text' },
            { key: 'newsletterPlaceholder', label: 'Newsletter Placeholder' },
            { key: 'newsletterButton', label: 'Newsletter Button' },
          ]}
        />
      );
    }

    const fields = Object.entries(content);
    if (fields.length === 0) {
      return <p className="text-gray-500 text-sm">No content yet. Add fields below.</p>;
    }

    return fields.map(([key, value]) => {
      if (typeof value === 'string' && IMAGE_FIELD_KEYS.includes(key)) {
        return (
          <ImageUploadField
            key={key}
            label={key.replace(/([A-Z])/g, ' $1')}
            value={value}
            onChange={(url) => updateField(key, url)}
            onUpload={uploadSectionImage}
          />
        );
      }
      if (typeof value === 'string') {
        return (
          <div key={key}>
            <label className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            {value.length > 100 ? (
              <textarea className="input-field mt-1" rows={3} value={value} onChange={(e) => updateField(key, e.target.value)} />
            ) : (
              <input className="input-field mt-1" value={value} onChange={(e) => updateField(key, e.target.value)} />
            )}
          </div>
        );
      }
      if (typeof value === 'boolean') {
        return (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={value} onChange={(e) => updateField(key, e.target.checked)} />
            {key}
          </label>
        );
      }
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        return (
          <div key={key} className="border rounded-lg p-4">
            <label className="text-sm font-semibold capitalize mb-2 block">{key.replace(/([A-Z])/g, ' $1')}</label>
            <textarea
              className="input-field font-mono text-xs"
              rows={8}
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try { updateField(key, JSON.parse(e.target.value)); } catch { /* ignore */ }
              }}
            />
          </div>
        );
      }
      return null;
    });
  };

  const homepageSections = ['heroSection', 'benefitsGrid', 'bestSellers', 'blogSection', 'ctaBanner'];
  const productSections = ['statsSection', 'goldStandard', 'scienceStats', 'comparison', 'videoTestimonials', 'nutrientComparison', 'reviewsSection'];
  const layoutSections = ['announcement', 'faq', 'navbar', 'footer', 'contact'];

  const renderNavGroup = (title: string, names: string[]) => (
    <>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 px-3 pt-3 pb-1">{title}</p>
      {names.map((name) => (
        <button
          key={name}
          onClick={() => setActiveSection(name)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
            activeSection === name ? 'bg-green-700 text-white' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {SECTION_LABELS[name] || name}
        </button>
      ))}
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Sections Editor</h1>
        <button onClick={handleSave} disabled={saving} className="btn-admin">{saving ? 'Saving...' : 'Save Section'}</button>
      </div>

      <div className="flex gap-6">
        <div className="w-56 shrink-0 space-y-1">
          {renderNavGroup('Homepage', homepageSections)}
          {renderNavGroup('Product Page', productSections)}
          {renderNavGroup('Layout', layoutSections)}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="card space-y-4">
            <h2 className="font-semibold text-lg">{SECTION_LABELS[activeSection]}</h2>
            <SectionVisibilityToggle isVisible={isVisible} onChange={setIsVisible} />
            {renderEditor()}
          </div>
          <SectionPreview sectionName={activeSection} content={content} />
        </div>
      </div>
    </div>
  );
}
