'use client';

import ProductHero from '@/components/product/ProductHero';
import StickyBar from '@/components/product/StickyBar';
import StatsSection from '@/components/sections/StatsSection';
import GoldStandard from '@/components/sections/GoldStandard';
import ScienceStats from '@/components/sections/ScienceStats';
import Comparison from '@/components/sections/Comparison';
import VideoTestimonials from '@/components/sections/VideoTestimonials';
import NutrientComparison from '@/components/sections/NutrientComparison';
import ReviewsSection from '@/components/sections/ReviewsSection';
import { useSettings } from '@/context/SettingsContext';

export default function HomePage() {
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
      <div className="product-page">
      <ProductHero />
      <StatsSection />
      <GoldStandard />
      <ScienceStats />
      <Comparison />
      <VideoTestimonials />
      <NutrientComparison />
      <ReviewsSection />
      </div>
      <StickyBar />
    </>
  );
}
