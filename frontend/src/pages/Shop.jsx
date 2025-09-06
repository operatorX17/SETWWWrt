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
      setActiveTab(filter || categoryParam || 'all');
    }
  }, [category]);

  // CLEAN TABS - WITHOUT EMOJIS, MATCHING DROPDOWN
  const tabs = [
    { id: 'all', label: 'ALL ARSENAL', filter: null },
    { id: 'vault', label: '🔒 VAULT', filter: 'Vault' },
    { id: 'Tee Shirts', label: 'REBEL TEES', filter: 'Tee Shirts' },
    { id: 'Hoodies', label: 'PREDATOR HOODIES', filter: 'Hoodies' },
    { id: 'Shirts', label: 'FORMAL ARSENAL', filter: 'Shirts' },
    { id: 'Sweatshirts', label: 'COMBAT SWEATS', filter: 'Sweatshirts' },
    { id: 'Posters', label: 'WAR POSTERS', filter: 'Posters' },
    { id: 'Accessories', label: 'GEAR & ACCESSORIES', filter: 'Accessories' }
  ];

  const getCategoryForTab = () => {
    if (activeTab === 'vault') return 'Vault';
    if (activeTab === 'Tee Shirts') return 'Tee Shirts';
    if (activeTab === 'Hoodies') return 'Hoodies';
    if (activeTab === 'Posters') return 'Posters';
    if (activeTab === 'Sweatshirts') return 'Sweatshirts';
    if (activeTab === 'Shirts') return 'Shirts';
    if (activeTab === 'Accessories') return 'Accessories';
    return activeTab === 'all' ? null : activeTab;
  };

  const { products: filteredProducts, loading, error } = useFilteredProductsWithUnlock(
    getCategoryForTab(),
    activeTab === 'vault' ? 'vault' : null,
    activeTab === 'vault' // includeVault only for vault tab
  );

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
        <div className="mb-12">
          <h1 className="text-6xl lg:text-8xl font-black font-headline uppercase tracking-wider leading-none mb-4 text-white">
            ARMORY
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse the arsenal. Every piece forged for rebels.
          </p>
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
          {filteredProducts.map((product) => (
            <PremiumProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4 text-white">No Products Found</h3>
            <button
              onClick={() => handleTabClick('all')}
              className="text-white hover:text-gray-300 underline"
            >
              View all arsenal
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Shop;