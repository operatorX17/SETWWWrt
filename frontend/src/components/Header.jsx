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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // Scroll detection for navigation visibility - ALWAYS SHOW EXCEPT HOME
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    
    if (!isHomePage) {
      // Always show header on non-home pages
      setIsVisible(true);
      return;
    }
    
    // Home page logic - hide until after hero video
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroVideoHeight = window.innerHeight; // Full viewport height for hero video
      
      // Only show header after scrolling past the hero video section on home page
      if (currentScrollY > heroVideoHeight - 100) {
        // Show header when scrolling up or when past hero video
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
          // Hide header when scrolling down (but only after hero video)
          setIsVisible(false);
        }
      } else {
        // Hide header completely when in hero video section on home page
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY, location.pathname]);

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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
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

          {/* Desktop Navigation - SIMPLIFIED */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/shop" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              ARMORY
            </Link>
            <Link 
              to="/shop?filter=vault" 
              className="text-[var(--color-gold)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              VAULT
            </Link>
            <Link 
              to="/about" 
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
            >
              ABOUT
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

      {/* Premium Login Modal with Shopify Integration */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-600/50 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center">
              {/* Premium Header */}
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Access your OG Armory account</p>
              </div>
              
              <div className="space-y-6">
                <div className="text-left space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:bg-gray-800 transition-all"
                      id="login-email"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:bg-gray-800 transition-all"
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
                  className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-red-500/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
                
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Forgot Password?
                  </button>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={() => {
                      alert('Account creation coming soon! Contact support@ogarmory.com');
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;