import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFilteredProductsWithUnlock } from '../hooks/useProducts';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PremiumProductCard from '../components/PremiumProductCard';

const Shop = () => {
  const { category } = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    if (category) return category;
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    return filter || 'all';
  });

  useEffect(() => {
    if (category) {
      setActiveTab(category);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const filter = urlParams.get('filter');
      const categoryParam = urlParams.get('category');
      const collection = urlParams.get('collection');
      
      // Handle collection parameter
      if (collection === 'premium-collection') {
        setActiveTab('premium');
      } else {
        setActiveTab(filter || categoryParam || 'all');
      }
    }
  }, [category]);

  // EXCLUSIVE TABS - UNIQUE PRODUCT DISTRIBUTIONS
  const tabs = [
    { id: 'all', label: 'ALL ARSENAL', filter: null },
    { id: 'vault', label: '🔒 VAULT EXCLUSIVE', filter: 'vault' },
    { id: 'rebellion-core', label: 'REBELLION CORE', filter: 'rebellion-core' },
    { id: 'premium', label: 'PREMIUM COLLECTION', filter: 'premium' },
    { id: 'tees', label: 'TACTICAL TEES', filter: 'tees' },
    { id: 'hoodies', label: 'BATTLE HOODIES', filter: 'hoodies' },
    { id: 'accessories', label: 'GEAR & ARSENAL', filter: 'accessories' },
    { id: 'posters', label: 'WAR POSTERS', filter: 'posters' }
  ];

  const getFilterForTab = () => {
    switch (activeTab) {
      case 'vault':
        return { type: 'vault' };
      case 'rebellion-core':
        return { type: 'collection', value: 'REBELLION CORE' };
      case 'premium':
        return { type: 'collection', value: 'PREMIUM COLLECTION' };
      case 'tees':
        return { type: 'category', value: 'teeshirt' };
      case 'hoodies':
        return { type: 'category', value: 'hoodies' };
      case 'accessories':
        return { type: 'category', value: 'accessories' };
      case 'posters':
        return { type: 'category', value: 'posters' };
      default:
        return { type: 'all' };
    }
  };

  const { products: allProducts, loading, error } = useFilteredProductsWithUnlock(
    null, // Get all products
    null,
    true // Include vault products for filtering
  );

  // Apply exclusive filtering based on active tab
  const filteredProducts = React.useMemo(() => {
    if (!allProducts) return [];
    
    const filter = getFilterForTab();

    // Category alias maps for robust matching
    const categoryAliases = {
      teeshirt: ['teeshirt', 'tee shirts', 'tee'],
      hoodies: ['hoodies', 'hoodie', 'sweatshirts'],
      accessories: ['accessories', 'wallet', 'hats', 'slippers'],
      posters: ['posters', 'poster']
    };
    
    switch (filter.type) {
      case 'vault':
        return allProducts.filter(p => 
          p.vault_locked || 
          (p.badges && p.badges.includes('VAULT')) ||
          (p.collection === 'VAULT EXCLUSIVE')
        );
      
      case 'collection':
        if (filter.value === 'REBELLION CORE') {
          // Special handling for REBELLION CORE - match REBEL DROP products
          return allProducts.filter(p => 
            p.collection === 'REBELLION CORE' ||
            p.collection === 'REBEL DROP'
          );
        }
        return allProducts.filter(p => p.collection === filter.value);
      
      default:
        return allProducts;
    }
  }, [allProducts, activeTab]);

  // Get current tab info for display
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const newUrl = tabId === 'all' ? '/shop' : `/shop?filter=${tabId}`;
    window.history.replaceState(null, '', newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-bold uppercase tracking-wider text-white">Loading Arsenal...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="bg-gradient-to-r from-orange-900 via-black to-orange-900 text-white py-16 -mx-6 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                🔥 PSPK × OG OFFICIAL STORE
              </h1>
              <p className="text-xl md:text-2xl text-orange-300 mb-2">
                They Call Him OG - Power Star Pawan Kalyan Official Merchandise
              </p>
              <p className="text-lg text-gray-300 mb-8">
                {currentTab.description} {currentTab.priceRange && `• ${currentTab.priceRange}`}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 md:gap-8 border-b border-gray-800 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`text-sm md:text-base font-medium uppercase tracking-wider transition-colors duration-200 ${
                  tab.id === 'vault' 
                    ? `${activeTab === tab.id 
                        ? 'text-yellow-400 border-b-2 border-yellow-400 pb-2' 
                        : 'text-yellow-400 hover:text-yellow-300'}`
                    : `${activeTab === tab.id
                        ? 'text-white border-b-2 border-red-500 pb-2'
                        : 'text-gray-500 hover:text-gray-300'}`
                }`}
              >
                {tab.id === 'vault' ? '🔒 ' : ''}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredProducts.map((product, index) => (
            <PremiumProductCard key={`${product.id || product.handle || 'product'}-${index}`} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4 text-white">No Products Found</h3>
            <button
              onClick={() => handleTabClick('all')}
              className="text-white hover:text-gray-300 underline"
            >
              View all products
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;