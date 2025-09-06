import React from 'react';
import { Zap, ExternalLink, Star } from 'lucide-react';

const NFTBadge = ({ product, onMintClick, className = "" }) => {
  const hasNFT = product.badges?.includes('VAULT') || product.category === 'Vault';
  
  if (!hasNFT) return null;

  return (
    <div className={`absolute top-2 right-2 z-10 ${className}`}>
      <div className="group relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMintClick();
          }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
          title="Mint NFT"
        >
          <Zap size={16} />
        </button>
        
        {/* Tooltip */}
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
          <div className="text-xs text-white space-y-1">
            <div className="flex items-center space-x-2 font-bold text-purple-400 mb-2">
              <Star size={12} />
              <span>NFT Available</span>
            </div>
            <p className="text-gray-300">Create a digital collectible of this exclusive OG item</p>
            <div className="flex items-center space-x-1 text-blue-400 mt-2">
              <ExternalLink size={10} />
              <span>Tradeable on OpenSea</span>
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute -top-1 right-3 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default NFTBadge;