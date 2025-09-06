import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';
import FixedProductCard from './FixedProductCard';

const Rail = ({ title, products, showViewAll = false, viewAllLink = "", animated = false, subtitle = "" }) => {
  const isSpecialRail = title.includes('VAULT') || title.includes('PREMIUM') || title.includes('EXCLUSIVE');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Rail Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-wider font-headline mb-4">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-300 text-lg mb-4">{subtitle}</p>
            )}
            <div className="w-20 h-1 bg-red-500"></div>
          </div>
          {showViewAll && (
            <a 
              href={viewAllLink}
              className="group flex items-center gap-2 text-yellow-400 hover:text-white transition-colors"
            >
              <span className="text-lg font-bold uppercase tracking-wider">View All</span>
              <div className="w-8 h-8 border-2 border-yellow-400 group-hover:border-white rounded-full flex items-center justify-center transition-colors">
                <span className="text-sm">→</span>
              </div>
            </a>
          )}
        </div>

        {/* Products Grid - CARDLESS BRUTAL DESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products?.slice(0, 8)?.map((product, index) => (
            <div key={product.id} className="group cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
              {/* Product Image with Badges */}
              <div className="relative mb-4 overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
                  <img 
                    src={product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Badges - TOP LEFT - Updated to match ProductCard */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badges?.includes('VAULT') && (
                      <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                        VAULT
                      </span>
                    )}
                    {product.badges?.includes('LIMITED') && (
                      <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-red-500 text-white">
                        LIMITED
                      </span>
                    )}
                    {product.badges?.includes('REBEL DROP') && (
                      <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-black text-red-500 border border-red-500">
                        REBEL
                      </span>
                    )}
                    {product.badges?.includes('PREMIUM') && (
                      <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400">
                        PREMIUM
                      </span>
                    )}
                  </div>

                  {/* Price Badge - TOP RIGHT - REMOVED */}
                  {/* Removing pricing badge as requested */}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-sm font-medium mb-1">Quick View</div>
                      <div className="text-xs opacity-75">Tap to explore</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info - BELOW IMAGE */}
              <div className="space-y-3">
                {/* Product Title */}
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-red-400 transition-colors">
                  {product.name}
                </h3>

                {/* Description - Shortened */}
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {product.description ? 
                    (product.description.length > 60 ? 
                      product.description.substring(0, 60) + '...' : 
                      product.description
                    ) : 
                    'Built for rebels.'
                  }
                </p>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-red-400 font-bold text-xl">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-gray-500 line-through text-sm">
                      ₹{product.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Arsenal Button - Responsive */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, { size: 'M', color: product.colors?.[0] || 'Default' });
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
                >
                  <ShoppingCart size={16} className="flex-shrink-0" />
                  <span className="truncate">ADD TO ARSENAL</span>
                </button>

                {/* Telugu Text */}
                <div className="text-center">
                  <span className="text-yellow-400 text-xs">
                    🏹 ఒక్కొక్కటి ఒక ఆయుధం 🏹
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rail;