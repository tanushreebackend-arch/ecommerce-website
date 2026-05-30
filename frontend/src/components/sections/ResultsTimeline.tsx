'use client';

import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';
import SectionHeading from '@/components/SectionHeading';

const DEFAULT_STEPS = [
  {
    icon: '📅',
    title: 'In the First Few Days',
    description:
      'SAMe works at the biochemical level — you may not feel dramatic changes immediately. Focus on taking your tablet daily on an empty stomach for best absorption.',
  },
  {
    icon: '📈',
    title: 'After 2–3 Weeks',
    description:
      'Most users begin noticing improved mood balance, clearer mental focus, and more comfortable joint movement. Consistency is key — SAMe needs time to build up in your system.',
  },
  {
    icon: '🔄',
    title: 'With Ongoing Use',
    description:
      'Long-term SAMe users report a sustained sense of emotional well-being, sharper daily focus, and easier mobility — a new baseline of mind-and-body balance they can feel every day.*',
  },
];

export default function ResultsTimeline() {
  const { settings } = useSettings();
  const raw = settings?.sections?.resultsTimeline?.content as Record<string, unknown> | undefined;
  if (!raw) return null;

  const apiSteps = (raw.steps as typeof DEFAULT_STEPS) || [];
  const isLegacy =
    apiSteps.some((s) => String(s.description || '').includes('Bee Pearl') || String(s.description || '').includes('2 PM wall')) ||
    apiSteps.some((s) => s.title === 'First Few Days');
  const steps = isLegacy || apiSteps.length < 3 ? DEFAULT_STEPS : apiSteps;
  const heading = (raw.heading as string) || 'When Will I See Results?';

  return (
    <section className="section-padding section-alt">
      <ScrollReveal>
        <div className="container-main max-w-3xl">
          <SectionHeading centered className="mb-8">{heading}</SectionHeading>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i}>
                <h3 className="font-heading font-normal text-base text-[var(--color-heading)] mb-2">
                  {step.icon} {step.title}
                </h3>
                <p className="text-[15px] text-[#555555] leading-relaxed font-body">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
