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

const FixedProductCard = ({ product, className = "", priority = false, isSpecial = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showNFTModal, setShowNFTModal] = useState(false);
  const navigate = useNavigate();
  const { isReducedMotion } = useTheme();
  const { addToCart } = useCart();

  // Get display image - back by default, front on hover
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

    // Default: second image as back when unlabelled
    return isHovered ? (imgs[0] || imgs[1] || imgs[0]) : (imgs[1] || imgs[0]);
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
                <div className="text-yellow-400 text-4xl animate-pulse">🔒</div>
              </div>
            )}
            
            {/* NFT Badge */}
            <NFTBadge 
              product={product} 
              onMintClick={() => setShowNFTModal(true)}
            />
            
            {/* Badges - FIXED POSITIONING */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.badges?.includes('VAULT') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                  VAULT
                </span>
              )}
              {product.badges?.includes('PREMIUM COLLECTION') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gray-800 text-yellow-400">
                  PREMIUM
                </span>
              )}
              {product.badges?.includes('LIMITED') && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-red-500 text-white">
                  LIMITED
                </span>
              )}
              {product.price <= 999 && (
                <span className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-green-600 text-white">
                  &lt;₹999
                </span>
              )}
              <ScarcityPill stock={getTotalStock()} />
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
            
            {/* Pricing - FIXED */}
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

            {/* Product Story */}
            <ProductStory category={product.category} />

            {/* Add to Cart Button - FIXED SIZE */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors text-sm"
            >
              <ShoppingCart size={14} />
              <span>ADD TO ARSENAL</span>
            </button>
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