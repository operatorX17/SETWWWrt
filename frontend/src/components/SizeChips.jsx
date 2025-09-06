import React, { useState } from 'react';

const SizeChips = ({ 
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'], 
  selectedSize, 
  onSizeSelect,
  stock = {},
  mostPopular = 'L'
}) => {
  const [hoveredSize, setHoveredSize] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold uppercase tracking-wider">Size</h3>
        {mostPopular && (
          <span className="text-sm text-[var(--color-gold)]">
            Most fans picked {mostPopular}
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          const isOutOfStock = stock[size] === 0;
          const isLowStock = stock[size] && stock[size] <= 3;
          const isHovered = hoveredSize === size;
          
          return (
            <button
              key={size}
              onClick={() => !isOutOfStock && onSizeSelect && onSizeSelect(size)}
              onMouseEnter={() => setHoveredSize(size)}
              onMouseLeave={() => setHoveredSize(null)}
              disabled={isOutOfStock}
              className={`
                relative h-12 border-2 transition-all duration-200 font-bold uppercase tracking-wider
                ${isSelected 
                  ? 'border-[var(--color-red)] bg-[var(--color-red)] text-white shadow-[0_0_15px_rgba(193,18,31,0.6)]' 
                  : isOutOfStock 
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed bg-gray-900' 
                    : 'border-[var(--color-steel)] text-white hover:border-[var(--color-red)] hover:text-[var(--color-red)]'
                }
                ${isHovered && !isSelected && !isOutOfStock ? 'shadow-[0_0_10px_rgba(193,18,31,0.3)]' : ''}
              `}
            >
              {size}
              
              {/* Stock indicator */}
              {!isOutOfStock && isLowStock && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-gold)] rounded-full animate-pulse"></div>
              )}
              
              {/* Out of stock overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
                  <span className="text-xs rotate-45 text-red-400">SOLD</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Stock info */}
      {selectedSize && stock[selectedSize] && stock[selectedSize] <= 10 && (
        <p className="text-sm text-[var(--color-gold)] font-medium">
          Only {stock[selectedSize]} left in {selectedSize}
        </p>
      )}
    </div>
  );
};

export default SizeChips;