import React, { createContext, useContext, useState, useEffect } from 'react';

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [hasMadePurchase, setHasMadePurchase] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  // Load purchase status from localStorage on mount
  useEffect(() => {
    try {
      const savedPurchaseStatus = localStorage.getItem('og-purchase-status');
      const savedPurchaseHistory = localStorage.getItem('og-purchase-history');
      
      if (savedPurchaseStatus) {
        setHasMadePurchase(JSON.parse(savedPurchaseStatus));
      }
      
      if (savedPurchaseHistory) {
        setPurchaseHistory(JSON.parse(savedPurchaseHistory));
      }
    } catch (error) {
      console.warn('Failed to load purchase status from localStorage:', error);
    }
  }, []);

  // Save purchase status to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('og-purchase-status', JSON.stringify(hasMadePurchase));
      localStorage.setItem('og-purchase-history', JSON.stringify(purchaseHistory));
    } catch (error) {
      console.warn('Failed to save purchase status to localStorage:', error);
    }
  }, [hasMadePurchase, purchaseHistory]);

  const recordPurchase = (orderDetails) => {
    const purchase = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      items: orderDetails.items,
      total: orderDetails.total,
      method: 'whatsapp' // Since we're using WhatsApp checkout
    };
    
    setHasMadePurchase(true);
    setPurchaseHistory(prev => [...prev, purchase]);
  };

  const resetPurchaseStatus = () => {
    setHasMadePurchase(false);
    setPurchaseHistory([]);
    localStorage.removeItem('og-purchase-status');
    localStorage.removeItem('og-purchase-history');
  };

  const value = {
    hasMadePurchase,
    purchaseHistory,
    recordPurchase,
    resetPurchaseStatus
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};