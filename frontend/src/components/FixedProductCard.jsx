import React, { useState, memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import OptimizedImage from './OptimizedImage';
import VaultModal from './VaultModal';
import NFTBadge from './NFT/NFTBadge';
import NFTModal from './NFT/NFTModal';
import ScarcityPill from './ConversionElements/ScarcityPill';
import ProductStory from './ConversionElements/ProductStory';
import { ShoppingCart, Heart, Eye, TrendingUp, Users, Clock, Star, Crown, Zap, Lock } from 'lucide-react';

const FixedProductCard = ({ product, className = "", priority = false, isSpecial = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  // Stable values based on product ID to prevent random changes
  const [viewCount] = useState(((product.id || 1) * 37) % 400 + 150);
  const [stockLeft] = useState(((product.id || 1) * 23) % 15 + 8);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();
  const { addToCart } = useCart();

  // Get display image - use first image consistently to prevent flashing
  const getDisplayImage = () => {
    if (!product.images || product.images.length === 0) return '/placeholder-product.jpg';
    
    // Always use the first image to prevent flashing on hover
    return product.images[0];
  };

  const handleCardClick = useCallback(() => {
    if (product.vault_locked) {
      setShowVaultModal(true);
      return;
    }
    navigate(`/product/${product.id}`);
  }, [navigate, product.id, product.vault_locked]);

  const handleVaultClick = useCallback(() => {
    setShowVaultModal(true);
  }, []);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const selectedVariant = {
      size: 'M', // Default size
      color: product.colors?.[0] || 'Default'
    };
    
    addToCart(product, selectedVariant, 1);
  }, [addToCart, product]);

  // Helper function to calculate total stock
  const getTotalStock = () => {
    if (product?.stock && typeof product.stock === 'object') {
      return Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    }
    // Return consistent stock based on product ID
    const baseStock = parseInt(product.id?.toString().slice(-1)) || 0;
    return baseStock < 5 ? baseStock + 15 : baseStock + 5;
  };

  return (
    <>
      <div 
        className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isSpecial ? 'hover:shadow-yellow-500/20' : 'hover:shadow-red-500/10'
        } ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Lightning Border for Special Products */}
        {isSpecial && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 animate-pulse blur-sm"></div>
        )}
        
        {/* Main Card */}
        <div className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <OptimizedImage
              src={getDisplayImage()}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              priority={priority}
            />

            {/* Vault Lock Overlay */}
            {product.vault_locked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-yellow-400/20 backdrop-blur-sm rounded-full p-4 border border-yellow-400/30">
                  <Lock className="text-yellow-400 w-8 h-8 animate-pulse" />
                </div>
              </div>
            )}
            
            {/* NFT Badge */}
            <NFTBadge 
              product={product} 
              onMintClick={() => setShowNFTModal(true)}
            />
            
            {/* Enhanced Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.badges?.includes('VAULT') && (
                <span className="px-3 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg animate-pulse flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  VAULT
                </span>
              )}
              {product.badges?.includes('PREMIUM COLLECTION') && (
                <span className="px-3 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400 shadow-lg">
                  ✨ PREMIUM
                </span>
              )}
              {product.badges?.includes('LIMITED') && (
                <span className="px-3 py-1 text-xs font-black tracking-wider uppercase bg-red-500 text-white shadow-lg">
                  🏆 LIMITED
                </span>
              )}
              {product.price <= 999 && (
                <span className="px-3 py-1 text-xs font-black tracking-wider uppercase bg-green-600 text-white shadow-lg">
                  &lt;₹999
                </span>
              )}
              {Math.random() > 0.7 && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  HOT
                </span>
              )}
              <ScarcityPill stock={getTotalStock()} />
            </div>
            
            {/* Top Right Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            {/* Enhanced Hover Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-4 transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {/* Top Section - Live Activity */}
              <div className="flex justify-between items-start">
                <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {viewCount} viewing
                </div>
                <div className="bg-orange-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {stockLeft} left
                </div>
              </div>
              
              {/* Bottom Section - Actions */}
              <div className="flex justify-center gap-3">
                <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center text-sm font-semibold">
                  <Eye className="w-4 h-4 mr-2" />
                  Quick View
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all flex items-center text-sm font-bold shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Arsenal
                </button>
              </div>
            </div>
          </div>

          {/* Content - FIXED SPACING */}
          <div className="p-4 space-y-3">
            {/* Product Title - FIXED */}
            <h3 className={`font-bold text-base leading-relaxed ${
              product.category === 'Vault' ? 'text-yellow-400' : 'text-white'
            } line-clamp-2`}>
              {product.name}
            </h3>
            
            {/* Social Proof & Rating */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center bg-yellow-500/20 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-yellow-400 font-bold">4.8</span>
              </div>
              <div className="text-green-400 font-semibold">✓ Bestseller</div>
            </div>
            
            {/* Pricing - FIXED */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-bold ${
                  product.category === 'Vault' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {formatPrice(product.price)}
                </span>
                {(product.originalPrice || product.compare_at_price) && 
                 ((product.originalPrice && product.originalPrice > product.price) || 
                  (product.compare_at_price && product.compare_at_price > product.price)) && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.originalPrice || product.compare_at_price)}
                  </span>
                )}
              </div>
              {(product.originalPrice || product.compare_at_price) && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {Math.round(((product.originalPrice || product.compare_at_price) - product.price) / (product.originalPrice || product.compare_at_price) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Product Story */}
            <ProductStory category={product.category} />

            {/* Enhanced Add to Cart Button */}
            <div className="space-y-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
              >
                <ShoppingCart size={14} />
                <span>ADD TO ARSENAL</span>
                <Zap size={12} />
              </button>
              
              {/* Trust Signals */}
              <div className="flex justify-center space-x-3 text-xs text-gray-400">
                <div className="flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </div>
                <div className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Fast Ship
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Quality
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VaultModal 
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        product={product}
      />
      
      <NFTModal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        product={product}
      />
    </>
  );
};

export default memo(FixedProductCard);