import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';
import PSPKCommunityModal from '../components/PSPKCommunityModal';
import TeaserVideo from '../components/TeaserVideo';
import NewTeaser from '../components/OG/NewTeaser';
import ConversionOptimizedHero from '../components/ConversionOptimizedHero';
import PremiumShowcase from '../components/OG/PremiumShowcase';
import PosterShowcase from '../components/OG/PosterShowcase';
import AnimatedUGCStrip from '../components/ConversionElements/AnimatedUGCStrip';
import VaultSection from '../components/ConversionElements/VaultSection';
import TrustStrip from '../components/ConversionElements/TrustStrip';
import Under999Section from '../components/Under999Section';
import BundleSuggestions from '../components/BundleSuggestions';

const Home = () => {
  const { 
    products, 
    loading, 
    error
  } = useProducts();
  
  const [communityModalOpen, setCommunityModalOpen] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);

  const handleCommunityConsent = (consented) => {
    if (consented) {
      console.log('User consented to community');
    }
    setCommunityModalOpen(false);
  };

  const handleEnterVault = () => {
    // Show navigation and scroll to next section
    setShowNavigation(true);
    
    // Smooth scroll to next section
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Debug logging
  console.log('🏠 Home component render - Products:', products?.length || 0);
  console.log('🏠 Loading:', loading, 'Error:', error);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-bold uppercase tracking-wider">Loading OG Arsenal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold uppercase tracking-wider text-red-400">Arsenal Temporarily Offline</p>
          <p className="text-gray-400 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use safe fallback for products
  const safeProducts = products || [];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Teaser Video Section - With working video */}
      <TeaserVideo onEnterVault={handleEnterVault} />
      
      {/* Header - Only show after "Enter the Vault" is clicked */}
      {showNavigation && <Header />}
      
      {/* MAIN PRODUCT RAILS - Only show after navigation appears */}
      {showNavigation && (
        <div className="pt-20">
          {/* Primary Rail - All Products */}
          <Rail 
            title="OG ARSENAL — COMPLETE COLLECTION" 
            subtitle={`Discover ${safeProducts.length} premium OG products with back images prioritized`}
            products={safeProducts.slice(0, 8)}
            showViewAll={true}
            viewAllLink="/shop"
            prioritizeBackImages={true}
          />
          
          {/* Second Rail - Premium Products */}
          <Rail 
            title="PREMIUM COLLECTION — ELITE GEAR" 
            subtitle="High-value products for the ultimate fan experience"
            products={safeProducts.filter(p => p.price >= 1000).slice(0, 6)}
            showViewAll={true}
            viewAllLink="/shop?filter=premium"
            prioritizeBackImages={true}
          />
          
          {/* Third Rail - Affordable Products */}
          <Rail 
            title="ESSENTIAL GEAR — UNDER ₹999" 
            subtitle="Core collection for every OG soldier"
            products={safeProducts.filter(p => p.price < 999).slice(0, 8)}
            showViewAll={true}
            viewAllLink="/shop?filter=under-999"
            prioritizeBackImages={true}
          />
        </div>
      )}

      {/* Footer - Only show after navigation appears */}
      {showNavigation && <Footer />}
    </div>
  );
};

export default Home;