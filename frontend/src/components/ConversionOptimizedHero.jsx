import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Zap, Shield, Crown } from 'lucide-react';
import ProductCard from './ProductCard';
import { useHeroProducts } from '../hooks/usePremiumCatalog';

// Helper: derive design folder slug from product.handle (e.g., og-tee-crimson-fury -> crimson-fury)
const EXCEPTION_SLUGS = {
  'cheethas-blade': 'cheetha-s-blade',
};

const deriveDesignSlug = (handle) => {
  if (!handle || typeof handle !== 'string') return '';
  const parts = handle.split('-');
  // Remove first two tokens: 'og' and product type (tee/hoodie/...)
  const slug = parts.length > 2 ? parts.slice(2).join('-') : handle;
  return EXCEPTION_SLUGS[slug] || slug;
};

const buildHeroImageSrc = (product) => {
  const viewFolder = product.view === 'back' ? 'back_view_designs' : 'front_view_designs';
  const slug = deriveDesignSlug(product.handle);
  const filename = product.image;
  return `/images/${viewFolder}/${slug}/${filename}`;
};

const ConversionOptimizedHero = () => {
  const { heroProducts, heroTitle, heroSubtitle, loading: isLoading, error } = useHeroProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('Failed to load premium catalog hero data:', error);
    }
  }, [error]);

  // Auto-slide for mobile
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(heroProducts.length / 4));
    }, 5000);

    return () => clearInterval(interval);
  }, [heroProducts.length]);

  if (isLoading) {
    return (
      <div className="bg-[#0B0B0D] text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-96 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#0B0B0D] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C1121F]/10 via-transparent to-[#C99700]/5"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23C1121F%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Hero Header */}
        <div className="text-center mb-16">
          {/* Urgency Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-[#C1121F]/20 to-[#C99700]/20 border border-[#C1121F]/30 rounded-full px-6 py-2 mb-6">
            <Zap className="w-5 h-5 text-[#C99700] mr-2 animate-pulse" />
            <span className="text-[#C99700] font-bold text-sm tracking-wide">VAULT EXCLUSIVE - LIMITED RAJYAM</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-black leading-tight mb-6">
            <span className="text-white drop-shadow-2xl">🔥 FIRESTORM</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1121F] via-[#C99700] to-[#C1121F] drop-shadow-2xl animate-pulse">
              COLLECTION
            </span>
          </h1>
          
          {/* Telugu Subheadline */}
          <p className="text-2xl sm:text-3xl text-[#C1121F] font-bold mb-4 tracking-wide">
            Veta ki Add Chey - Ippude Konu!
          </p>
          
          {/* English Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Ultimate fan favorites with <span className="text-[#C1121F] font-bold">perfect 100/100 conversion scores</span>. 
            Blood red palette meets Telugu pride.
          </p>

          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C1121F] to-[#C99700] border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                    {i === 1 ? 'P' : i === 2 ? 'S' : i === 3 ? 'P' : i === 4 ? 'K' : 'F'}
                  </div>
                ))}
              </div>
              <span className="ml-3 text-gray-300">50,000+ PSPK Fans</span>
            </div>
            <div className="flex items-center">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 text-[#C99700] fill-current" />
              ))}
              <span className="ml-2 text-gray-300">4.9/5 Rating</span>
            </div>
          </div>
        </div>

        {/* Hero Products Grid */}
        <div className="mb-16">
          {/* Desktop: 2x3 Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:grid-rows-2 gap-6">
            {heroProducts && heroProducts.length > 0 && heroProducts.slice(0, 6).map((product, index) => (
              <div key={product.id} className="group relative">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-[#C1121F]/20 rounded-lg overflow-hidden hover:border-[#C1121F] transition-all duration-300 hover:shadow-[0_0_30px_rgba(193,18,31,0.3)]">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image ? `/${product.image}` : '/images/placeholder.jpg'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading={index < 2 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    
                    {/* Premium Tier Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-gradient-to-r from-[#C1121F] to-[#C99700] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        <Crown className="w-3 h-3 inline mr-1" />
                        {product.premium_tier || 'Premium'}
                      </div>
                    </div>
                    
                    {/* Conversion Score */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/80 text-[#C99700] px-2 py-1 rounded text-xs font-bold">
                        {product.conversion_score || 95}/100
                      </div>
                    </div>
                    
                    {/* Bestseller Badge */}
                    {product.is_bestseller && (
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-[#C99700] text-black px-2 py-1 rounded text-xs font-bold">
                          BESTSELLER
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link 
                        to={`/products/${product.id}`}
                        className="bg-[#C1121F] text-white px-6 py-3 rounded-lg font-bold tracking-wide hover:bg-[#C99700] transition-colors duration-300 flex items-center space-x-2"
                      >
                        <span>Veta ki Add Chey</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#C99700] font-bold text-xl">₹{product.price}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 rounded-full bg-[#C1121F] border border-gray-600"></div>
                        <div className="w-4 h-4 rounded-full bg-[#C99700] border border-gray-600"></div>
                        <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: 2x2 Grid with Swipe */}
          <div className="lg:hidden">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {heroProducts && heroProducts.length > 0 && heroProducts.slice(currentSlide * 4, (currentSlide * 4) + 4).map((product, index) => (
                <div key={product.id} className="group relative">
                  <div className="bg-gradient-to-br from-gray-900 to-black border border-[#C1121F]/20 rounded-lg overflow-hidden hover:border-[#C1121F] transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.image ? `/${product.image}` : '/images/placeholder.jpg'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />
                      
                      {/* Premium Tier Badge */}
                      <div className="absolute top-2 left-2">
                        <div className="bg-[#C1121F] text-white px-2 py-1 rounded text-xs font-bold">
                          <Crown className="w-3 h-3 inline mr-1" />
                          {product.premium_tier || 'Premium'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{product.title}</h3>
                      <span className="text-[#C99700] font-bold text-lg">₹{product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Swipe Indicators */}
            <div className="flex justify-center space-x-2">
              {heroProducts && heroProducts.length > 0 && Array.from({ length: Math.ceil(heroProducts.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSlide === index ? 'bg-[#C1121F]' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              to="/shop?filter=vault"
              className="bg-gradient-to-r from-[#C1121F] to-[#C99700] text-white px-8 py-4 rounded-lg font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(193,18,31,0.5)] transition-all duration-300 flex items-center space-x-2 group"
            >
              <Crown className="w-5 h-5" />
              <span>Vault Collection Chudandi</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/shop"
              className="border-2 border-[#C1121F] text-[#C1121F] px-8 py-4 rounded-lg font-bold text-lg tracking-wide hover:bg-[#C1121F] hover:text-white transition-all duration-300 flex items-center space-x-2"
            >
              <span>All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          {/* Trust Elements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-[#C99700]" />
              <span className="text-gray-300">Premium Quality</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Zap className="w-6 h-6 text-[#C99700]" />
              <span className="text-gray-300">Fast Delivery</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Star className="w-6 h-6 text-[#C99700]" />
              <span className="text-gray-300">50K+ Happy Fans</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConversionOptimizedHero;