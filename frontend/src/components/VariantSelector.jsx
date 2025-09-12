import React from 'react';
import { Palette } from 'lucide-react';

const VariantSelector = ({ product, selectedColor, onColorChange, selectedSize, onSizeChange }) => {
  if (!product.hasVariants) return null;

  const currentVariant = product.variants.find(v => v.color === selectedColor) || product.variants[0];

  const getColorClass = (colorName) => {
    const colorMap = {
      'War Paint Red': 'bg-red-600',
      'Jet Black / Blood Red': 'bg-gradient-to-r from-black to-red-600',
      'Steel Blue / Gold': 'bg-gradient-to-r from-blue-600 to-yellow-500',
      'Midnight Black': 'bg-gray-900',
      'Hunter Green': 'bg-green-700',
      'Brass / Smoke Gray': 'bg-gradient-to-r from-yellow-600 to-gray-500',
      'Battle Smoke': 'bg-gray-600',
      'Default': 'bg-gray-500'
    };
    return colorMap[colorName] || 'bg-gray-500';
  };

  return (
    <div className="mb-6">
      {/* Color Selection */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette size={18} className="text-red-400" />
          <h3 className="text-lg font-semibold">Color</h3>
          <span className="text-sm text-gray-400">({selectedColor})</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {product.variants.map((variant, index) => (
            <button
              key={index}
              onClick={() => onColorChange(variant.color)}
              className={`relative p-3 border rounded-lg transition-all ${
                selectedColor === variant.color
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-6 h-6 rounded-full border-2 border-gray-400 ${getColorClass(variant.color)}`}
                />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{variant.color}</p>
                  <p className="text-xs text-gray-400">₹{variant.price}</p>
                </div>
              </div>
              
              {selectedColor === variant.color && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Update Based on Selected Color */}
      <div className="p-3 bg-gray-900 rounded-lg border border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Selected Price:</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-red-400">₹{currentVariant.price}</span>
            {currentVariant.compare_at_price && (
              <span className="text-lg text-gray-500 line-through">₹{currentVariant.compare_at_price}</span>
            )}
          </div>
        </div>
        {currentVariant.scene_code && (
          <p className="text-xs text-gray-400 mt-1">Scene {currentVariant.scene_code}</p>
        )}
      </div>
    </div>
  );
};

export default VariantSelector;