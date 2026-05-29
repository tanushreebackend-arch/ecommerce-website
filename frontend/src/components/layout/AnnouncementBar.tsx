'use client';

import { useSettings } from '@/context/SettingsContext';
import { resolveAnnouncementStyle } from '@/lib/themeColors';
import { getAnnouncementText } from '@/lib/shipping';

export default function AnnouncementBar() {
  const { settings } = useSettings();
  const announcement = settings?.sections?.announcement?.content as Record<string, unknown> | undefined;

  if (!announcement?.visible && announcement?.visible !== undefined) return null;
  if (!settings) return null;

  const text = getAnnouncementText(settings);
  const { backgroundColor, textColor } = resolveAnnouncementStyle(
    announcement?.backgroundColor as string | undefined,
    announcement?.textColor as string | undefined,
  );

  const content = (
    <>
      <span>{text}</span>
      <span className="mx-4 opacity-70" aria-hidden>◆</span>
      <span>Free shipping on qualifying orders</span>
      <span className="mx-4 opacity-70" aria-hidden>◆</span>
    </>
  );

  return (
    <div className="announcement-luxury w-full py-3" style={{ backgroundColor, color: textColor }}>
      <div className="container-main overflow-hidden">
        <div className="announcement-marquee gap-0">
          <span className="inline-flex items-center px-8">{content}{content}</span>
          <span className="inline-flex items-center px-8" aria-hidden>{content}{content}</span>
        </div>
      </div>
    </div>
  );
}
