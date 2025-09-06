import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { filterByPriceRange } from '../lib/price';
import PremiumProductCard from './PremiumProductCard';
import { ChevronRight, Star, Crown, Zap } from 'lucide-react';

const PremiumMobileHome = () => {
  const { products, loading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [under999Products, setUnder999Products] = useState([]);
  const [vaultProducts, setVaultProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Featured products (first 6)
      setFeaturedProducts(products.slice(0, 6));
      
      // Under 999 products
      const affordable = filterByPriceRange(products, 0, 999);
      setUnder999Products(affordable.slice(0, 8));
      
      // Vault products - filter based on purchase status
      const hasPurchased = localStorage.getItem('user_purchases') !== null;
      const vault = products.filter(p => {
        const isVaultProduct = p.badges?.includes('VAULT') || p.category === 'Vault';
        if (isVaultProduct && p.requires_purchase_unlock === true) {
          return hasPurchased;
        }
        return isVaultProduct;
      });
      setVaultProducts(vault.slice(0, 4));
    }
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="px-4 py-16 text-center bg-gradient-to-br from-black to-gray-900 text-white">
        <h1 className="text-4xl font-black mb-4 leading-tight">
          EVERY FAN<br />
          <span className="text-red-500">IS A SOLDIER</span>
        </h1>
        <p className="text-gray-300 mb-2">Premium fanwear. No drama. Real respect.</p>
        <p className="text-sm text-gray-400 mb-8">ప్రతి అభిమాని ఒక సైనికుడు.</p>
        
        <Link 
          to="/shop"
          className="inline-block bg-red-600 text-white px-8 py-4 rounded-full font-semibold"
        >
          ARM UP
        </Link>
      </section>

      {/* Trust Strip */}
      <section className="px-4 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex justify-center space-x-8 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span>💰</span>
            <span>COD</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚚</span>
            <span>2-5 Days</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🔄</span>
            <span>Easy Swap</span>
          </div>
        </div>
      </section>

      {/* Under ₹999 Section */}
      <section className="px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">UNDER ₹999</h2>
            <p className="text-sm text-gray-600">For every rebel</p>
          </div>
          <Link to="/shop?filter=under-999" className="flex items-center text-sm text-red-600 font-medium">
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {under999Products.slice(0, 4).map((product) => (
            <PremiumProductCard 
              key={product.id} 
              product={product} 
              priority={true}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">FEATURED</h2>
            <p className="text-sm text-gray-600">Essential gear</p>
          </div>
          <Link to="/shop" className="flex items-center text-sm text-gray-900 font-medium">
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <PremiumProductCard 
              key={product.id} 
              product={product} 
            />
          ))}
        </div>
      </section>

      {/* Vault Section */}
      {vaultProducts.length > 0 && (
        <section className="px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Crown className="text-yellow-500" size={20} />
                <h2 className="text-2xl font-black text-gray-900">VAULT</h2>
              </div>
              <p className="text-sm text-gray-600">Exclusive collection</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {vaultProducts.slice(0, 4).map((product) => (
              <PremiumProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/shop?filter=vault"
              className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold"
            >
              Access Vault
            </Link>
          </div>
        </section>
      )}

      {/* Fan Army Wall */}
      <section className="px-4 py-12 bg-gray-900 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-2">FAN ARMY WALL</h2>
          <p className="text-gray-400">Tag #OGARMY to get featured</p>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center">
              <Star className="text-gray-600" size={24} />
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <a
            href="https://instagram.com/explore/tags/ogarmy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Join the Army
          </a>
        </div>
      </section>

      {/* Bottom Safe Area */}
      <div className="h-8 bg-white"></div>
    </div>
  );
};

export default PremiumMobileHome;