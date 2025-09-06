import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useCart } from '../context/CartContext';
import { useShopify } from './ShopifyIntegration';
import CustomerProfile from './CustomerAccount/CustomerProfile';
import { User, LogIn, LogOut, ShoppingBag, Search, Menu, X, Crown, Settings, UserCircle2 } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import SearchModal from './SearchModal';
import { useI18n } from '../hooks/useI18n';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isReducedMotion, currentTheme } = useTheme();
  const { t } = useI18n();
  const { itemCount } = useCart();
  const { customer, orders, loginCustomer, logoutCustomer, isLoading, initializeCustomer } = useShopify();

  const isOGTheme = currentTheme === 'og';

  // Initialize customer data on component mount
  useEffect(() => {
    initializeCustomer();
  }, []);

  const handleCustomerClick = () => {
    if (customer) {
      setShowCustomerProfile(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const getTierDisplay = () => {
    if (!customer || !orders) return null;
    
    const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
    
    if (totalSpent >= 50000) return { tier: 'VAULT LEGEND', icon: <Crown className="text-yellow-400" size={14} /> };
    if (totalSpent >= 25000) return { tier: 'OG COMMANDER', icon: <Crown className="text-purple-400" size={14} /> };
    if (totalSpent >= 10000) return { tier: 'BATTLE ELITE', icon: <Crown className="text-blue-400" size={14} /> };
    if (totalSpent >= 5000) return { tier: 'WARRIOR', icon: <Crown className="text-green-400" size={14} /> };
    return { tier: 'REBEL', icon: <User className="text-gray-400" size={14} /> };
  };

  const tierDisplay = getTierDisplay();

  return (
    <div className="relative">
      {/* Dynamic Banner - UPDATED WITH DELIVERY PROMISE */}
      <div className="bg-[var(--color-accent)] text-[var(--color-bg)] text-center py-2 text-sm font-medium tracking-wider">
        {isOGTheme ? (
          <div className="flex items-center justify-center space-x-4">
            <span>🚀 FREE 3-DAY EXPRESS DELIVERY</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">🔥 FLASH SALE ENDS SOON</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">⚡ EVERY FAN IS A SOLDIER</span>
          </div>
        ) : (
          'FREE STANDARD SHIPPING ON ALL ORDERS'
        )}
      </div>
      
      {/* Main Header */}
      <header className="bg-[var(--color-bg)] text-[var(--color-text)] px-6 py-4 border-b border-[var(--color-steel)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-3xl font-black font-headline tracking-wider text-[var(--color-red)] hover:text-white transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(193,18,31,0.8)]"
            >
              OG
            </Link>
          </div>

          {/* Navigation with Ranks */}
          <nav className="hidden lg:flex items-center space-x-8">
            {/* Ranks Display */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Rank:</span>
              <span className="text-yellow-400 font-bold">
                {customer && orders?.length > 0 ? 'REBEL' : 'FOOT SOLDIER'}
              </span>
            </div>

            <div className="relative group">
              <Link 
                to="/shop" 
                className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              >
                ARMORY
              </Link>
              {/* Dropdown Menu - CLEAN VERSION WITHOUT EMOJIS */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-[var(--color-bg)] border border-[var(--color-steel)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/shop" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    ALL ARSENAL
                  </Link>
                  <Link to="/shop?category=Tee Shirts" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    REBEL TEES
                  </Link>
                  <Link to="/shop?category=Hoodies" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    PREDATOR HOODIES
                  </Link>
                  <Link to="/shop?category=Shirts" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    FORMAL ARSENAL  
                  </Link>
                  <Link to="/shop?category=Sweatshirts" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    COMBAT SWEATS
                  </Link>
                  <Link to="/shop?category=Posters" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    WAR POSTERS
                  </Link>
                  <Link to="/shop?category=Accessories" className="block px-4 py-2 text-sm hover:bg-[var(--color-steel)] transition-colors">
                    GEAR & ACCESSORIES
                  </Link>
                </div>
              </div>
            </div>
            
            {isOGTheme && (
              <Link 
                to="/shop?filter=vault" 
                className="text-[var(--color-gold)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium flex items-center space-x-1"
              >
                <span>🔒</span>
                <span>VAULT</span>
              </Link>
            )}
            
            <Link 
              to="/about" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              ABOUT
            </Link>
            
            <Link 
              to="/contact" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              CONTACT
            </Link>
          </nav>

          {/* Right Icons - ACCOUNT & SETTINGS PROMINENTLY DISPLAYED */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors duration-[var(--transition-base)] ${
                isReducedMotion ? 'transition-none' : ''
              }`}
              title={t('navigation.search')}
            >
              <Search size={20} />
            </button>
            
            {/* ACCOUNT BUTTON - PROMINENTLY DISPLAYED */}
            {customer ? (
              <div className="flex items-center space-x-2">
                {/* Settings/Profile Button */}
                <button 
                  onClick={handleCustomerClick}
                  className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg transition-all duration-[var(--transition-base)] ${
                    isReducedMotion ? 'transition-none' : ''
                  }`}
                  title={`Account Settings - ${customer.firstName} ${customer.lastName}`}
                >
                  <UserCircle2 size={18} className="text-white" />
                  <span className="text-white font-medium text-sm hidden md:block">
                    {customer.firstName}
                  </span>
                  <Settings size={14} className="text-white/80" />
                </button>

                {/* Tier Badge - Clickable */}
                <Link 
                  to="/battle-elite"
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-all hover:scale-105"
                  title={`Your Tier: ${tierDisplay?.tier}`}
                >
                  {tierDisplay?.icon}
                  <span className="hidden md:block text-xs font-bold">
                    {tierDisplay?.tier}
                  </span>
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleCustomerClick}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-lg transition-all duration-[var(--transition-base)] ${
                  isReducedMotion ? 'transition-none' : ''
                }`}
                title="Login to your OG Account"
              >
                <LogIn size={18} className="text-white" />
                <span className="text-white font-medium text-sm hidden md:block">
                  LOGIN
                </span>
              </button>
            )}
            
            <Link
              to="/cart"
              className={`p-2 hover:bg-[var(--color-panel)] rounded-full transition-colors duration-[var(--transition-base)] relative ${
                isReducedMotion ? 'transition-none' : ''
              }`}
            >
              <ShoppingBag size={20} />
              {/* Cart Badge */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-[var(--color-bg)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-800 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - UPDATED */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/shop" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ARMORY
              </Link>
              <Link 
                to="/shop?filter=vault" 
                className="text-[var(--color-gold)] hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                VAULT
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                ABOUT
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-gray-300 transition-colors uppercase tracking-wider text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                CONTACT
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />

      {/* Customer Profile Modal */}
      {customer && (
        <CustomerProfile
          customer={customer}
          orders={orders}
          isOpen={showCustomerProfile}
          onClose={() => setShowCustomerProfile(false)}
        />
      )}

      {/* Improved Login Modal with Real Shopify Integration */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-4">🔥 Access Your OG Account</h2>
              <p className="text-gray-300 mb-6">Sign in to unlock VAULT access, track orders, and manage your OG profile!</p>
              
              <div className="space-y-4">
                <div className="text-left space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="warrior@ogarmory.com"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      id="login-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      id="login-password"
                    />
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const email = document.getElementById('login-email').value;
                    const password = document.getElementById('login-password').value;
                    
                    if (email && password) {
                      const result = await loginCustomer(email, password);
                      if (result.success) {
                        setShowLoginModal(false);
                      } else {
                        alert('Login failed: ' + result.error);
                      }
                    } else {
                      alert('Please enter both email and password');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-3 rounded-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? '🔄 Signing In...' : '🚀 Sign In to OG Account'}
                </button>
                
                <div className="text-sm text-gray-400 space-y-2">
                  <div>✅ Real Shopify account integration</div>
                  <div>✅ Order tracking & history</div>
                  <div>✅ VAULT exclusive access</div>
                  <div>✅ Loyalty tier progression</div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-3">Don't have an account?</p>
                  <button
                    onClick={() => {
                      // For now, show create account message
                      alert('Account creation coming soon! Contact support@ogarmory.com');
                    }}
                    className="w-full border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 py-3 rounded-lg transition-colors"
                  >
                    Create OG Account
                  </button>
                </div>
                
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="w-full text-gray-400 hover:text-white transition-colors mt-4"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;