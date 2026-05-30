'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { useSection } from '@/hooks/useSection';
import { useSettings } from '@/context/SettingsContext';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';
import { BRAND_PATH } from '@/lib/routes';

export default function VideoTestimonials() {
  const pathname = usePathname();
  const productHref = pathname === BRAND_PATH ? '/#product' : '#product';
  const { content, isVisible } = useSection('videoTestimonials');
  const { settings } = useSettings();
  const videos = (settings?.videos || []) as { slot: number; cloudinaryUrl?: string; thumbnailUrl?: string }[];
  const [playing, setPlaying] = useState<number | null>(null);

  if (!isVisible) return null;

  const placeholders = (content.placeholderImages as string[]) || [];
  const slots = [1, 2, 3, 4].map((slot) => videos.find((v) => v.slot === slot));
  const sectionLabel = (content.sectionLabel as string) || 'REAL STORIES';

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label={sectionLabel}>
            {(content.headingLine1 as string) || ''}
          </SectionHeading>
          {(content.headingLine2 as string) && (
            <p className="text-center font-heading text-xl md:text-[28px] font-normal text-[var(--color-heading)] mb-6">
              {content.headingLine2 as string}
            </p>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {slots.map((video, i) => (
              <VideoCard
                key={i}
                url={video?.cloudinaryUrl}
                poster={video?.thumbnailUrl || placeholders[i]}
                placeholderImage={placeholders[i]}
                isPlaying={playing === i}
                onPlay={() => setPlaying(i)}
                onPause={() => setPlaying(null)}
              />
            ))}
          </div>

          {(content.ctaText as string) && (
            <div className="text-center mt-6">
              <a href={productHref} className="product-btn-primary inline-flex w-auto px-10 py-4">
                {content.ctaText as string}
              </a>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}

function VideoCard({
  url,
  poster,
  placeholderImage,
  isPlaying,
  onPlay,
  onPause,
}: {
  url?: string;
  poster?: string;
  placeholderImage?: string;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (!videoRef.current || !url) return;
    if (isPlaying) { videoRef.current.pause(); onPause(); }
    else { videoRef.current.play(); onPlay(); }
  };

  return (
    <div
      className="relative aspect-[9/14] overflow-hidden luxury-card cursor-pointer group"
      onMouseEnter={() => { if (url && videoRef.current) { videoRef.current.play(); onPlay(); } }}
      onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); onPause(); } }}
      onClick={handleClick}
    >
      {url ? (
        <video ref={videoRef} src={url} poster={poster} className="w-full h-full object-cover" loop muted playsInline />
      ) : placeholderImage ? (
        <Image src={placeholderImage} alt="" fill className="object-cover" sizes="280px" quality={100} />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--color-surface)] text-[var(--color-text-secondary)] text-sm">No video</div>
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={22} className="text-[var(--color-heading)] ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
}
