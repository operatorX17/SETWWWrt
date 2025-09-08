import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { formatPrice } from '../lib/price';
import { Plus, Star, Gift } from 'lucide-react';

const CartSuggestions = ({ className = "" }) => {
  const { items, addToCart } = useCart();
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!items.length || !products.length) return;

    // Get categories already in cart
    const cartCategories = items.map(item => item.category || 'Unknown');
    
    // Suggest complementary items
    const suggestionRules = [
      {
        condition: () => !cartCategories.includes('Accessories'),
        suggestions: products.filter(p => 
          p.category === 'Accessories' && 
          p.price <= 999 &&
          !items.find(item => item.id === p.id)
        ).slice(0, 2),
        title: 'Complete Your Look'
      },
      {
        condition: () => cartCategories.includes('Hoodies') && !cartCategories.includes('Teeshirt'),
        suggestions: products.filter(p => 
          p.category === 'Teeshirt' && 
          p.price <= 1499 &&
          !items.find(item => item.id === p.id)
        ).slice(0, 2),
        title: 'Perfect Combo'
      },
      {
        condition: () => cartCategories.includes('Teeshirt') && !cartCategories.includes('Hoodies'),
        suggestions: products.filter(p => 
          p.category === 'Hoodies' && 
          p.price <= 2999 &&
          !items.find(item => item.id === p.id)
        ).slice(0, 1),
        title: 'Layer Up'
      },
      {
        condition: () => items.length === 1,
        suggestions: products.filter(p => 
          p.price <= 999 && 
          p.badges?.includes('BESTSELLER') &&
          !items.find(item => item.id === p.id)
        ).slice(0, 3),
        title: 'Bestsellers Under ₹999'
      }
    ];

    // Find applicable suggestions
    for (const rule of suggestionRules) {
      if (rule.condition() && rule.suggestions.length > 0) {
        setSuggestions(rule.suggestions.map(s => ({ ...s, title: rule.title })));
        break;
      }
    }
  }, [items, products]);

  if (suggestions.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Gift className="text-blue-400" size={20} />
        <h3 className="text-white font-bold">{suggestions[0]?.title || 'You Might Like'}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.slice(0, 2).map((product) => (
          <div key={product.id} className="bg-gray-800/50 rounded-lg p-3 flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
              {(() => {
                const imgs = product.images || [];
                if (imgs.length === 0) return (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <Star size={16} className="text-gray-400" />
                  </div>
                );
                
                if (imgs.length === 1) return (
                  <img src={imgs[0]} alt={product.name} className="w-full h-full object-cover" />
                );
                
                const normalize = (s) => (typeof s === 'string' ? s.toLowerCase() : '');
                const backIdx = imgs.findIndex((u) => {
                  const v = normalize(u);
                  return v.includes('/back/') || v.includes(' back') || v.includes('_back') || v.includes('-back') || v.includes('back/');
                });
                
                const displayImage = backIdx !== -1 ? imgs[backIdx] : (imgs[1] || imgs[0]);
                return <img src={displayImage} alt={product.name} className="w-full h-full object-cover" />;
              })()}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm line-clamp-1">{product.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-green-400 font-bold text-sm">{formatPrice(product.price)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                addToCart(product, { size: 'M', color: 'Default' }, 1);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex-shrink-0"
              title="Add to Arsenal"
            >
              <Plus size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Bundle Offer */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400 mb-2">Add both for extra savings!</div>
        <button
          onClick={() => {
            suggestions.slice(0, 2).forEach(product => {
              addToCart(product, { size: 'M', color: 'Default' }, 1);
            });
          }}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all"
        >
          ADD BOTH & SAVE 10%
        </button>
      </div>
    </div>
  );
};

export default CartSuggestions;