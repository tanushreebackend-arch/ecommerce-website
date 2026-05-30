'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import SectionHeading from '@/components/SectionHeading';
import ScrollReveal from '@/components/ScrollReveal';
import { BRAND_PATH } from '@/lib/routes';

export default function VideoTestimonials() {
  const pathname = usePathname();
  const productHref = pathname === BRAND_PATH ? '/#product' : '#product';
  const { settings } = useSettings();
  const content = settings?.sections?.videoTestimonials?.content as Record<string, unknown> | undefined;
  const videos = (settings?.videos || []) as { slot: number; cloudinaryUrl?: string; thumbnailUrl?: string }[];
  const [playing, setPlaying] = useState<number | null>(null);

  if (!content) return null;

  const placeholders = (content.placeholderImages as string[]) || [];
  const slots = [1, 2, 3, 4].map((slot) => videos.find((v) => v.slot === slot));

  return (
    <section className="section-padding luxury-section-white">
      <ScrollReveal>
        <div className="container-main">
          <SectionHeading label="REAL STORIES">
            {(content.headingLine1 as string) || 'Real Stories, Real Results'}
          </SectionHeading>
          <p className="text-center font-heading text-xl md:text-[28px] font-normal text-[var(--color-heading)] mb-6">
            {(content.headingLine2 as string) || 'How NOW Foods SAMe Is Changing Lives'}
          </p>

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

          <div className="text-center mt-6">
            <a href={productHref} className="btn-primary inline-block px-10 py-4 uppercase tracking-wide text-sm">
              {(content.ctaText as string) || 'BUY NOW & SAVE'}
            </a>
          </div>
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
        <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5] text-[#999999] text-sm">No video</div>
      )}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
          <div className="w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play size={22} className="text-[#0A0A0A] ml-1" fill="currentColor" />
          </div>
        </div>
      )}
    </div>
  );
}
