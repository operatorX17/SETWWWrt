import React, { useState, useEffect } from 'react';
import { User, Package, Star, Crown, Shield, Zap, Gift, TrendingUp, LogOut, Settings, Bell, MapPin } from 'lucide-react';
import { useShopify } from '../ShopifyIntegration';

const CustomerProfile = ({ customer, orders, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [customerTier, setCustomerTier] = useState('REBEL');
  const [vaultAccess, setVaultAccess] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const { logoutCustomer } = useShopify();

  // Don't render if not open
  if (!isOpen || !customer) return null;

  useEffect(() => {
    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const total = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
      setTotalSpent(total);
      setLoyaltyPoints(Math.floor(total / 10)); // 1 point per ₹10 spent
      
      // Determine customer tier
      if (total >= 50000) {
        setCustomerTier('VAULT LEGEND');
        setVaultAccess(true);
      } else if (total >= 25000) {
        setCustomerTier('OG COMMANDER');
        setVaultAccess(true);
      } else if (total >= 10000) {
        setCustomerTier('BATTLE ELITE');
      } else if (total >= 5000) {
        setCustomerTier('WARRIOR');
      } else {
        setCustomerTier('REBEL');
      }
    }
  }, [orders]);

  const getTierIcon = () => {
    switch (customerTier) {
      case 'VAULT LEGEND': return <Crown className="text-yellow-400" size={20} />;
      case 'OG COMMANDER': return <Shield className="text-purple-400" size={20} />;
      case 'BATTLE ELITE': return <Star className="text-blue-400" size={20} />;
      case 'WARRIOR': return <Zap className="text-green-400" size={20} />;
      default: return <User className="text-gray-400" size={20} />;
    }
  };

  const getTierPerks = () => {
    const basePerks = ['🔥 Exclusive Product Access', '⚡ Early Drop Notifications'];
    
    switch (customerTier) {
      case 'VAULT LEGEND':
        return [...basePerks, '👑 VAULT Collection Access', '🎯 Personal OG Concierge', '🚀 Same Day Delivery', '💎 Custom Design Service'];
      case 'OG COMMANDER':
        return [...basePerks, '🔒 VAULT Collection Access', '🎁 Exclusive Merchandise', '📦 Priority Shipping'];
      case 'BATTLE ELITE':
        return [...basePerks, '⭐ 20% Additional Discount', '🎊 Birthday Special Drops'];
      case 'WARRIOR':
        return [...basePerks, '💪 15% Additional Discount', '🎉 Member-Only Sales'];
      default:
        return basePerks;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose} // Click backdrop to close
    >
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center">
              {getTierIcon()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{customer?.firstName} {customer?.lastName}</h2>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  customerTier === 'VAULT LEGEND' ? 'bg-yellow-600 text-black' :
                  customerTier === 'OG COMMANDER' ? 'bg-purple-600 text-white' :
                  customerTier === 'BATTLE ELITE' ? 'bg-blue-600 text-white' :
                  customerTier === 'WARRIOR' ? 'bg-green-600 text-white' :
                  'bg-gray-600 text-white'
                }`}>
                  {customerTier}
                </span>
                {vaultAccess && (
                  <span className="bg-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                    🔒 VAULT ACCESS
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl leading-none p-2 hover:bg-gray-700 rounded-full transition-colors"
            style={{ lineHeight: '1' }}
          >
            ✕
          </button>
          
          {/* Logout Button */}
          <button 
            onClick={async () => {
              await logoutCustomer();
              onClose();
            }} 
            className="flex items-center space-x-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white text-sm font-medium ml-2"
            title="Logout from OG Account"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">₹{totalSpent.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Spent</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{orders?.length || 0}</div>
            <div className="text-sm text-gray-400">Orders Placed</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{loyaltyPoints}</div>
            <div className="text-sm text-gray-400">Loyalty Points</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.floor((totalSpent / 1000) * 10) / 10}%
            </div>
            <div className="text-sm text-gray-400">Next Tier Progress</div>
          </div>
        </div>

        {/* Tabs - Enhanced with Settings */}
        <div className="px-6">
          <div className="flex space-x-6 border-b border-gray-700 overflow-x-auto">
            {['profile', 'orders', 'settings', 'perks', 'vault'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-red-500 text-red-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'profile' && '👤 Profile'}
                {tab === 'orders' && '📦 Orders & Tracking'}
                {tab === 'settings' && '⚙️ Settings'}
                {tab === 'perks' && '🎁 Tier Perks'}
                {tab === 'vault' && '🔒 Vault Access'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      <div className="text-white">{customer?.email}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      <div className="text-white">{customer?.phone || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Member Since</label>
                      <div className="text-white">{new Date(customer?.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Delivery Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-white">🚀 Express 3-Day Delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-white">📱 SMS Order Updates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-white">📧 Email Notifications</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Bell className="mr-2" size={20} />
                    Notification Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">📧 Email Notifications</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">📱 SMS Order Updates</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">🔥 New Drop Alerts</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">💎 VAULT Exclusive Alerts</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Shipping Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">🚀 Express 3-Day Delivery</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">📦 Signature Required</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">🏠 Safe Place Delivery</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Settings className="mr-2" size={20} />
                  Account Settings
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Change Password</h4>
                    <p className="text-gray-400 text-sm mb-3">Update your account password for better security</p>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Update Profile</h4>
                    <p className="text-gray-400 text-sm mb-3">Change your name, email, or phone number</p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-white mb-2">Privacy Settings</h4>
                    <p className="text-gray-400 text-sm mb-3">Manage your data and privacy preferences</p>
                    <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                      Privacy Controls
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Recent Orders</h3>
              {orders?.length > 0 ? orders.map((order, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-bold">Order #{order.order_number}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-green-400 font-bold">
                          ₹{parseFloat(order.total_price).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.fulfillment_status === 'fulfilled' ? 'bg-green-600' :
                          order.fulfillment_status === 'partial' ? 'bg-yellow-600' :
                          'bg-blue-600'
                        } text-white`}>
                          {order.fulfillment_status === 'fulfilled' ? '✅ Delivered' :
                           order.fulfillment_status === 'partial' ? '🚚 In Transit' :
                           '📦 Processing'}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          🚀 3-Day Delivery
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="text-sm text-gray-300">Items:</div>
                      {order.line_items.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-400 flex justify-between">
                          <span>{item.title} {item.variant_title && `(${item.variant_title})`}</span>
                          <span>Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
              )) : (
                <div className="text-center py-8 text-gray-400">
                  <Package size={48} className="mx-auto mb-4" />
                  <p>No orders yet. Start building your arsenal!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'perks' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Your Current Tier Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getTierPerks().map((perk, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-800 rounded-lg p-3">
                      <div className="text-green-400">✓</div>
                      <span className="text-white">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Tier Progression</h3>
                <div className="space-y-3">
                  {[
                    { name: 'REBEL', requirement: '₹0', color: 'bg-gray-600' },
                    { name: 'WARRIOR', requirement: '₹5,000', color: 'bg-green-600' },
                    { name: 'BATTLE ELITE', requirement: '₹10,000', color: 'bg-blue-600' },
                    { name: 'OG COMMANDER', requirement: '₹25,000', color: 'bg-purple-600' },
                    { name: 'VAULT LEGEND', requirement: '₹50,000', color: 'bg-yellow-600' }
                  ].map((tier, index) => (
                    <div key={index} className={`p-3 rounded-lg ${tier.color} ${
                      customerTier === tier.name ? 'ring-2 ring-white' : 'opacity-70'
                    }`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{tier.name}</span>
                        <span className="text-sm text-white">{tier.requirement}+ spent</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-6">
              {vaultAccess ? (
                <div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-4">🔒 VAULT ACCESS GRANTED</h3>
                  <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-bold text-white mb-2">Exclusive Collections</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>👑 Night Hunter Hoodie - ₹4,999</li>
                          <li>⚡ Shadow Emperor Collection</li>
                          <li>🔥 Alpha Talisman Series</li>
                          <li>💎 Custom Design Service</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-2">VIP Benefits</h4>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>🚀 Same Day Delivery</li>
                          <li>📞 Personal OG Concierge</li>
                          <li>🎁 Quarterly Surprise Box</li>
                          <li>⚡ NFT Collectibles Access</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-bold text-white mb-2">VAULT Access Locked</h3>
                  <p className="text-gray-400 mb-4">
                    Spend ₹{(25000 - totalSpent).toLocaleString()} more to unlock VAULT privileges
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 h-2 rounded-full"
                      style={{ width: `${Math.min((totalSpent / 25000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {Math.floor((totalSpent / 25000) * 100)}% progress to OG COMMANDER tier
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;