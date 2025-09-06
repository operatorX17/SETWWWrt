import React from 'react';
import { X, Lock, Star, Shield, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const VaultModal = ({ isOpen, onClose, product }) => {
  const { addToCart } = useCart();
  
  if (!isOpen || !product) return null;
  
  const handleAddToCart = () => {
    const selectedVariant = {
      size: 'M', // Default size
      color: product.colors?.[0] || 'Default'
    };
    
    addToCart(product, selectedVariant, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-[var(--color-gold)] rounded-lg max-w-md w-full mx-4 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Lock Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-gold)] to-yellow-600 rounded-full mb-4">
            <Lock size={32} className="text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-[var(--color-gold)]">
            VAULT LOCKED
          </h2>
        </div>

        {/* Product Info */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white mb-2">
            {product.name}
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            {product.description}
          </p>
          
          {/* Price */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-[var(--color-gold)]">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Unlock Requirement */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield size={16} className="text-[var(--color-red)]" />
              <span className="text-sm font-medium text-gray-300">
                UNLOCK REQUIREMENT
              </span>
            </div>
            <p className="text-[var(--color-red)] font-bold text-sm">
              {product.unlock_requirement}
            </p>
          </div>

          {/* Exclusive Features - Minimal Design */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-3 text-[var(--color-gold)]">
              <div className="w-1 h-1 bg-[var(--color-gold)] rounded-full"></div>
              <span className="text-xs uppercase tracking-wider font-medium">Ultra-Limited Edition</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-[var(--color-gold)]">
              <div className="w-1 h-1 bg-[var(--color-gold)] rounded-full"></div>
              <span className="text-xs uppercase tracking-wider font-medium">Exclusive OG Design</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-[var(--color-gold)]">
              <div className="w-1 h-1 bg-[var(--color-gold)] rounded-full"></div>
              <span className="text-xs uppercase tracking-wider font-medium">Vault Certificate Included</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[var(--color-red)] to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider flex items-center justify-center space-x-2"
          >
            <ShoppingCart size={18} />
            <span>ADD TO ARSENAL</span>
          </button>
          
          <button
            className="w-full bg-gradient-to-r from-[var(--color-gold)] to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-[var(--color-gold)] transition-all duration-300 uppercase tracking-wider"
            onClick={() => {
              // Handle unlock logic here
              alert('Premium features coming soon! Stay tuned, rebel.');
            }}
          >
            🔑 UNLOCK PREMIUM
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors uppercase tracking-wider"
          >
            Back to Arsenal
          </button>
        </div>

        {/* Bottom Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Vault exclusives are earned, not bought. Prove your dedication to the OG legacy.
        </p>
      </div>
    </div>
  );
};

export default VaultModal;