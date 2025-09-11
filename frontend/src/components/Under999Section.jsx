import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, TrendingUp, Star } from 'lucide-react';
import ProductCard from './ProductCard';

const Under999Section = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-green-900/20 via-black to-green-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
              UNDER ₹999
            </h2>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
          </div>
          
          <p className="text-xl text-green-400 font-semibold mb-2">
            AFFORDABLE REBELLION — MAXIMUM IMPACT
          </p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Premium quality gear that won't break the bank. Perfect for rebels on a budget.
          </p>
          
          {/* Value Proposition Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <Star className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">PREMIUM QUALITY</span>
            </div>
            <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">FAST SHIPPING</span>
            </div>
            <div className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm font-semibold">BEST VALUE</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.slice(0, 8).map((product, index) => (
            <div key={product.id || product.handle || index} className="group">
              <ProductCard 
                product={product} 
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
                priority={index < 4}
              />
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600/10 via-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">
              🔥 LIMITED TIME OFFER
            </h3>
            <p className="text-green-300 text-lg mb-6">
              Get premium rebel gear under ₹999. Quality that exceeds expectations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/shop?filter=under-999"
                className="group bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 hover:from-green-700 hover:via-green-600 hover:to-emerald-600 text-black font-black py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/50 uppercase tracking-wider"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  SHOP ALL UNDER ₹999
                  <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <div className="text-center">
                <div className="text-green-400 font-bold text-sm">
                  ✅ FREE SHIPPING OVER ₹500
                </div>
                <div className="text-gray-400 text-xs">
                  🚀 Express delivery available
                </div>
              </div>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>2,847+ rebels love our under ₹999 collection</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>4.8★ average rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Under999Section;