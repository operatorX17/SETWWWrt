import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Providers
import { ThemeProvider } from './hooks/useTheme';
import { CartProvider } from './context/CartContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { I18nProvider } from './hooks/useI18n';
import { ShopifyProvider } from './components/ShopifyIntegration';
import { ShopifyProfileProvider } from './components/ShopifyProfileIntegration';
import { RankProvider } from './components/ShopifyRankSystem';

// Performance Components
import PageTransition from './components/PerformanceOptimized/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';
import HelpButton from './components/HelpButton';

// Analytics
// import { ShopifyAnalytics } from 'lib/shopifyTracking';

// Import Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import About from './pages/About';
import Journal from './pages/Journal';
import Contact from './pages/Contact';
import SearchResults from './pages/SearchResults';
import Collections from './pages/Collections';
import CollectionDetail from './pages/CollectionDetail';
import BattleElite from './pages/BattleElite';

function App() {
  useEffect(() => {
    // Initialize PSPK Analytics
    // ShopifyAnalytics.init();
  }, []);

  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider>
          <PurchaseProvider>
            <CartProvider>
              <ShopifyProvider>
                <ShopifyProfileProvider>
                  <RankProvider>
                  <div className="App">
                    <BrowserRouter>
                      <PageTransition>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/collections" element={<Collections />} />
                          <Route path="/collections/:handle" element={<CollectionDetail />} />
                          <Route path="/shop" element={<Shop />} />
                          <Route path="/shop/category/:category" element={<Shop />} />
                          <Route path="/products/:handle" element={<ProductDetail />} />
                          <Route path="/product/:id" element={<ProductDetail />} />
                          <Route path="/search" element={<SearchResults />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/journal" element={<Journal />} />
                          <Route path="/journal/:id" element={<Journal />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/battle-elite" element={<BattleElite />} />
                        </Routes>
                      </PageTransition>
                    </BrowserRouter>
                    
                    {/* Global Help Button */}
                    <HelpButton />
                  </div>
                  </RankProvider>
                </ShopifyProfileProvider>
              </ShopifyProvider>
            </CartProvider>
          </PurchaseProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;// Cache cleared at Thu Sep  4 05:58:44 UTC 2025
