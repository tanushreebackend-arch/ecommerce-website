'use client';

import { useSettings } from '@/context/SettingsContext';

export function useSection(name: string) {
  const { settings } = useSettings();
  const section = settings?.sections?.[name];
  const isVisible = section?.isVisible !== false;
  const content = (section?.content || {}) as Record<string, unknown>;

  return { content, isVisible, section };
}
