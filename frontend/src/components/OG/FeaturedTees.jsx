import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard';

const FeaturedTees = () => {
  const { products } = useProducts();
  const [viewAll, setViewAll] = useState(false);

  // Get all T-shirt products
  const teeProducts = products.filter(product => 
    product.category && product.category.toLowerCase() === 'teeshirt'
  );

  // Get featured tees (first 8) and remaining
  const featuredTees = teeProducts.slice(0, 8);
  const remainingTees = teeProducts.slice(8);
  const displayTees = viewAll ? teeProducts : featuredTees;

  if (teeProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-black text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold uppercase tracking-wider mb-6">
            <span className="text-red-500">REBEL</span> TEES ARSENAL
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Premium OG T-shirts designed for the tribe. Each tee tells a story of rebellion. 
            <span className="text-red-500 block mt-2">Hover to see back designs.</span>
          </p>
          <div className="mt-8 text-gray-400">
            <span className="bg-red-500 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
              {teeProducts.length} DESIGNS AVAILABLE
            </span>
          </div>
        </div>

        {/* Premium T-shirt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayTees.map((product, index) => (
            <div key={product.id} className="group">
              <ProductCard 
                product={product}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                priority={index < 4}
              />
              
              {/* Enhanced product details */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <span className="text-red-500 font-bold">₹{product.price}</span>
                </div>
                
                {/* Front/Back indicator */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Eye size={14} />
                    <span>Hover for back design</span>
                  </div>
                )}
                
                {/* Category and availability */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="uppercase tracking-wider">Premium Tee</span>
                  <span className="text-green-400">In Stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Toggle */}
        {remainingTees.length > 0 && (
          <div className="text-center">
            <button
              onClick={() => setViewAll(!viewAll)}
              className="inline-flex items-center space-x-3 bg-red-500 text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300 group"
            >
              <span>{viewAll ? 'Show Less' : `Show All ${teeProducts.length} Tees`}</span>
              <ArrowRight 
                size={20} 
                className={`transition-transform duration-300 ${viewAll ? 'rotate-90' : 'group-hover:translate-x-1'}`} 
              />
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 border border-red-500 bg-red-500/5">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Join the <span className="text-red-500">Rebellion</span>?
          </h3>
          <p className="text-gray-300 mb-6">
            Explore the complete arsenal. Every piece forged for the OG tribe.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-transparent border-2 border-red-500 text-red-500 px-6 py-3 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <span>Browse Full Arsenal</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTees;