import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { usePurchase } from './PurchaseContext';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && 
               item.selectedVariant?.size === action.payload.selectedVariant?.size
      );
      
      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.slice();
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
      } else {
        newItems = state.items.concat(action.payload);
      }
      
      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity === 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };
    
    default:
      return state;
  }
};

const initialState = {
  items: [],
  total: 0,
  loading: false
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { recordPurchase } = usePurchase();

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('og-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach(item => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      }
    } catch (error) {
      console.warn('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('og-cart', JSON.stringify({
        items: state.items,
        total: state.total
      }));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [state.items, state.total]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    const cartItem = {
      id: `${product.id}-${selectedVariant?.size || 'default'}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      selectedVariant,
      quantity
    };
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // FIXED: Direct checkout with UPI/WhatsApp
  const proceedToCheckout = () => {
    const orderText = state.items.map(item => 
      `${item.name} (${item.selectedVariant?.size || 'Default'}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}`
    ).join('\n');
    
    const total = state.total + (state.total * 0.18); // Add 18% GST
    const whatsappUrl = `https://wa.me/919876543210?text=🔥 NEW OG ORDER 🔥%0A%0A${encodeURIComponent(orderText)}%0A%0ATotal: ₹${total.toFixed(2)}%0A%0APlease confirm my order!`;
    
    // Record the purchase to unlock vault products
    recordPurchase({
      items: state.items,
      total: total
    });
    
    // Clear cart after purchase
    dispatch({ type: 'CLEAR_CART' });
    
    window.open(whatsappUrl, '_blank');
  };

  const value = {
    items: state.items,
    total: state.total,
    loading: state.loading,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    proceedToCheckout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};