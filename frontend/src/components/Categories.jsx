import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '../data/mock';

const Categories = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockCategories.map((category, index) => (
            <div 
              key={index} 
              className="relative group cursor-pointer"
              onClick={() => navigate(`/shop/category/${category.name.toLowerCase()}`)}
            >
              <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">
                    {category.name}
                  </h3>
                  <button 
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors group"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/shop/category/${category.name.toLowerCase()}`);
                    }}
                  >
                    <span className="text-sm uppercase tracking-wider font-medium">Shop Now</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;