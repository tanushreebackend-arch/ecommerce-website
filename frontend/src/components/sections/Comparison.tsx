'use client';

import { useId } from 'react';
import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';
import ScrollReveal from '@/components/ScrollReveal';

const ARROW = '#D4A017';
const BOWL_DEFAULT = 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&fit=crop';

const VB = 640;
const CX = 320;
const CY = 288;
const CIRCLE_R = 112;
const OUT = CIRCLE_R + 12;

/** Tips at circle edge */
const T = {
  top: `${CX} ${CY - OUT}`,
  left: `${CX - OUT} ${CY}`,
  right: `${CX + OUT} ${CY}`,
  bl: `${CX - OUT * 0.71} ${CY + OUT * 0.71}`,
  br: `${CX + OUT * 0.71} ${CY + OUT * 0.71}`,
};

/**
 * Arrows run only in the gap between labels and circle — never through text.
 * Starts are inset toward the circle; labels sit on the outer edge.
 */
const ARROW_PATHS = [
  { key: 'top', d: `M ${CX} 86 Q ${CX} 118 ${T.top}` },
  { key: 'left', d: `M 168 278 Q 182 286 ${T.left}` },
  { key: 'right', d: `M 472 278 Q 458 286 ${T.right}` },
  { key: 'bottomLeft', d: `M 172 402 Q 198 388 ${T.bl}` },
  { key: 'bottomRight', d: `M 468 402 Q 442 388 ${T.br}` },
];

const LABEL_STYLE: Record<string, string> = {
  top: 'top-[1%] left-1/2 -translate-x-1/2 w-[52%] text-center',
  left: 'top-[31%] left-[1%] w-[23%] text-left',
  right: 'top-[31%] right-[1%] w-[23%] text-right',
  bottomLeft: 'bottom-[12%] left-[1%] w-[23%] text-left',
  bottomRight: 'bottom-[12%] right-[1%] w-[23%] text-right',
};

const LABEL_BOX = 'bg-white px-1.5 py-1 rounded-sm leading-snug';

interface InfographicLabel {
  position: 'top' | 'left' | 'right' | 'bottomLeft' | 'bottomRight';
  text: string;
}

interface Category {
  name: string;
  bullets: string[];
  product?: string;
  generic?: string;
}

const DEFAULT_INTRO =
  'A daily multivitamin covers basic vitamins — but it does not provide **S-Adenosyl-L-Methionine**, the compound your body uses for methylation and neurotransmitter production.';
const DEFAULT_INTRO_SECONDARY =
  'NOW Foods SAMe 400 mg delivers **stabilized, bioactive SAMe** in one tablet — supporting mood, nervous system health, and joint comfort in a way standard supplements cannot.*';

const DEFAULT_CATEGORIES: Category[] = [
  {
    name: 'Neurotransmitter & Mood Support',
    bullets: [
      'SAMe is required for the synthesis of serotonin, dopamine, and norepinephrine — key mood regulators.*',
      'Supports emotional well-being and mental balance without stimulants.*',
    ],
  },
  {
    name: 'Joint Comfort & Mobility',
    bullets: [
      'Clinical studies suggest SAMe may help alleviate minor aches from overexertion or strain.*',
      'Supports healthy cartilage metabolism for comfortable daily movement.*',
    ],
  },
  {
    name: 'Cellular Methylation',
    bullets: [
      'SAMe donates methyl groups needed for over 200 biochemical reactions in the body.*',
      'Supports brain energy production and healthy cell membrane function.*',
    ],
  },
];

const DEFAULT_LABELS: InfographicLabel[] = [
  { position: 'top', text: 'Stabilized SAMe for mood and emotional well-being*' },
  { position: 'left', text: 'Methylation support for brain chemistry balance*' },
  { position: 'right', text: 'Joint comfort from everyday strain and overexertion*' },
  { position: 'bottomLeft', text: 'Smaller tablet — easier daily compliance*' },
  { position: 'bottomRight', text: '400 mg strength — maximum potency per dose*' },
];

function renderBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function normalizeCategories(raw: Category[]): Category[] {
  if (!raw.length) return DEFAULT_CATEGORIES;
  return raw.map((cat, i) => {
    const fallback = DEFAULT_CATEGORIES[i] ?? DEFAULT_CATEGORIES[DEFAULT_CATEGORIES.length - 1];
    if (cat.bullets?.length >= 2) {
      return { name: cat.name || fallback.name, bullets: cat.bullets };
    }
    const bullets =
      cat.bullets?.length === 1
        ? [cat.bullets[0], fallback.bullets[1]]
        : cat.product
          ? [cat.product, fallback.bullets[1]]
          : fallback.bullets;
    return { name: cat.name || fallback.name, bullets };
  });
}

