import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/utils';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';
import PSPKCommunityModal from '../components/PSPKCommunityModal';
import TeaserVideo from '../components/TeaserVideo';
import FloatingNavigation from '../components/FloatingNavigation';

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

  // Use safe fallback for products and filter out unwanted ones
  const safeProducts = (products || []).filter(p => 
    !p.title.includes('Cinder Fade') && !p.title.includes('Smoke Trail')
  );

  // Prioritize TEES first, then specific signature hoodies
  const tees = safeProducts.filter(p => p.category === 'tee').slice(0, 8);
  
  // Prioritized signature hoodies - SPECIFIC ORDER
  const priorityHoodieIds = [
    'og-hoodie-brass-mark',
    'og-hoodie-iron-will', 
    'og-hoodie-storm-chase-scene-037',
    'og-hoodie-midnight-prowl-scene-044'
  ];
  
  const priorityHoodies = priorityHoodieIds
    .map(id => safeProducts.find(p => p.id === id || p.id.includes(id.replace(/-scene-\d+/, ''))))
    .filter(Boolean);
  
  // Add other good hoodies if we need more
  const otherHoodies = safeProducts
    .filter(p => 
      p.category === 'hoodie' && 
      !p.title.includes('Cinder Fade') && 
      !p.title.includes('Smoke Trail') &&
      !priorityHoodies.some(priority => priority.id === p.id)
    )
    .slice(0, 2);
  
  const hoodies = [...priorityHoodies, ...otherHoodies].slice(0, 6);
  
  const premiumProducts = safeProducts.filter(p => p.price >= 1000).slice(0, 6);
  const affordableProducts = safeProducts.filter(p => p.price < 999).slice(0, 8);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Teaser Video Section - With working video */}
      <TeaserVideo onEnterVault={handleEnterVault} />
      
      {/* Header - Only show after "Enter the Vault" is clicked */}
      {showNavigation && <Header />}
      
      {/* Floating Navigation - Always visible for easy access */}
      <FloatingNavigation />
      
      {/* MAIN PRODUCT RAILS - Only show after navigation appears */}
      {showNavigation && (
        <div className="pt-20">
          {/* TEES FIRST - As requested */}
          <Rail 
            title="PREMIUM TEES — TOP PICKS" 
            subtitle={`${tees.length} carefully selected tees with square format`}
            products={tees}
            showViewAll={true}
            viewAllLink="/shop?category=tee"
            prioritizeBackImages={true}
          />
          
          {/* GOOD DESIGN HOODIES */}
          <Rail 
            title="SIGNATURE HOODIES — CURATED DESIGNS" 
            subtitle="Premium hoodies with exceptional prints and design"
            products={hoodies}
            showViewAll={true}
            viewAllLink="/shop?category=hoodie"
            prioritizeBackImages={true}
          />
          
          {/* PREMIUM COLLECTION */}
          <Rail 
            title="PREMIUM COLLECTION — ELITE GEAR" 
            subtitle="High-value products for ultimate fan experience"
            products={premiumProducts}
            showViewAll={true}
            viewAllLink="/shop?filter=premium"
            prioritizeBackImages={true}
          />
          
          {/* AFFORDABLE GEAR */}
          <Rail 
            title="ESSENTIAL GEAR — UNDER ₹999" 
            subtitle="Core collection for every fan"
            products={affordableProducts}
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