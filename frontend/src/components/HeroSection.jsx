import React from 'react';
import { ArrowRight } from 'lucide-react';
import { mockProducts, mockHeroImages } from '../data/mock';
import ProductCard from './ProductCard';

const HeroSection = () => {
  const newProducts = mockProducts.filter(product => product.badges.includes('NEW'));

  return (
    <div className="bg-black text-white">
      {/* Main Hero Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Shop Now Button */}
          <div className="mb-8">
            <button className="flex items-center space-x-2 text-sm uppercase tracking-wider font-medium hover:text-gray-300 transition-colors group">
              <span>SHOP NOW</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* New Arrivals Title */}
          <div className="mb-12">
            <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider">
              NEW ARRIVALS
            </h1>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Featured Product (Large) */}
            <div className="md:col-span-2 lg:col-span-2">
              <ProductCard 
                product={newProducts[0]} 
                className="h-full"
              />
            </div>

            {/* Regular Products */}
            {newProducts.slice(1, 3).map((product) => (
              <div key={product.id} className="lg:col-span-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Between Seasons Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block border border-white px-4 py-2">
                <span className="text-xs uppercase tracking-wider font-medium">OUTERWEAR</span>
              </div>
              
              <h2 className="text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none">
                BETWEEN SEASONS
              </h2>
              
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Layer up for changing weather with versatile pieces designed for adaptability. Premium materials meet considered design.
              </p>
              
              <div className="flex space-x-4 mt-8">
                <img src={mockHeroImages.main} alt="Product 1" className="w-20 h-20 object-cover" />
                <img src="https://framerusercontent.com/images/XKploSb7T2uX1ctVoUmRVVUBE.jpg" alt="Product 2" className="w-20 h-20 object-cover" />
                <img src="https://framerusercontent.com/images/6txSBkPhzyrFYoV59NZqRF3A.jpg" alt="Product 3" className="w-20 h-20 object-cover" />
                <img src="https://framerusercontent.com/images/ShqTo2F5a7sLxDmCPO2CSO76iQ.jpg" alt="Product 4" className="w-20 h-20 object-cover" />
              </div>
              
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group mt-8">
                <span className="text-sm uppercase tracking-wider font-medium">Shop Now</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right Image */}
            <div className="relative">
              <img
                src={mockHeroImages.betweenSeasons}
                alt="Between Seasons Collection"
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;