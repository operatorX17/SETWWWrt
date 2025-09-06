import React, { createContext, useContext, useState, useEffect } from 'react';
import { useShopify } from './ShopifyIntegration';

const RankContext = createContext();

export const useRank = () => {
  const context = useContext(RankContext);
  if (!context) {
    throw new Error('useRank must be used within a RankProvider');
  }
  return context;
};

// Rank progression system
const RANK_TIERS = [
  { name: 'FOOT SOLDIER', minSpent: 0, maxSpent: 999, color: 'text-gray-400', benefits: ['Basic Support'] },
  { name: 'REBEL', minSpent: 1000, maxSpent: 4999, color: 'text-green-400', benefits: ['10% Extra Discount', 'Early Notifications'] },
  { name: 'WARRIOR', minSpent: 5000, maxSpent: 9999, color: 'text-blue-400', benefits: ['15% Extra Discount', 'Priority Support', 'Member Sales'] },
  { name: 'BATTLE ELITE', minSpent: 10000, maxSpent: 24999, color: 'text-purple-400', benefits: ['20% Extra Discount', 'Birthday Drops', 'Elite Badge'] },
  { name: 'OG COMMANDER', minSpent: 25000, maxSpent: 49999, color: 'text-orange-400', benefits: ['VAULT Access', 'Personal Concierge', 'Exclusive Merchandise'] },
  { name: 'VAULT LEGEND', minSpent: 50000, maxSpent: Infinity, color: 'text-yellow-400', benefits: ['Full VAULT Access', 'Same Day Delivery', 'Custom Design Service'] }
];

export const RankProvider = ({ children }) => {
  const [currentRank, setCurrentRank] = useState(RANK_TIERS[0]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [vaultAccess, setVaultAccess] = useState(false);
  const { customer, orders } = useShopify();

  // Calculate rank based on Shopify order data
  useEffect(() => {
    if (orders && orders.length > 0) {
      const total = orders.reduce((sum, order) => {
        return sum + (parseFloat(order.total_price) || 0);
      }, 0);

      setTotalSpent(total);
      setLoyaltyPoints(Math.floor(total / 10)); // 1 point per ₹10

      // Find appropriate rank
      const rank = RANK_TIERS.find(tier => 
        total >= tier.minSpent && total <= tier.maxSpent
      ) || RANK_TIERS[0];

      setCurrentRank(rank);
      setVaultAccess(total >= 25000); // VAULT access at ₹25k+
    }
  }, [orders]);

  // Check if user can access specific product tiers
  const canAccessTier = (requiredSpent) => {
    return totalSpent >= requiredSpent;
  };

  // Get next rank information
  const getNextRank = () => {
    const currentIndex = RANK_TIERS.findIndex(tier => tier.name === currentRank.name);
    return currentIndex < RANK_TIERS.length - 1 ? RANK_TIERS[currentIndex + 1] : null;
  };

  // Calculate progress to next rank
  const getProgressToNextRank = () => {
    const nextRank = getNextRank();
    if (!nextRank) return 100;

    const progress = ((totalSpent - currentRank.minSpent) / (nextRank.minSpent - currentRank.minSpent)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Award loyalty points for purchase
  const awardPoints = (orderValue) => {
    const points = Math.floor(orderValue / 10);
    setLoyaltyPoints(prev => prev + points);
    return points;
  };

  // Check vault product eligibility
  const canAccessVaultProduct = (productId) => {
    // Basic vault access check
    if (!vaultAccess) return false;
    
    // Additional product-specific checks can be added here
    // For now, all vault products require ₹25k+ spent
    return totalSpent >= 25000;
  };

  const value = {
    currentRank,
    totalSpent,
    loyaltyPoints,
    vaultAccess,
    canAccessTier,
    getNextRank,
    getProgressToNextRank,
    awardPoints,
    canAccessVaultProduct,
    RANK_TIERS
  };

  return (
    <RankContext.Provider value={value}>
      {children}
    </RankContext.Provider>
  );
};