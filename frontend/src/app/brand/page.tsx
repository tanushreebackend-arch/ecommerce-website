'use client';

import MarketingHero from '@/components/sections/MarketingHero';
import BrandResultsSection from '@/components/sections/BrandResultsSection';
import BrandContactSection from '@/components/sections/BrandContactSection';
import { useSettings } from '@/context/SettingsContext';

export default function BrandPage() {
  const { loading } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <MarketingHero />
      <BrandResultsSection />
      <BrandContactSection />
    </>
  );
}
