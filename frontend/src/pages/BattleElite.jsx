import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Star, Shield, Zap, Gift, TrendingUp } from 'lucide-react';

const BattleElite = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-4 mb-6">
            <Crown className="text-blue-400" size={48} />
            <h1 className="text-5xl font-black text-white">BATTLE ELITE</h1>
            <Crown className="text-blue-400" size={48} />
          </div>
          <p className="text-xl text-blue-300 mb-4">Elite Tier • ₹10,000+ Spent</p>
          <p className="text-gray-300 max-w-2xl mx-auto">
            You've proven your dedication to the rebellion. Welcome to the elite ranks where legends are forged.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 text-center">
            <Shield className="text-blue-400 mx-auto mb-3" size={32} />
            <div className="text-2xl font-bold text-blue-400">ELITE</div>
            <div className="text-sm text-gray-400">Current Rank</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
            <TrendingUp className="text-green-400 mx-auto mb-3" size={32} />
            <div className="text-2xl font-bold text-white">₹15,495</div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
            <Gift className="text-purple-400 mx-auto mb-3" size={32} />
            <div className="text-2xl font-bold text-white">7</div>
            <div className="text-sm text-gray-400">Elite Perks Unlocked</div>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 text-center">
            <Star className="text-yellow-400 mx-auto mb-3" size={32} />
            <div className="text-2xl font-bold text-white">1,549</div>
            <div className="text-sm text-gray-400">Loyalty Points</div>
          </div>
        </div>

        {/* Elite Perks */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Your Elite Arsenal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="text-blue-400" size={24} />, title: '20% Additional Discount', desc: 'Extra savings on all orders' },
              { icon: <Shield className="text-blue-400" size={24} />, title: 'Priority Support', desc: 'Skip the queue, elite assistance' },
              { icon: <Gift className="text-blue-400" size={24} />, title: 'Birthday Special Drops', desc: 'Exclusive releases on your day' },
              { icon: <Star className="text-blue-400" size={24} />, title: 'Early Access', desc: 'First to see new collections' },
              { icon: <Crown className="text-blue-400" size={24} />, title: 'Elite Badge', desc: 'Show your rank with pride' },
              { icon: <TrendingUp className="text-blue-400" size={24} />, title: 'Double Loyalty Points', desc: '2x points on every purchase' }
            ].map((perk, index) => (
              <div key={index} className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-6 hover:bg-blue-900/20 transition-all">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{perk.icon}</div>
                  <div>
                    <h3 className="text-white font-bold mb-2">{perk.title}</h3>
                    <p className="text-gray-400 text-sm">{perk.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Tier Progress */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-8 mb-16">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Next Tier: OG COMMANDER</h3>
            <p className="text-gray-300">Spend ₹9,505 more to unlock commander privileges</p>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-4 rounded-full transition-all duration-1000"
              style={{ width: '62%' }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>BATTLE ELITE (₹10,000)</span>
            <span>62% Complete</span>
            <span>OG COMMANDER (₹25,000)</span>
          </div>
        </div>

        {/* Exclusive Content */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Elite Exclusive Store</h3>
          <p className="text-gray-300 mb-6">Access premium collections and limited drops</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/shop?filter=premium"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              PREMIUM COLLECTION
            </Link>
            <Link 
              to="/shop?filter=vault"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              VIEW VAULT ACCESS
            </Link>
          </div>
        </div>

        {/* Back to Arsenal */}
        <div className="text-center mt-12">
          <Link 
            to="/shop"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>← Back to Arsenal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BattleElite;