import React from 'react';

const ScarcityPill = ({ stock, threshold = 12, className = "" }) => {
  if (stock > threshold) return null;

  return (
    <div className={`inline-flex items-center bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full ${className}`}>
      <span className="w-1.5 h-1.5 bg-orange-300 rounded-full mr-1.5 animate-pulse"></span>
      Only {stock} left
    </div>
  );
};

export default ScarcityPill;