'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import api from '@/lib/api';

interface SiteSettings {
  product: Record<string, unknown>;
  packs: Record<string, unknown>[];
  sections: Record<string, { content: Record<string, unknown>; isVisible?: boolean }>;
  theme: Record<string, unknown>;
  videos: Record<string, unknown>[];
  freeShippingThreshold: number;
  policies: Record<string, unknown>;
}

const SettingsContext = createContext<{
  settings: SiteSettings | null;
  loading: boolean;
  refresh: () => void;
}>({ settings: null, loading: true, refresh: () => {} });

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const data = await api.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Refresh settings periodically and when tab regains focus (picks up admin changes)
  useEffect(() => {
    const interval = setInterval(fetchSettings, 30000);
    const onFocus = () => fetchSettings();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
