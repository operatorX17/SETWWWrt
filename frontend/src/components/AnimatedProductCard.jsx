import React, { useState, memo, useCallback } from 'react';
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
import { ShoppingCart, Zap } from 'lucide-react';

const AnimatedProductCard = ({ product, className = "", priority = false, isSpecial = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();
  const { addToCart } = useCart();

  // Get display image - back by default, front on hover
  const getDisplayImage = () => {
    if (!product.images || product.images.length === 0) return '/placeholder-product.jpg';
    
    if (product.images.length === 1) return product.images[0];
    
    // Show back image by default, front on hover
    return isHovered ? product.images[0] : (product.images[1] || product.images[0]);
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

  // Helper function to calculate total stock - FIXED LOGIC
  const getTotalStock = () => {
    if (product?.stock && typeof product.stock === 'object') {
      return Object.values(product.stock).reduce((sum, qty) => sum + (parseInt(qty) || 0), 0);
    }
    // Return consistent stock based on product ID, not random
    const baseStock = parseInt(product.id?.toString().slice(-1)) || 0;
    return baseStock < 5 ? baseStock + 15 : baseStock + 5; // Ensures some products have low stock
  };

  return (
    <>
      <div 
        className={`relative group cursor-pointer transition-all duration-500 ${
          isReducedMotion ? 'transition-none' : 'hover:scale-105'
        } ${isSpecial ? 'hover:shadow-2xl hover:shadow-yellow-500/30' : 'hover:shadow-xl hover:shadow-red-500/20'} ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Lightning Border for Special Products */}
        {isSpecial && (
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        )}
        
        {/* Main Card */}
        <div className={`relative bg-[var(--color-panel)] border border-[var(--color-steel)] rounded-lg overflow-hidden backdrop-blur-sm ${
          isSpecial ? 'bg-gradient-to-br from-gray-900/90 to-black/90' : 'bg-gray-900/80'
        }`}>
          {/* Image Container with Blur Effect */}
          <div className="relative aspect-square overflow-hidden">
            <OptimizedImage
              src={getDisplayImage()}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110' : 'scale-100'
              } ${isSpecial ? 'group-hover:blur-[1px]' : ''}`}
              priority={priority}
            />
            
            {/* Animated Overlay for Special Products */}
            {isSpecial && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 left-4">
                  <Zap className="text-yellow-400 animate-pulse" size={24} />
                </div>
              </div>
            )}

            {/* Vault Lock Overlay */}
            {product.vault_locked && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-yellow-400 text-4xl animate-pulse">🔒</div>
              </div>
            )}
            
            {/* NFT Badge */}
            <NFTBadge 
              product={product} 
              onMintClick={() => setShowNFTModal(true)}
            />
            
            {/* Essential badges + Scarcity */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badges?.includes('VAULT') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full shadow-lg">
                  VAULT
                </span>
              )}
              {product.badges?.includes('PREMIUM COLLECTION') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full shadow-lg">
                  PREMIUM
                </span>
              )}
              {product.badges?.includes('LIMITED') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full shadow-lg">
                  LIMITED
                </span>
              )}

              {product.price <= 999 && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-full shadow-lg">
                  &lt;₹999
                </span>
              )}
              <ScarcityPill stock={getTotalStock()} />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className={`font-bold mb-2 line-clamp-2 leading-tight ${
              product.category === 'Vault' ? 'text-yellow-400' : 'text-white'
            }`}>
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-2 mb-3">
              <span className={`text-lg font-bold ${
                product.category === 'Vault' ? 'text-yellow-400' : 'text-red-500'
              }`}>
                {formatPrice(product.price)}
              </span>
              {/* Show original price as crossed out discount */}
              {(product.originalPrice || product.compare_at_price) && 
               ((product.originalPrice && product.originalPrice > product.price) || 
                (product.compare_at_price && product.compare_at_price > product.price)) && (
                <span className="text-sm text-gray-400 line-through ml-2">
                  {formatPrice(product.originalPrice || product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Product Story */}
            <ProductStory category={product.category} className="mt-2" />

            {/* Add to Cart Button with Animation */}
            <button
              onClick={handleAddToCart}
              className={`w-full mt-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 ${
                isSpecial ? 'hover:from-yellow-600 hover:to-orange-600' : ''
              }`}
            >
              <ShoppingCart size={16} />
              <span>ADD TO ARSENAL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vault Modal */}
      <VaultModal 
        isOpen={showVaultModal}
        onClose={() => setShowVaultModal(false)}
        product={product}
      />
      
      {/* NFT Modal */}
      <NFTModal
        isOpen={showNFTModal}
        onClose={() => setShowNFTModal(false)}
        product={product}
      />
    </>
  );
};

export default memo(AnimatedProductCard);