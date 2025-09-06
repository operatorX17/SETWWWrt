import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import { ShoppingCart } from 'lucide-react';

const PremiumProductCard = ({ product, className = "", priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getDisplayImage = () => {
    const imgs = product?.images || [];
    if (imgs.length === 0) return product.featured_image || 'https://via.placeholder.com/400x500?text=No+Image';
    if (imgs.length === 1) return imgs[0];

    const normalize = (s) => (typeof s === 'string' ? s.toLowerCase() : '');
    const backIdx = imgs.findIndex((u) => {
      const v = normalize(u);
      return v.includes('/back/') || v.includes(' back') || v.includes('_back') || v.includes('-back') || v.includes('back/');
    });
    const frontIdx = imgs.findIndex((u) => {
      const v = normalize(u);
      return v.includes('/front/') || v.includes(' front') || v.includes('_front') || v.includes('-front') || v.includes('front/');
    });

    const hasBack = backIdx !== -1;
    const hasFront = frontIdx !== -1;

    if (hasBack && hasFront) {
      return isHovered ? imgs[frontIdx] : imgs[backIdx];
    }
    if (hasBack) {
      if (isHovered) {
        const alt = imgs.find((_, i) => i !== backIdx);
        return alt || imgs[backIdx];
      }
      return imgs[backIdx];
    }
    if (hasFront) {
      if (isHovered) return imgs[frontIdx];
      const nonFront = imgs.find((_, i) => i !== frontIdx);
      return nonFront || imgs[frontIdx];
    }

    // No markers: default to second image (likely back) and swap on hover
    return isHovered ? (imgs[0] || imgs[1] || imgs[0]) : (imgs[1] || imgs[0]);
  };

  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdded) return; // Prevent multiple clicks
    
    setIsAnimating(true);
    addToCart(product, { size: 'M', color: 'Default' }, 1);
    
    // Show animation and change state
    setTimeout(() => {
      setIsAdded(true);
      setIsAnimating(false);
    }, 300);
    
    // Reset after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }, [addToCart, product, isAdded]);

  const getTotalStock = () => {
    if (product?.stock && typeof product.stock === 'object') {
      return Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    }
    const baseStock = parseInt(product.id?.toString().slice(-1)) || 0;
    return baseStock < 5 ? baseStock + 15 : baseStock + 5;
  };

  const isLowStock = getTotalStock() < 12;
  const isVault = product.badges?.includes('VAULT');
  const isPremium = product.badges?.includes('PREMIUM COLLECTION') || product.badges?.includes('PREMIUM');
  const isUnder999 = product.price <= 999;

  return (
    <div 
      className={`group cursor-pointer ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Badges - Matching Rail Design */}
      <div className="relative mb-4 overflow-hidden">
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
          <OptimizedImage
            src={getDisplayImage()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          
          {/* Badges - TOP LEFT - Matching Rail */}
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
            {(product.badges?.includes('PREMIUM COLLECTION') || product.badges?.includes('PREMIUM')) && (
              <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400">
                PREMIUM
              </span>
            )}
          </div>

          {/* Hover Overlay - Matching Rail */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-sm font-medium mb-1">Quick View</div>
              <div className="text-xs opacity-75">Tap to explore</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info - BELOW IMAGE - Matching Rail */}
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
            {formatPrice(product.price)}
          </span>
          {(product.originalPrice || product.compare_at_price) && 
           ((product.originalPrice && product.originalPrice > product.price) || 
            (product.compare_at_price && product.compare_at_price > product.price)) && (
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(product.originalPrice || product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Add to Arsenal Button - Responsive - Matching Rail */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[48px] touch-manipulation"
        >
          <ShoppingCart size={16} className="flex-shrink-0" />
          <span className="truncate">ADD TO ARSENAL</span>
        </button>

        {/* Telugu Text - Matching Rail */}
        <div className="text-center">
          <span className="text-yellow-400 text-xs">
            🏹 ఒక్కొక్కటి ఒక ఆయుధం 🏹
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(PremiumProductCard);