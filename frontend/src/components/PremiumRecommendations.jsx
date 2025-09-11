import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PremiumRecommendations = ({ products, currentProductId }) => {
  const { addToCart } = useCart();
  
  // Filter out current product and get up to 4 recommendations
  const recommendations = products
    .filter(p => p.id !== currentProductId)
    .slice(0, 4);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Premium Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Complete Your Arsenal
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Hand-picked gear that pairs perfectly with your selection
          </p>
        </div>

        {/* Premium Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-500/10"
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative">
                <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                  <img 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Premium Badge */}
                  {product.badges?.includes('PREMIUM') && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-full">
                        PREMIUM
                      </span>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm font-medium">
                    ₹{product.price}
                  </div>
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-white text-sm mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-300">
                    {product.title}
                  </h3>
                </Link>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-red-400 font-bold text-lg">₹{product.price}</span>
                    {product.compareAtPrice && (
                      <span className="text-gray-500 text-sm line-through">₹{product.compareAtPrice}</span>
                    )}
                  </div>
                  
                  {/* Premium Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="group/btn relative inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                  >
                    <ShoppingCart size={16} className="transition-transform duration-300 group-hover/btn:scale-110" />
                    
                    {/* Ripple Effect */}
                    <div className="absolute inset-0 bg-red-400 rounded-full scale-0 group-hover/btn:scale-150 opacity-0 group-hover/btn:opacity-20 transition-all duration-500" />
                  </button>
                </div>
              </div>

              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Link 
            to="/shop"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
          >
            <span>Explore Full Arsenal</span>
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PremiumRecommendations;