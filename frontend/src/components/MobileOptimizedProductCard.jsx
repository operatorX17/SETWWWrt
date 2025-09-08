import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import ScarcityPill from './ConversionElements/ScarcityPill';
import ProductStory from './ConversionElements/ProductStory';
import { ShoppingCart } from 'lucide-react';

const MobileOptimizedProductCard = ({ product, className = "", priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const getDisplayImage = () => {
    if (!product.images || product.images.length === 0) return '/placeholder-product.jpg';
    return isHovered && product.images.length > 1 ? product.images[0] : (product.images[1] || product.images[0]);
  };

  const handleCardClick = useCallback(() => {
    navigate(`/product/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, { size: 'M', color: 'Default' }, 1);
  }, [addToCart, product]);

  const getTotalStock = () => {
    if (product?.stock && typeof product.stock === 'object') {
      return Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    }
    const baseStock = parseInt(product.id?.toString().slice(-1)) || 0;
    return baseStock < 5 ? baseStock + 15 : baseStock + 5;
  };

  return (
    <div 
      className={`relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 ${className}`}
      onClick={handleCardClick}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden">
        <OptimizedImage
          src={getDisplayImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          priority={priority}
        />

        {/* Mobile-optimized badges - TOP LEFT - Standardized REBEL styling */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
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
          {product.price && product.price < 999 && (
            <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-green-700 text-white">
              &lt;₹999
            </span>
          )}
          <ScarcityPill stock={getTotalStock()} />
        </div>
      </div>

      {/* Content - Mobile optimized */}
      <div className="p-3 space-y-2">
        {/* Product Title */}
        <h3 className="font-bold text-sm leading-tight text-white line-clamp-2">
          {product.name}
        </h3>
        
        {/* Pricing */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-red-400">
            {formatPrice(product.price)}
          </span>
          {(product.originalPrice || product.compare_at_price) && 
           ((product.originalPrice && product.originalPrice > product.price) || 
            (product.compare_at_price && product.compare_at_price > product.price)) && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.originalPrice || product.compare_at_price)}
            </span>
          )}
        </div>

        {/* Product Story */}
        <ProductStory category={product.category} />

        {/* Add to Cart Button - Mobile optimized */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors text-sm touch-manipulation"
        >
          <ShoppingCart size={14} />
          <span>ADD TO ARSENAL</span>
        </button>
      </div>
    </div>
  );
};

export default memo(MobileOptimizedProductCard);