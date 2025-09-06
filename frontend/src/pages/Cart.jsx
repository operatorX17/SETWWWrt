import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import BuyButtons from '../components/ConversionElements/BuyButtons';
import CartSuggestions from '../components/CartSuggestions';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] pt-20">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold text-white mb-4">Your Arsenal is Empty</h1>
          <p className="text-gray-400 mb-8">Time to gear up, soldier.</p>
          <Link 
            to="/shop"
            className="inline-block bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 px-8 rounded-lg transition-all"
          >
            START SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const gst = subtotal * 0.18;
  const finalTotal = subtotal + gst;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Your Arsenal</h1>
          <button 
            onClick={clearCart}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {(() => {
                      const imgs = item.images || [];
                      if (imgs.length === 0) return (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <ShoppingBag size={24} className="text-gray-500" />
                        </div>
                      );
                      
                      if (imgs.length === 1) return (
                        <img src={imgs[0]} alt={item.name} className="w-full h-full object-cover" />
                      );
                      
                      const normalize = (s) => (typeof s === 'string' ? s.toLowerCase() : '');
                      const backIdx = imgs.findIndex((u) => {
                        const v = normalize(u);
                        return v.includes('/back/') || v.includes(' back') || v.includes('_back') || v.includes('-back') || v.includes('back/');
                      });
                      
                      const displayImage = backIdx !== -1 ? imgs[backIdx] : (imgs[1] || imgs[0]);
                      return <img src={displayImage} alt={item.name} className="w-full h-full object-cover" />;
                    })()}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">{item.name}</h3>
                    <div className="text-sm text-gray-400 mb-2">
                      Size: {item.selectedVariant?.size || 'M'} • Color: {item.selectedVariant?.color || 'Default'}
                    </div>
                    <div className="text-lg font-bold text-red-400">
                      {formatPrice(item.price)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Minus size={16} className="text-white" />
                    </button>
                    
                    <span className="text-white font-bold w-8 text-center">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-gray-700 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors ml-2"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                  <span className="text-gray-400">Item Total:</span>
                  <span className="text-white font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Checkout */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal ({items.length} items)</span>
                  <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">GST (18%)</span>
                  <span className="text-white">{formatPrice(gst)}</span>
                </div>
                
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-red-400 font-bold text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Elements */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <div className="text-center text-sm text-gray-300 space-y-1">
                  <div>💰 COD Available</div>
                  <div>🚚 2–5 Day Delivery</div>
                  <div>🔄 7-Day Size Swap</div>
                </div>
              </div>
            </div>

            {/* Buy Buttons */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Choose Payment</h3>
              <BuyButtons 
                product={{
                  name: `${items.length} Items`,
                  price: finalTotal
                }}
                className="space-y-3"
              />
            </div>

            {/* Additional Offers & Suggestions */}
            <CartSuggestions className="mb-6" />
            
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-center">
                <div className="text-green-400 font-bold mb-2">🎁 Add More & Save</div>
                <div className="text-sm text-gray-300 mb-3">
                  Spend ₹{Math.max(0, 2000 - subtotal).toLocaleString()} more for bundle discount
                </div>
                <Link 
                  to="/shop"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;