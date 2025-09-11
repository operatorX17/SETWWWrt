import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import PricingStrategy from './PricingStrategy';
import { ShoppingCart, Lock } from 'lucide-react';

const PremiumProductCard = ({ product, className = "", priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getDisplayImage = () => {
    // Handle new premium catalog structure where image is a string
    if (product?.image) {
      return product.image;
    }
    
    // Fallback to legacy images array structure
    const imgs = Array.isArray(product?.images) ? product.images : [];
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
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Product Image with Badges - Mobile Optimized */}
      <div className="relative mb-3 overflow-hidden">
        <div className="aspect-[4/5] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
          <OptimizedImage
            src={getDisplayImage()}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            priority={priority}
          />
          
          {/* Minimal Badges - Only Essential Info */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badges?.includes('VAULT') && (
              <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-black rounded-md flex items-center gap-1">
                <Lock size={12} />
                VAULT
              </span>
            )}
            {isUnder999 && (
              <span className="px-2 py-1 text-xs font-bold bg-green-600 text-white rounded-md">
                &lt;{formatPrice(999)}
              </span>
            )}
          </div>

          {/* Stock indicator for urgency */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-md">
                {getTotalStock()} LEFT
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info - Mobile First Design */}
      <div className="space-y-2">
        {/* Product Title - Clean & Readable */}
        <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Strategic Pricing Display */}
        <PricingStrategy product={product} />

        {/* Add to Cart Button - Mobile Optimized Touch Target */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm min-h-[44px] touch-manipulation active:scale-95 ${
            isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isAnimating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isAdded ? (
            <>
              <span className="text-base">✓</span>
              <span>ADDED</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} className="flex-shrink-0" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>


      </div>
    </div>
  );
};

export default memo(PremiumProductCard);