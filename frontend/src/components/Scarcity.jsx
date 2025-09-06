import React from 'react';

const Scarcity = ({ stock, limited = false, dropEndTime }) => {
  const totalStock = typeof stock === 'object' 
    ? Object.values(stock).reduce((sum, qty) => sum + (qty || 0), 0)
    : stock || 0;
    
  const isLowStock = totalStock <= 12;
  const isCriticalStock = totalStock <= 5;
  
  if (!isLowStock && !limited && !dropEndTime) return null;

  return (
    <div className="space-y-3">
      {/* Stock scarcity */}
      {isLowStock && (
        <div className={`
          flex items-center gap-2 px-4 py-2 border-l-4 
          ${isCriticalStock 
            ? 'border-red-500 bg-red-900/20 text-red-300' 
            : 'border-[var(--color-gold)] bg-yellow-900/20 text-[var(--color-gold)]'
          }
        `}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isCriticalStock ? 'bg-red-500' : 'bg-[var(--color-gold)]'
          }`}></div>
          <span className="text-sm font-bold uppercase tracking-wide">
            Only {totalStock} left — vaults soon
          </span>
        </div>
      )}
      
      {/* Limited edition */}
      {limited && (
        <div className="flex items-center gap-2 px-4 py-2 border-l-4 border-purple-500 bg-purple-900/20 text-purple-300">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
          <span className="text-sm font-bold uppercase tracking-wide">
            Limited Edition — Never Reprinted
          </span>
        </div>
      )}
      
      {/* Drop countdown */}
      {dropEndTime && (
        <div className="flex items-center gap-2 px-4 py-2 border-l-4 border-[var(--color-red)] bg-red-900/20 text-red-300">
          <div className="w-2 h-2 rounded-full bg-[var(--color-red)] animate-pulse"></div>
          <span className="text-sm font-bold uppercase tracking-wide">
            Drop Ends Soon — Act Fast
          </span>
        </div>
      )}
    </div>
  );
};

export default Scarcity;