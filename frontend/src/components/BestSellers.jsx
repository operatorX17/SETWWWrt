import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockProducts } from '../data/mock';
import ProductCard from './ProductCard';

const BestSellers = () => {
  const navigate = useNavigate();
  const bestSellers = mockProducts.filter(product => product.badges.includes('BEST SELLER'));

  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="relative">
            <img
              src="https://framerusercontent.com/images/QnjPU1zOWtNjPZtBPpgHzKv8E.jpg"
              alt="Best Sellers Hero 1"
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="relative">
            <img
              src="https://framerusercontent.com/images/yiwGqGFXVOLSppnPlJ7n37p2ezI.jpg"
              alt="Best Sellers Hero 2"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider">
            Best Sellers
          </h2>
          <button 
            onClick={() => navigate('/shop')}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Shop Now</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;