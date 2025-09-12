import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { currentTier, totalPurchases } = useTier();

  // Check if current theme is OG
  const isOGTheme = theme?.name === 'og' || theme?.slug === 'og' || theme === 'og';

  const getTierDisplay = () => {
    return {
      name: currentTier?.name || 'SOLDIER',
      color: currentTier?.color || '#ff0000',
      next: currentTier?.next || 'LIEUTENANT',
      progress: Math.min((totalPurchases / (currentTier?.threshold || 10000)) * 100, 100)
    };
  };

  // Scroll detection for navigation visibility - ALWAYS SHOW EXCEPT HOME, MORE CONSISTENT
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    
    if (!isHomePage) {
      // Always show header on non-home pages - CONSTANT VISIBILITY
      setIsVisible(true);
      return;
    }
    
    // Home page logic - hide until after hero video
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroVideoHeight = window.innerHeight; // Full viewport height for hero video
      
      // Only show header after scrolling past the hero video section on home page
      if (currentScrollY > heroVideoHeight - 100) {
        setIsVisible(true); // Always show once visible on home page
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

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      navigate('/auth');
    }
  };

  const tierDisplay = getTierDisplay();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`} style={{ height: '80px' }}>
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

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Tier Display - UPDATED */}
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full px-3 py-1 border border-gray-600">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tierDisplay.color }}
              />
              <span className="text-xs font-bold text-white">{tierDisplay.name}</span>
            </div>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="relative text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-red)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="relative text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-red)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <button 
              onClick={handleAuthAction}
              className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              <User size={20} />
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[var(--color-bg)] border-b border-[var(--color-steel)] py-4 px-6">
          <nav className="space-y-4">
            <Link 
              to="/shop" 
              className="block text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              ARMORY
            </Link>
            <Link 
              to="/shop?filter=vault" 
              className="block text-[var(--color-gold)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              VAULT
            </Link>
            <Link 
              to="/about" 
              className="block text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT
            </Link>
            <Link 
              to="/contact" 
              className="block text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors uppercase tracking-wider text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACT
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;