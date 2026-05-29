interface ShippingSettings {
  freeShippingThreshold?: number | string;
  sections?: Record<string, { content?: Record<string, unknown> }>;
}

/** Single source of truth: announcement bar threshold syncs with cart/checkout. */
export function getFreeShippingThreshold(settings: ShippingSettings | null | undefined): number {
  const announcement = settings?.sections?.announcement?.content;

  if (announcement?.shippingThreshold != null && announcement.shippingThreshold !== '') {
    const n = Number(announcement.shippingThreshold);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  if (settings?.freeShippingThreshold != null && settings.freeShippingThreshold !== '') {
    const n = Number(settings.freeShippingThreshold);
    if (!Number.isNaN(n) && n > 0) return n;
  }

  const text = (announcement?.text as string) || '';
  const match = text.match(/[₹$]\s*([\d,]+)/);
  if (match) {
    const n = Number(match[1].replace(/,/g, ''));
    if (!Number.isNaN(n) && n > 0) return n;
  }

  return 499;
}

export function formatFreeShippingAmount(threshold: number): string {
  return `₹${threshold.toLocaleString('en-IN')}`;
}

/** Keeps announcement copy in sync with the numeric threshold. */
export function getAnnouncementText(settings: ShippingSettings | null | undefined): string {
  const threshold = getFreeShippingThreshold(settings);
  const amount = formatFreeShippingAmount(threshold);
  const announcement = settings?.sections?.announcement?.content;
  const customText = (announcement?.text as string) || '';

  if (customText && /[₹$]\s*[\d,]+/.test(customText)) {
    return customText.replace(/[₹$]\s*[\d,]+/, amount);
  }

  return `FREE SHIPPING ON ALL ORDERS ABOVE ${amount}`;
}

export function buildAnnouncementText(threshold: number, template?: string): string {
  const amount = formatFreeShippingAmount(threshold);
  if (template && /[₹$]\s*[\d,]+/.test(template)) {
    return template.replace(/[₹$]\s*[\d,]+/, amount);
  }
  return `FREE SHIPPING ON ALL ORDERS ABOVE ${amount}`;
}
