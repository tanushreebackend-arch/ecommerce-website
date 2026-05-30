'use client';

import { useSettings } from '@/context/SettingsContext';
import { getAnnouncementText } from '@/lib/shipping';

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const announcement = settings?.sections?.announcement?.content as Record<string, unknown> | undefined;

  if (!announcement?.visible && announcement?.visible !== undefined) return null;
  if (!settings) return null;

  const text = getAnnouncementText(settings);

  const content = (
    <>
      <span>{text}</span>
      <span className="mx-4 opacity-70" aria-hidden>◆</span>
      <span>Free shipping on qualifying orders</span>
      <span className="mx-4 opacity-70" aria-hidden>◆</span>
    </>
  );

  return (
    <div className="announcement-luxury w-full">
      <div className="container-main overflow-hidden h-full flex items-center">
        <div className="announcement-marquee gap-0">
          <span className="inline-flex items-center px-8">{content}{content}</span>
          <span className="inline-flex items-center px-8" aria-hidden>{content}{content}</span>
        </div>
      </div>
    </div>
  );
}
