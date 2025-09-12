import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/price';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingNavigation from '../components/FloatingNavigation';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <FloatingNavigation />
        
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Your Arsenal is Empty</h2>
            <p className="text-gray-400 mb-8">Add some gear to your collection</p>
            <Link 
              to="/shop" 
              className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Arsenal
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingNavigation />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Arsenal</h1>
          <Link 
            to="/shop" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.images?.[0] || '/placeholder-product.jpg'} 
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-800"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <p className="text-gray-400">Size: {item.selectedSize}</p>
                    <p className="text-red-400 font-bold">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, Math.max(0, item.quantity - 1))}
                      className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                      className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-red-400">₹{total}</span>
              </div>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-lg font-semibold transition-colors mb-4">
              Proceed to Checkout
            </button>
            
            <button 
              onClick={clearCart}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;