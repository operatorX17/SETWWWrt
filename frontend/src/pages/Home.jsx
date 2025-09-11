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

  const handleCommunityConsent = (consented) => {
    if (consented) {
      console.log('User consented to community');
    }
    setCommunityModalOpen(false);
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
      {/* Teaser Video Section - DISABLED FOR DEBUGGING */}
      {/* <TeaserVideo /> */}
      
      <Header />
      
      {/* SAFE TEST - Using safe products array */}
      <div className="pt-20">
        <Rail 
          title="OG PRODUCTS — REAL PRODUCTS TEST" 
          subtitle={`Found ${safeProducts.length} products from catalog`}
          products={safeProducts.slice(0, 6)}
          showViewAll={true}
          viewAllLink="/shop"
          prioritizeBackImages={true}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Home;