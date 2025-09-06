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
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, className = "", priority = false }) => {
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

    // Category heuristic for Shopify CDN images lacking back/front labels
    const cat = normalize(product?.category || '');
    const isTeeOrShirt = cat.includes('tee') || cat.includes('shirt');
    if (!hasBack && !hasFront && isTeeOrShirt && imgs.length >= 2) {
      return isHovered ? imgs[0] : imgs[1];
    }

    // When no markers are present, default to second image (assumed back) and swap to first (front) on hover
    return isHovered ? (imgs[0] || imgs[1] || imgs[0]) : (imgs[1] || imgs[0]);
  };

  const handleClick = useCallback(() => {
    // Check if this is a vault product
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
        className={`group cursor-pointer transition-all duration-300 hover:scale-105 bg-gray-900 rounded-lg p-4 ${className} ${
          product.vault_locked ? 'relative overflow-hidden' : ''
        }`}
        onClick={handleClick}
        onMouseEnter={() => !isReducedMotion && setIsHovered(true)}
        onMouseLeave={() => !isReducedMotion && setIsHovered(false)}
      >
        {/* Product Image - Clean, no overlays */}
        <div className="aspect-[4/5] overflow-hidden bg-gray-900 mb-4 relative">
          <OptimizedImage
            src={getDisplayImage()}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              product.vault_locked ? 'filter brightness-75 grayscale-[30%]' : ''
            }`}
            priority={priority}
          />
          
          {/* Vault Lock Overlay */}
          {product.vault_locked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-yellow-400 text-4xl">🔒</div>
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

          {/* Color swatches for multi-color products */}
          {product.colors && product.colors.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full border border-white/50 ${
                    color.toLowerCase() === 'black' ? 'bg-black' :
                    color.toLowerCase() === 'white' ? 'bg-white' :
                    color.toLowerCase() === 'blue' ? 'bg-blue-600' :
                    color.toLowerCase() === 'red' ? 'bg-red-600' :
                    color.toLowerCase() === 'grey' || color.toLowerCase() === 'gray' ? 'bg-gray-500' :
                    'bg-gray-400'
                  }`}
                  title={color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Clean */}
        <div className="space-y-2">
          <h3 className={`text-sm font-medium line-clamp-2 group-hover:text-red-500 transition-colors text-white ${
              product.vault_locked ? 'text-yellow-400' : ''
            }`}>
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2">
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

            {/* Product Story */}
            <ProductStory category={product.category} className="mt-2" />

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full mt-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all"
            >
              <ShoppingCart size={16} />
              <span>ADD TO CART</span>
            </button>
          </div>

          {/* Replace stock alert and delivery with simpler approach */}
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

export default memo(ProductCard);