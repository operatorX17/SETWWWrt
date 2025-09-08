import React from 'react';
import { formatPrice } from '../lib/price';
import { TrendingUp, Users, Clock, Shield, Award, Zap } from 'lucide-react';

const PricingStrategy = ({ product, className = "" }) => {
  const hasDiscount = (product.originalPrice || product.compare_at_price) && 
    ((product.originalPrice && product.originalPrice > product.price) || 
     (product.compare_at_price && product.compare_at_price > product.price));
  
  const discountPercentage = hasDiscount ? 
    Math.round(((product.originalPrice || product.compare_at_price) - product.price) / 
    (product.originalPrice || product.compare_at_price) * 100) : 0;
  
  const isVault = product.badges?.includes('VAULT');
  const isPremium = product.badges?.includes('PREMIUM') || product.badges?.includes('PREMIUM COLLECTION');
  const isUnder999 = product.price <= 999;
  const isUnder2000 = product.price <= 2000;
  
  // Strategic pricing tiers for credibility
  const getPricingTier = () => {
    if (isVault) return { tier: 'VAULT', color: 'text-yellow-400', bg: 'bg-yellow-900/20' };
    if (product.price >= 2000) return { tier: 'PREMIUM', color: 'text-purple-400', bg: 'bg-purple-900/20' };
    if (product.price >= 1000) return { tier: 'STANDARD', color: 'text-blue-400', bg: 'bg-blue-900/20' };
    return { tier: 'VALUE', color: 'text-green-400', bg: 'bg-green-900/20' };
  };
  
  const pricingTier = getPricingTier();
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Main Price Display */}
      <div className="flex items-baseline space-x-2">
        <span className="text-red-400 font-bold text-lg">
          {formatPrice(product.price)}
        </span>
        
        {hasDiscount && (
          <>
            <span className="text-gray-500 line-through text-sm">
              {formatPrice(product.originalPrice || product.compare_at_price)}
            </span>
            <span className="text-green-400 text-xs font-medium bg-green-900/30 px-1.5 py-0.5 rounded flex items-center">
              <TrendingUp size={10} className="mr-1" />
              {discountPercentage}% OFF
            </span>
          </>
        )}
      </div>
      
      {/* Pricing Tier Badge */}
      <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${pricingTier.color} ${pricingTier.bg}`}>
        {isVault && <Shield size={10} className="mr-1" />}
        {isPremium && <Award size={10} className="mr-1" />}
        {isUnder999 && <Zap size={10} className="mr-1" />}
        {pricingTier.tier}
      </div>
      
      {/* Value Propositions */}
      <div className="flex flex-wrap gap-1 text-xs text-gray-400">
        {isUnder999 && (
          <span className="flex items-center bg-green-900/20 px-1.5 py-0.5 rounded">
            <Zap size={8} className="mr-1 text-green-400" />
            Best Value
          </span>
        )}
        
        {hasDiscount && discountPercentage >= 30 && (
          <span className="flex items-center bg-orange-900/20 px-1.5 py-0.5 rounded">
            <Clock size={8} className="mr-1 text-orange-400" />
            Limited Offer
          </span>
        )}
        
        {isPremium && (
          <span className="flex items-center bg-purple-900/20 px-1.5 py-0.5 rounded">
            <Award size={8} className="mr-1 text-purple-400" />
            Premium Quality
          </span>
        )}
        
        {isVault && (
          <span className="flex items-center bg-yellow-900/20 px-1.5 py-0.5 rounded">
            <Users size={8} className="mr-1 text-yellow-400" />
            Exclusive Access
          </span>
        )}
      </div>
      
      {/* Trust Signals */}
      <div className="text-xs text-gray-500 space-y-1">
        {isUnder2000 && (
          <div className="flex items-center">
            <Shield size={8} className="mr-1 text-green-400" />
            <span>Free shipping on orders above {formatPrice(999)}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <Clock size={8} className="mr-1 text-blue-400" />
          <span>2-5 day delivery • Easy returns</span>
        </div>
      </div>
    </div>
  );
};

export default PricingStrategy;