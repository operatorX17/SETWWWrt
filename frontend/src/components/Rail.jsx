import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { ShoppingCart, ArrowRight, Package, Clock, Palette } from 'lucide-react';

const Rail = ({ title, products, showViewAll = false, viewAllLink = "", animated = false, subtitle = "", prioritizeBackImages = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  
  // Filter out unwanted products
  const filteredProducts = products.filter(p => 
    !p.title.includes('Cinder Fade') && !p.title.includes('Smoke Trail')
  );

  // Generate stock numbers for scarcity
  const getStockLeft = (productId) => {
    const hash = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return (hash % 12) + 5; // 5-16 items left
  };

  // Get current variant for a product
  const getCurrentVariant = (product) => {
    if (!product.hasVariants) return product;
    
    const selectedColor = selectedVariants[product.id] || product.defaultColor;
    return product.variants.find(v => v.color === selectedColor) || product.variants[0];
  };

  // Handle color variant selection
  const handleColorChange = (productId, colorway) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: colorway
    }));
  };
  
  return (
    <section className="py-8 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Rail Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link 
              to={viewAllLink}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Products Grid - Square Format MANDATORY */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {filteredProducts?.slice(0, 12)?.map((product, index) => {
            const currentVariant = getCurrentVariant(product);
            const stockLeft = getStockLeft(product.id);
            const isLowStock = stockLeft <= 8;
            
            return (
              <div 
                key={product.id} 
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105" 
                onClick={() => navigate(`/product/${currentVariant.original_id || product.id}`)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image - MUST BE SQUARE */}
                <div className="relative mb-3 overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden border border-gray-800 group-hover:border-red-500/50 transition-all duration-300">
                    {(() => {
                      let imageToShow = currentVariant.images?.[0] || '/placeholder-product.jpg';
                      
                      // Special handling for products that should show front first
                      if (product.showFrontFirst) {
                        imageToShow = currentVariant.primaryImage || currentVariant.images?.[0] || '/placeholder-product.jpg';
                      } else if (prioritizeBackImages && currentVariant.primaryImage) {
                        imageToShow = currentVariant.primaryImage;
                      } else if (currentVariant.primaryImage) {
                        imageToShow = currentVariant.primaryImage;
                      }
                      
                      return (
                        <img 
                          src={imageToShow} 
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                      );
                    })()}
                    
                    {/* Variant Count Badge */}
                    {product.hasVariants && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Palette size={10} />
                        {product.variant_count}
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    {isLowStock && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                        {stockLeft} left
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute bottom-2 right-2 flex flex-col gap-1">
                      {product.badges?.includes('BEST_SELLER') && (
                        <span className="px-2 py-1 text-xs font-bold bg-yellow-500 text-black rounded-full">
                          BEST
                        </span>
                      )}
                    </div>
                    
                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            ...product,
                            ...currentVariant,
                            selectedColor: currentVariant.color
                          });
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                      >
                        <ShoppingCart size={16} />
                        <span className="text-sm font-medium">Add</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info - Compact */}
                <div className="text-center">
                  <h3 className="font-medium text-white text-xs sm:text-sm mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  
                  {/* Color Selection for Variants */}
                  {product.hasVariants && (
                    <div className="flex justify-center gap-1 mb-2">
                      {product.variants.slice(0, 4).map((variant, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorChange(product.id, variant.color);
                          }}
                          className={`w-3 h-3 rounded-full border-2 transition-all ${
                            currentVariant.color === variant.color 
                              ? 'border-red-400 scale-110' 
                              : 'border-gray-600 hover:border-gray-400'
                          }`}
                          style={{
                            backgroundColor: 
                              variant.color.includes('Red') ? '#dc2626' :
                              variant.color.includes('Blue') ? '#2563eb' :
                              variant.color.includes('Green') ? '#16a34a' :
                              variant.color.includes('Black') ? '#1f2937' :
                              variant.color.includes('Gray') ? '#6b7280' :
                              '#374151'
                          }}
                          title={variant.color}
                        />
                      ))}
                      {product.variants.length > 4 && (
                        <span className="text-xs text-gray-400">+{product.variants.length - 4}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-red-400 font-bold text-sm">
                      {product.price_range || `₹${currentVariant.price}`}
                    </span>
                    {currentVariant.compare_at_price && (
                      <span className="text-gray-500 text-xs line-through">₹{currentVariant.compare_at_price}</span>
                    )}
                  </div>
                  
                  {/* Stock Info */}
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                    <Package size={10} />
                    <span>{stockLeft} left</span>
                    {product.hasVariants && (
                      <>
                        <span>•</span>
                        <span>{currentVariant.color}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Rail;