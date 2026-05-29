'use client';

import { Check } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_AUDIENCES = [
  'Adults seeking natural mood and emotional well-being support*',
  'People experiencing occasional joint stiffness from daily activity or exercise',
  'Busy professionals who want mental clarity without stimulants',
  'Active individuals looking for joint comfort from everyday strain',
  'Anyone interested in methylation support for whole-body wellness',
];

const DEFAULT_INTRO =
  'NOW Foods SAMe 400 mg is designed for adults who want targeted support for mood, nervous system health, and joint comfort — in one convenient daily tablet.*';

const DEFAULT_DISCLAIMER =
  'Note: Do not use if you have bipolar disorder. Consult your physician before use if pregnant, nursing, or taking antidepressants or other prescription medications.';

export default function WhoCanUse() {
  const { settings } = useSettings();
  const raw = settings?.sections?.whoCanUse?.content as Record<string, unknown> | undefined;
  if (!raw) return null;

  const isLegacy =
    String(raw.intro || '').includes('ultimate multivitamin') ||
    String(raw.disclaimer || '').includes('bee product') ||
    ((raw.audiences as string[]) || []).some((a) => a.includes('bee pollen') || a.includes('Immune-Conscious'));

  const audiences = isLegacy
    ? DEFAULT_AUDIENCES
    : (raw.audiences as string[])?.length
      ? (raw.audiences as string[])
      : DEFAULT_AUDIENCES;
  const heading = (raw.heading as string) || 'Who Can Use It?';
  const intro = isLegacy ? DEFAULT_INTRO : (raw.intro as string) || DEFAULT_INTRO;
  const disclaimer = isLegacy ? DEFAULT_DISCLAIMER : (raw.disclaimer as string) || DEFAULT_DISCLAIMER;

  return (
    <section className="section-padding bg-white">
      <ScrollReveal>
        <div className="container-main max-w-3xl">
          <SectionHeading centered className="mb-6">{heading}</SectionHeading>
          <p className="text-[15px] text-gray-700 leading-relaxed font-body text-center mb-6">{intro}</p>
          <p className="font-heading font-semibold text-gray-900 mb-4">It is especially helpful for:</p>
          <ul className="space-y-3 mb-6">
            {audiences.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] font-body text-gray-800">
                <Check size={18} className="text-brand mt-0.5 shrink-0 stroke-[3]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 font-body italic text-center">{disclaimer}</p>
        </div>
      </ScrollReveal>
    </section>
  );
}
