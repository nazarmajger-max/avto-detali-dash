import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { BrandGrid } from '@/components/BrandGrid';
import { CategorySection } from '@/components/CategorySection';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { WhyUsSection } from '@/components/WhyUsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BrandGrid />
        <CategorySection />
        <FeaturedProducts />
        <WhyUsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
