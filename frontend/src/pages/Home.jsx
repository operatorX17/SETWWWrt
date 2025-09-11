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
    error, 
    getBestProducts,
    getPremiumProducts,
    getAffordableProducts,
    getProductsByCategory,
    getProductsByCollection,
    getProductsByBadge
  } = useProducts();
  
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  const handleCommunityConsent = (consented) => {
    if (consented) {
      console.log('User consented to community');
    }
    setCommunityModalOpen(false);
  };

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

  // Smart product filtering with fallbacks
  const getSmartProducts = (filterFn, fallbackFn, limit = 8) => {
    const filtered = filterFn();
    if (filtered.length >= 3) {
      return filtered.slice(0, limit);
    }
    return fallbackFn().slice(0, limit);
  };

  // Get products for different rails with intelligent fallbacks
  const featuredHoodies = getSmartProducts(
    () => getProductsByCategory('hoodie').filter(p => p.badges.includes('BEST_SELLER')),
    () => getProductsByCategory('hoodie'),
    6
  );

  const premiumProducts = getSmartProducts(
    () => getPremiumProducts(8),
    () => products.filter(p => p.price >= 1000).slice(0, 8),
    8
  );

  const rebelCore = getSmartProducts(
    () => getProductsByCollection('REBELLION CORE'),
    () => getAffordableProducts(8),
    8
  );

  const vaultProducts = getSmartProducts(
    () => getProductsByBadge('VAULT_EXCLUSIVE'),
    () => products.filter(p => p.price >= 2000).slice(0, 6),
    6
  );

  const bestSellers = getSmartProducts(
    () => getBestProducts(8),
    () => products.slice(0, 8),
    8
  );

  // Featured products for hero (best scoring products with back images prioritized)
  const heroProducts = products
    .filter(p => p.showBackFirst || p.images.length > 0)
    .sort((a, b) => (b.merch_score || 0) - (a.merch_score || 0))
    .slice(0, 4);

  console.log('🏠 Homepage product distribution:');
  console.log('- Featured Hoodies:', featuredHoodies.length);
  console.log('- Premium Products:', premiumProducts.length);  
  console.log('- Rebellion Core:', rebelCore.length);
  console.log('- Vault Products:', vaultProducts.length);
  console.log('- Best Sellers:', bestSellers.length);
  console.log('- Hero Products:', heroProducts.length);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Teaser Video Section */}
      <TeaserVideo />
      
      <Header />
      
      {/* Conversion Optimized Hero Section */}
      <ConversionOptimizedHero />

      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Bundle Suggestions */}
      <BundleSuggestions />
      
      {/* New Teaser Section */}
      <NewTeaser />
      
      {/* BEST SELLERS RAIL - TOP PRIORITY */}
      {bestSellers.length > 0 && (
        <Rail 
          title="BEST SELLERS — FAN FAVORITES" 
          subtitle="Most loved by the OG army. Back views featured."
          products={bestSellers}
          showViewAll={true}
          viewAllLink="/shop?filter=best-sellers"
          prioritizeBackImages={true}
        />
      )}
      
      {/* FEATURED HOODIES - BATTLE READY */}
      {featuredHoodies.length > 0 && (
        <Rail 
          title="BATTLE HOODIES — FRONT LINE GEAR" 
          subtitle="Premium hoodies with back designs shown first"
          products={featuredHoodies}
          showViewAll={true}
          viewAllLink="/shop?category=hoodies"
          prioritizeBackImages={true}
        />
      )}
      
      {/* Premium Product Showcase */}
      <PremiumShowcase />
      
      {/* PREMIUM COLLECTION RAIL */}
      {premiumProducts.length > 0 && (
        <Rail 
          title="PREMIUM COLLECTION — ELITE ARSENAL" 
          subtitle="High-value gear for serious rebels"
          products={premiumProducts}
          showViewAll={true}
          viewAllLink="/shop?filter=premium"
        />
      )}
      
      {/* Animated UGC Strip */}
      <AnimatedUGCStrip />
      
      {/* VAULT SECTION */}
      {vaultProducts.length > 0 && (
        <>
          <VaultSection />
          <Rail 
            title="VAULT EXCLUSIVE — LIMITED ACCESS" 
            subtitle="Rare gear for the elite army"
            products={vaultProducts}
            showViewAll={true}
            viewAllLink="/shop?filter=vault"
            prioritizeBackImages={true}
          />
        </>
      )}
      
      {/* Under ₹999 Section */}
      <Under999Section products={getAffordableProducts(12)} />
      
      {/* Featured Poster Collection */}
      <PosterShowcase />
      
      {/* REBELLION CORE RAILS */}
      {rebelCore.length > 0 && (
        <Rail 
          title="REBELLION CORE — ESSENTIAL GEAR" 
          subtitle="Core collection under ₹999. Built for rebels."
          products={rebelCore}
          showViewAll={true}
          viewAllLink="/shop?filter=rebellion-core"
        />
      )}

      {/* Emergency fallback rail if nothing else shows */}
      {(bestSellers.length === 0 && featuredHoodies.length === 0 && premiumProducts.length === 0) && (
        <Rail 
          title="OG ARSENAL — ALL GEAR" 
          subtitle="Complete collection of premium OG merchandise"
          products={products.slice(0, 12)}
          showViewAll={true}
          viewAllLink="/shop"
          prioritizeBackImages={true}
        />
      )}

      {/* Community Modal */}
      <PSPKCommunityModal
        isOpen={communityModalOpen}
        onClose={() => setCommunityModalOpen(false)}
        onConsent={handleCommunityConsent}
      />

      <Footer />
    </div>
  );
};

export default Home;