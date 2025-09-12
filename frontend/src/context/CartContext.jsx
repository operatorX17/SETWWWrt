import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE':
      return {
        ...state,
        items: action.payload.items || [],
        total: action.payload.total || 0
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'ADD_ITEM':
      console.log('Cart: Adding item:', action.payload);
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
        newItems = [...state.items, action.payload];
      }
      
      const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      console.log('Cart: New items:', newItems);
      console.log('Cart: New total:', newTotal);
      
      return {
        ...state,
        items: newItems,
        total: newTotal
      };
    
    case 'REMOVE_ITEM':
      console.log('Cart: Removing item:', action.payload);
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
      console.log('Cart: Updating quantity:', action.payload);
      
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

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('og-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Cart: Loading from storage:', parsedCart);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsedCart });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      const cartData = {
        items: state.items,
        total: state.total
      };
      console.log('Cart: Saving to storage:', cartData);
      localStorage.setItem('og-cart', JSON.stringify(cartData));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items, state.total]);

  const addToCart = (product, selectedSize = 'M', quantity = 1) => {
    console.log('Cart: addToCart called with:', { product: product?.title, selectedSize, quantity });
    
    // Handle different call formats
    let cartItem;
    
    if (typeof selectedSize === 'object' || (!selectedSize && product.selectedSize)) {
      // Single parameter call with product containing all info
      cartItem = {
        id: product.id,
        title: product.title,
        price: parseInt(product.price) || 0,
        images: product.images || [],
        selectedSize: product.selectedSize || 'M',
        selectedColor: product.selectedColor || 'Default',
        quantity: product.quantity || 1
      };
    } else {
      // Traditional call
      cartItem = {
        id: product.id,
        title: product.title,
        price: parseInt(product.price) || 0,
        images: product.images || [],
        selectedSize: selectedSize || 'M',
        selectedColor: product.selectedColor || 'Default',
        quantity: quantity
      };
    }
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
  };

  const removeFromCart = (itemId, selectedSize) => {
    dispatch({ 
      type: 'REMOVE_ITEM', 
      payload: selectedSize ? { id: itemId, selectedSize } : itemId 
    });
  };

  const updateQuantity = (itemId, selectedSizeOrQuantity, quantity) => {
    console.log('Cart: updateQuantity called with:', { itemId, selectedSizeOrQuantity, quantity });
    
    // Handle both 2-parameter and 3-parameter calls
    if (typeof selectedSizeOrQuantity === 'number' && !quantity) {
      // 2-parameter call: updateQuantity(itemId, quantity)
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity: selectedSizeOrQuantity } });
    } else {
      // 3-parameter call: updateQuantity(itemId, selectedSize, quantity)
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, selectedSize: selectedSizeOrQuantity, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const value = {
    items: state.items,
    total: state.total,
    loading: state.loading,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
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