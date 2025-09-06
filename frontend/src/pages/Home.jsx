import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/price';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';
import PSPKCommunityModal from '../components/PSPKCommunityModal';
import AnimatedUGCStrip from '../components/ConversionElements/AnimatedUGCStrip';
import VaultSection from '../components/ConversionElements/VaultSection';
import TrustStrip from '../components/ConversionElements/TrustStrip';

const Home = () => {
  const { products, loading, error } = useProducts();
  const [communityModalOpen, setCommunityModalOpen] = useState(false);

  const handleCommunityConsent = (consented) => {
    if (consented) {
      // Handle community consent logic here
      console.log('User consented to community');
    }
    setCommunityModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[var(--color-red)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-bold uppercase tracking-wider">Loading Arsenal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold uppercase tracking-wider text-red-400">Arsenal Temporarily Offline</p>
          <p className="text-gray-400 mt-2">Try again in a moment</p>
        </div>
      </div>
    );
  }

  // Filter products for different rails - SIMPLE
  const affordableProducts = filterByPriceRange(products, 999);
  const rebelCore = products.filter(p => p.badges && (p.badges.includes('REBEL DROP') || p.badges.includes('FAN ARSENAL')));
  const vaultProducts = products.filter(p => p.badges && p.badges.includes('PREMIUM'));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      {/* Hero Section - IMPROVED READABILITY */}
      <section className="bg-black text-white py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background with better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl lg:text-8xl xl:text-9xl font-black uppercase tracking-wider leading-tight mb-6 sm:mb-8 font-headline text-white drop-shadow-2xl">
              EVERY FAN<br />
              <span className="text-red-500 drop-shadow-2xl">IS A SOLDIER.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-100 mb-4 max-w-3xl mx-auto font-medium leading-relaxed">
              Premium fanwear. No drama. Real respect.
            </p>
            <p className="text-yellow-400 font-bold text-base sm:text-lg mb-8 drop-shadow-lg">
              ప్రతి అభిమాని ఒక సైనికుడు. ARM UP.
            </p>

            {/* Single CTA - Responsive */}
            <button className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-lg sm:text-xl transition-all shadow-2xl hover:shadow-red-500/25 min-h-[48px] touch-manipulation">
              ARM UP
            </button>
          </div>
        </div>
      </section>

      {/* Trust Strip - REPLACE HEAVY DELIVERY PROMISE */}
      <TrustStrip />
      
      {/* FIRST RAIL: Under ₹999 - AS REQUESTED */}
      <Rail 
        title="UNDER ₹999 — FOR EVERY REBEL" 
        subtitle="Cheap doesn't mean weak. Gear up."
        products={affordableProducts.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=under-999"
      />
      
      {/* Animated UGC Strip */}
      <AnimatedUGCStrip />
      
      {/* Vault Section */}
      <VaultSection />
      
      {/* Other Rails */}
      <Rail 
        title="REBELLION CORE — ESSENTIAL GEAR" 
        products={rebelCore.length > 0 ? rebelCore.slice(0, 8) : products.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=rebellion-core"
      />
      
      <Rail 
        title="Premium Collection" 
        products={vaultProducts.length > 0 ? vaultProducts : products.filter(p => p.price >= 2000)}
        showViewAll={true}
        viewAllLink="/shop?filter=premium"
      />

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