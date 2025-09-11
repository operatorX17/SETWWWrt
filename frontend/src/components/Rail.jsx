import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { ShoppingCart, ArrowRight, Zap, Crown, TrendingUp } from 'lucide-react';
import FixedProductCard from './FixedProductCard';

const Rail = ({ title, products, showViewAll = false, viewAllLink = "", animated = false, subtitle = "", prioritizeBackImages = false }) => {
  const isSpecialRail = title.includes('VAULT') || title.includes('PREMIUM') || title.includes('EXCLUSIVE');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Rail Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-sm sm:text-base mt-2">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link 
              to={viewAllLink}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Products Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-12">
          {products?.slice(0, 8)?.map((product, index) => (
            <div 
              key={product.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105" 
              onClick={() => navigate(`/product/${product.id}`)}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Product Image with Badges */}
              <div className="relative mb-3 overflow-hidden">
                <div className="aspect-[4/5] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border-2 border-transparent group-hover:border-red-500/50 transition-all duration-300">
                  {/* Enhanced image selection logic - prioritize back images when requested */}
                  {(() => {
                    let imageToShow = product.images?.[0] || '/placeholder-product.jpg';
                    
                    // If prioritizeBackImages is true, use back image first
                    if (prioritizeBackImages && product.backImage) {
                      imageToShow = product.backImage;
                    } else if (prioritizeBackImages && product.showBackFirst && product.images?.[0]) {
                      // If product was marked to show back first, use first image (which should be back)
                      imageToShow = product.images[0];
                    } else if (product.primaryImage) {
                      imageToShow = product.primaryImage;
                    }
                    
                    return (
                      <img 
                        src={imageToShow} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    );
                  })()}
                  
                  {/* Badges - Simplified for Mobile */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.badges?.includes('VAULT') && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-yellow-400 text-black rounded">
                        🔒
                      </span>
                    )}
                    {product.badges?.includes('LIMITED') && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded">
                        LTD
                      </span>
                    )}
                    {product.price && product.price < 999 && (
                      <span className="px-1.5 py-0.5 text-xs font-bold bg-green-500 text-white rounded">
                        &lt;{formatPrice(999)}
                      </span>
                    )}
                  </div>

                  {/* Price Badge - TOP RIGHT - REMOVED */}
                  {/* Removing pricing badge as requested */}


                </div>
              </div>

              {/* Enhanced Product Info */}
              <div className="space-y-2">
                {/* Product Title - Mobile Optimized */}
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight group-hover:text-red-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>

                {/* Price - Mobile Focused */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-400 font-bold text-lg">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-500 line-through text-xs">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-green-400 text-xs font-semibold">
                      SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, { size: 'M', color: product.colors?.[0] || 'Default' });
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-xs sm:text-sm min-h-[40px] touch-manipulation"
                >
                  <ShoppingCart size={12} className="sm:w-4 sm:h-4" />
                  <span>ADD TO CART</span>
                </button>


              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rail;