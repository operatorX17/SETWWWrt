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

  // Filter products for different rails - UPDATED
  const affordableProducts = filterByPriceRange(products, 0, 999);
  const rebelCore = products.filter(p => 
    (p.collection === 'REBELLION CORE') || 
    (p.badges && p.badges.includes('REBELLION CORE'))
  );
  const homepageFeaturedHoodies = products.filter(p => 
    p.category === 'Hoodies' && 
    p.badges && p.badges.includes('HOMEPAGE FEATURED')
  );
  const vaultProducts = products.filter(p => p.badges && p.badges.includes('VAULT'));
  const premiumProducts = products.filter(p => 
    (p.collection === 'PREMIUM COLLECTION') || 
    (p.badges && p.badges.includes('PREMIUM')) ||
    (p.price >= 1200 && p.price <= 1700)
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Teaser Video Section */}
      <TeaserVideo />
      
      <Header />
      
      {/* Conversion Optimized Hero Section */}
      <ConversionOptimizedHero />

      {/* Trust Strip - REPLACE HEAVY DELIVERY PROMISE */}
      <TrustStrip />
      
      {/* Bundle Suggestions from Premium Catalog */}
      <BundleSuggestions />
      
      {/* New Teaser Section */}
      <NewTeaser />
      



      
      {/* Homepage Featured Hoodies - MOVED UP FOR BETTER VISIBILITY */}
      {homepageFeaturedHoodies.length > 0 && (
        <Rail 
          title="FEATURED HOODIES — BATTLE READY" 
          subtitle="Premium gear for the frontlines. Where the money is."
          products={homepageFeaturedHoodies.slice(0, 6)}
          showViewAll={true}
          viewAllLink="/shop?category=hoodies"
        />
      )}
      
      {/* Premium Product Showcase */}
      <PremiumShowcase />
      
      {/* Premium Collection Rail - MOVED UP */}
      <Rail 
        title="Premium Collection — Elite Gear" 
        subtitle="High-value products for serious rebels"
        products={premiumProducts.length > 0 ? premiumProducts.slice(0, 8) : products.filter(p => p.price >= 1200)}
        showViewAll={true}
        viewAllLink="/shop?filter=premium"
      />
      
      {/* Animated UGC Strip */}
      <AnimatedUGCStrip />
      
      {/* Vault Section */}
      <VaultSection />
      
      {/* Under ₹999 - REPOSITIONED BUT STILL VISIBLE */}
      <Under999Section products={affordableProducts} />
      
      {/* Featured Poster Collection - MOVED DOWN */}
      <PosterShowcase />
      
      {/* Rebellion Core Rails */}
      <Rail 
        title="REBELLION CORE — ESSENTIAL GEAR" 
        subtitle="Tees under ₹999. Built for rebels."
        products={rebelCore.length > 0 ? rebelCore.slice(0, 8) : products.slice(0, 8)}
        showViewAll={true}
        viewAllLink="/shop?filter=rebellion-core"
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