function BowlInfographic({
  bowlImage,
  brandName,
  labels,
}: {
  bowlImage: string;
  brandName: string;
  labels: InfographicLabel[];
}) {
  const markerId = useId().replace(/:/g, '');
  const getLabel = (pos: string) => labels.find((l) => l.position === pos)?.text || '';
  const isLocal = bowlImage.startsWith('http://localhost');

  const size = ((CIRCLE_R * 2) / VB) * 100;
  const left = ((CX - CIRCLE_R) / VB) * 100;
  const top = ((CY - CIRCLE_R) / VB) * 100;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full max-w-[600px] aspect-square mx-auto px-2 sm:px-4">
        {/* Labels first (behind) with white backing — arrows on top in the gap only */}
        {(Object.keys(LABEL_STYLE) as Array<keyof typeof LABEL_STYLE>).map((pos) => (
          <div key={pos} className={`absolute z-30 pointer-events-none ${LABEL_STYLE[pos]}`}>
            <p className={`text-[11px] sm:text-[12px] font-body text-gray-800 ${LABEL_BOX}`}>
              {getLabel(pos)}
            </p>
          </div>
        ))}

        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="absolute inset-0 w-full h-full z-10 overflow-visible pointer-events-none"
          aria-hidden
        >
          <defs>
            <marker
              id={markerId}
              markerUnits="userSpaceOnUse"
              markerWidth="9"
              markerHeight="7"
              refX="8"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 9 3.5, 0 7" fill={ARROW} />
            </marker>
          </defs>
          {ARROW_PATHS.map(({ key, d }) => (
            <path
              key={key}
              d={d}
              fill="none"
              stroke={ARROW}
              strokeWidth="2"
              strokeLinecap="round"
              markerEnd={`url(#${markerId})`}
            />
          ))}
        </svg>

        {/* Circular center image — admin-editable */}
        <div
          className="absolute z-20 rounded-full overflow-hidden bg-white shadow-[0_4px_18px_rgba(0,0,0,0.08)] ring-[3px] ring-white relative"
          style={{ width: `${size}%`, height: `${size}%`, left: `${left}%`, top: `${top}%` }}
        >
          <Image
            src={bowlImage}
            alt={brandName}
            fill
            className="object-cover"
            sizes="240px"
            quality={100}
            unoptimized={isLocal}
          />
        </div>
      </div>

      <p className="mt-4 font-heading font-bold text-xl sm:text-2xl text-gray-900 text-center tracking-tight">
        {brandName}
      </p>
    </div>
  );
}

export default function Comparison() {
  const { settings } = useSettings();
  const content = settings?.sections?.comparison?.content as Record<string, unknown> | undefined;
  if (!content) return null;

  const infographic = (content.infographic as {
    centerImage?: string;
    brandName?: string;
    labels?: InfographicLabel[];
  }) || {};

  const isLegacyContent =
    String(content.intro || '').includes('Bee Pearl') ||
    String(content.intro || '').includes('pre-digested superfood') ||
    String(content.heading || '').includes('Multivitamin');

  const rawCategories = (content.categories as Category[]) || [];
  const categories = isLegacyContent
    ? DEFAULT_CATEGORIES
    : normalizeCategories(rawCategories.length ? rawCategories : DEFAULT_CATEGORIES);

  const labels = isLegacyContent ? DEFAULT_LABELS : infographic.labels?.length ? infographic.labels : DEFAULT_LABELS;
  const bowlImage = infographic.centerImage || BOWL_DEFAULT;
  const brandName = isLegacyContent ? 'NOW Foods' : infographic.brandName || 'NOW Foods';
  const heading = isLegacyContent
    ? "Why SAMe Is Different From a Basic Multivitamin"
    : (content.heading as string) || "Why SAMe Is Different From a Basic Multivitamin";
  const intro = isLegacyContent ? DEFAULT_INTRO : (content.intro as string) || DEFAULT_INTRO;
  const introSecondary = isLegacyContent ? DEFAULT_INTRO_SECONDARY : (content.introSecondary as string) || DEFAULT_INTRO_SECONDARY;

  return (
    <section className="section-padding luxury-section-cream luxury-texture overflow-hidden">
      <ScrollReveal>
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-start">
            <div className="order-1">
              <h2 className="font-heading text-2xl md:text-3xl lg:text-[2rem] font-bold text-gray-900 mb-6 leading-tight">
                {heading}
              </h2>
              <div className="space-y-4 text-[15px] leading-relaxed font-body text-gray-800 mb-8">
                <p dangerouslySetInnerHTML={{ __html: renderBold(intro) }} />
                <p dangerouslySetInnerHTML={{ __html: renderBold(introSecondary) }} />
              </div>
              <div className="space-y-6">
                {categories.map((cat, i) => (
                  <div key={i}>
                    <h3 className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wide text-gray-900 mb-2">
                      {cat.name}:
                    </h3>
                    <ul className="space-y-2">
                      {(cat.bullets || []).map((bullet, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-[15px] font-body text-gray-800 leading-relaxed">
                          <span className="shrink-0 text-base leading-none mt-0.5" style={{ color: ARROW }}>
                            ●
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-2 lg:sticky lg:top-24 overflow-visible py-2">
              <BowlInfographic bowlImage={bowlImage} brandName={brandName} labels={labels} />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
