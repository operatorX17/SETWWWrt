import React, { useState } from 'react';
import { User, Package, Heart, Settings, MapPin, CreditCard, LogOut } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const mockOrders = [
    {
      id: '#AXM-001',
      date: '2024-12-01',
      status: 'Delivered',
      total: 250,
      items: ['Freedom Graphic Tee', 'Track Pants']
    },
    {
      id: '#AXM-002', 
      date: '2024-11-28',
      status: 'Shipped',
      total: 165,
      items: ['Motion Track Jacket']
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Alex"
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Johnson"
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="alex.johnson@email.com"
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full bg-gray-900 border border-gray-700 px-4 py-3 focus:outline-none focus:border-white"
                  />
                </div>
              </div>
              <button className="mt-6 bg-white text-black px-8 py-3 font-semibold uppercase tracking-wider hover:bg-gray-100 transition-colors">
                Update Profile
              </button>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Order History</h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="border border-gray-800 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-400 text-sm">Placed on {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <span className={`inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-600' : 'bg-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-300 text-sm">
                    Items: {order.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Wishlist</h2>
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto mb-4 text-gray-600" />
              <p className="text-gray-400">Your wishlist is empty</p>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Addresses</h2>
              <button className="border border-white px-6 py-2 font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                Add New Address
              </button>
            </div>
            <div className="border border-gray-800 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold mb-2">Home</h3>
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Alex Johnson</p>
                    <p>123 Main Street</p>
                    <p>New York, NY 10001</p>
                    <p>United States</p>
                  </div>
                </div>
                <button className="text-sm text-gray-400 hover:text-white underline">
                  Edit
                </button>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Payment Methods</h2>
              <button className="border border-white px-6 py-2 font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                Add New Card
              </button>
            </div>
            <div className="border border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold mb-2">•••• •••• •••• 4242</h3>
                  <p className="text-gray-400 text-sm">Expires 12/26</p>
                </div>
                <button className="text-sm text-gray-400 hover:text-white underline">
                  Remove
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-4 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-gray-400 text-sm">Receive updates about your orders</p>
                </div>
                <button className="w-12 h-6 bg-white rounded-full relative">
                  <div className="w-5 h-5 bg-black rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-gray-800">
                <div>
                  <h3 className="font-medium">Marketing Emails</h3>
                  <p className="text-gray-400 text-sm">Get the latest news and offers</p>
                </div>
                <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
              <button className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors">
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-black'
                        : 'hover:bg-gray-900'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;