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
               item.selectedSize === action.payload.selectedSize
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
      const filteredItems = state.items.filter(item => {
        if (typeof action.payload === 'object') {
          return !(item.id === action.payload.id && item.selectedSize === action.payload.selectedSize);
        }
        return item.id !== action.payload;
      });
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity === 0) {
        return cartReducer(state, { 
          type: 'REMOVE_ITEM', 
          payload: { id: action.payload.id, selectedSize: action.payload.selectedSize } 
        });
      }
      
      const updatedItems = state.items.map(item => {
        const matchesId = item.id === action.payload.id;
        const matchesSize = action.payload.selectedSize ? 
          item.selectedSize === action.payload.selectedSize : true;
        
        return (matchesId && matchesSize)
          ? { ...item, quantity: action.payload.quantity }
          : item;
      });
      
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

  const addToCart = (product, selectedVariant = null, quantity = 1) => {
    // Handle different call formats
    let cartItem;
    
    if (selectedVariant === null && typeof product === 'object' && product.selectedSize) {
      // Single parameter call with product containing all info
      cartItem = {
        id: product.id,
        productId: product.id,
        title: product.title,
        price: parseInt(product.price),
        images: product.images,
        selectedSize: product.selectedSize || 'M',
        selectedColor: product.selectedColor || 'Default',
        quantity: product.quantity || 1
      };
    } else {
      // Traditional multi-parameter call
      cartItem = {
        id: product.id,
        productId: product.id,
        title: product.title,
        price: parseInt(product.price),
        images: product.images,
        selectedSize: selectedVariant?.size || selectedVariant || 'M',
        selectedColor: product.selectedColor || product.defaultColor || 'Default',
        quantity: quantity
      };
    }
    
    console.log('Adding to cart:', cartItem); // Debug log
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeFromCart = (itemId, selectedSize) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: selectedSize ? { id: itemId, selectedSize } : itemId 
    });
  };

  const updateQuantity = (itemId, selectedSize, quantity) => {
    // Handle both 2-parameter and 3-parameter calls
    if (typeof selectedSize === 'number') {
      // 2-parameter call: updateQuantity(itemId, quantity)
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: selectedSize } });
    } else {
      // 3-parameter call: updateQuantity(itemId, selectedSize, quantity)
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, selectedSize, quantity } });
    }
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