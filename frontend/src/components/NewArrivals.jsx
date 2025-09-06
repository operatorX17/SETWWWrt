import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockProducts } from '../data/mock';
import ProductCard from './ProductCard';

const NewArrivals = () => {
  const navigate = useNavigate();
  const newProducts = mockProducts.filter(product => product.badges.includes('NEW'));

  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-wider">
            New Arrivals
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
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;