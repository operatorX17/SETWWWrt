import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMockDataIfShopifyUnavailable, shopify } from '../lib/shopify';
import { mockProducts } from '../data/mock';

// Cache products to prevent repeated loading
let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook for seamless product data management
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (cachedProducts && (now - lastFetchTime) < CACHE_DURATION) {
      setProducts(cachedProducts);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let allProducts = [];
      
      // Load Shopify products first (working images)
      try {
        const response = await fetch('/products.json');
        if (response.ok) {
          const shopifyProducts = await response.json();
          if (shopifyProducts && shopifyProducts.length > 0) {
            // Add proper badges to Shopify products for consistency
            const productsWithBadges = shopifyProducts.map(product => ({
              ...product,
              badges: product.badges || [
                product.tags?.includes('NEW') ? 'NEW' : null,
                'REBEL DROP',
                'FAN ARSENAL',
                product.price > 2000 ? 'PREMIUM' : null,
                product.tags?.includes('Limited') ? 'LIMITED' : null
              ].filter(Boolean)
            }));
            
            allProducts = [...productsWithBadges];
          }
        }
      } catch (shopifyError) {
        console.warn('Shopify products not found:', shopifyError.message);
      }
      
      // Helper function to normalize product names for comparison
      const normalizeProductName = (name) => {
        if (!name) return '';
        return name.toLowerCase().trim().replace(/[\s\-_]/g, '');
      };
      
      // Helper function to check if product already exists
      const productExists = (newProduct, existingProducts) => {
        return existingProducts.some(existing => {
          // Check by ID first
          if (existing.id === newProduct.id) return true;
          
          // Check by handle
          if (existing.handle && newProduct.handle && existing.handle === newProduct.handle) return true;
          
          // Check by normalized name
          const existingName = normalizeProductName(existing.name || existing.title);
          const newName = normalizeProductName(newProduct.name || newProduct.title);
          if (existingName && newName && existingName === newName) return true;
          
          return false;
        });
      };
      
      // Also load products from comprehensive_products.json (avoiding duplicates)
      try {
        const response = await fetch('/comprehensive_products.json');
        if (response.ok) {
          const comprehensiveProducts = await response.json();
          if (comprehensiveProducts && comprehensiveProducts.length > 0) {
            // Add only products that don't already exist
            const newProducts = comprehensiveProducts.filter(p => 
              !productExists(p, allProducts)
            );
            
            console.log('Found additional unique products from comprehensive:', newProducts.length);
            allProducts = [...allProducts, ...newProducts];
          }
        }
      } catch (comprehensiveError) {
        console.warn('Comprehensive products not found:', comprehensiveError.message);
      }
      
      // If we have products, use them
      if (allProducts.length > 0) {
        console.log('Total products loaded:', allProducts.length);
        console.log('VAULT products found:', allProducts.filter(p => 
          (p.category && p.category.toLowerCase() === 'vault') || 
          (p.badges && p.badges.includes('VAULT'))
        ).length);
        
        cachedProducts = allProducts;
        lastFetchTime = now;
        setProducts(allProducts);
        setError(null);
        return;
      }
      
      // Fallback to mock data
      cachedProducts = mockProducts;
      lastFetchTime = now;
      setProducts(mockProducts);
      setError(null);
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to load products:', err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, loading, error, refetch: () => window.location.reload() };
};

// Get single product with Shopify integration
export const useProduct = (productIdentifier) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // First try to get from products.json, then fallback to comprehensive_products.json
        let productData = null;
        
        // Check if productIdentifier is a number (ID) or string (handle)
        const isNumericId = !isNaN(parseInt(productIdentifier));
        
        try {
          const response = await fetch('/products.json');
          if (response.ok) {
            const shopifyProducts = await response.json();
            if (isNumericId) {
              productData = shopifyProducts.find(p => p.id === parseInt(productIdentifier));
            } else {
              productData = shopifyProducts.find(p => p.handle === productIdentifier);
            }
          }
        } catch (shopifyProductsError) {
          console.warn('Shopify products not found:', shopifyProductsError.message);
        }
        
        // Try comprehensive_products.json if not found
        if (!productData) {
          try {
            const response = await fetch('/comprehensive_products.json');
            if (response.ok) {
              const comprehensiveProducts = await response.json();
              if (isNumericId) {
                productData = comprehensiveProducts.find(p => p.id === parseInt(productIdentifier) || p.id === productIdentifier);
              } else {
                productData = comprehensiveProducts.find(p => p.handle === productIdentifier);
              }
            }
          } catch (comprehensiveProductsError) {
            console.warn('Comprehensive products not found:', comprehensiveProductsError.message);
          }
        }
        
        // Note: Removed loading from new_premium_hoodies.json and comprehensive_products_backup.json
        // to prevent duplicates. All products should be available in products.json or comprehensive_products.json

        // If not found in direct integration, try Shopify
        if (!productData) {
          productData = await useMockDataIfShopifyUnavailable(
            () => shopify.getProduct(productIdentifier),
            mockProducts.find(p => isNumericId ? p.id === parseInt(productIdentifier) : p.handle === productIdentifier)
          );
        }
        
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productIdentifier) {
      loadProduct();
    }
  }, [productIdentifier]);

  return { product, loading, error };
};

// Filter products hook with enhanced functionality and VAULT exclusivity
export const useFilteredProducts = (category, filter, includeVault = false) => {
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    // Start with all products
    let filtered = products;

    // VAULT EXCLUSIVITY: Remove VAULT products from general listings unless specifically requested
    if (!includeVault && category !== 'Vault' && filter !== 'vault') {
      filtered = products.filter(p => {
        const isVaultProduct = (
          p.vault_locked === true ||
          (p.category && p.category.toLowerCase() === 'vault') ||
          (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE')))
        );
        return !isVaultProduct; // Exclude VAULT products from general listings
      });
    }

    // Category filtering
    if (category && category !== 'all') {
      if (category === 'Accessories') {
        // Handle accessories category mapping
        filtered = filtered.filter(p => 
          p.category && (
            p.category.toLowerCase() === 'accessories' ||
            p.category.toLowerCase() === 'hats' ||
            p.category.toLowerCase() === 'wallet' ||
            p.category.toLowerCase() === 'slippers'
          )
        );
      } else if (category === 'Vault') {
        // Handle VAULT category - ONLY show VAULT products
        console.log('Filtering for VAULT category. All products:', products.length);
        filtered = products.filter(p => {
          const isVaultCategory = p.category && p.category.toLowerCase() === 'vault';
          const hasVaultBadge = p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE'));
          const isVaultLocked = p.vault_locked === true;
          const result = isVaultCategory || hasVaultBadge || isVaultLocked;
          if (result) {
            console.log('Found VAULT product:', p.name, 'category:', p.category, 'badges:', p.badges, 'vault_locked:', p.vault_locked);
          }
          return result;
        });
        console.log('VAULT filtered products:', filtered.length);
      } else if (category === 'Shirts') {
        // Handle Formal Arsenal - map 'Shirts' to 'Full Shirts' category
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === 'full shirts'
        );
      } else if (category === 'Tee Shirts') {
        // Handle REBEL TEES - map 'Tee Shirts' to 'Teeshirt' category
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === 'teeshirt'
        );
      } else {
        // Direct category matching (excluding VAULT products unless specifically requested)
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    // Badge/Special filtering
    if (filter) {
      switch (filter) {
        case 'new-arrivals':
          filtered = filtered.filter(p => p.badges && p.badges.includes('NEW'));
          break;
        case 'best-sellers':
          filtered = filtered.filter(p => p.badges && p.badges.includes('BEST SELLER'));
          break;
        case 'sale':
          filtered = filtered.filter(p => p.badges && p.badges.includes('SALE'));
          break;
        case 'vault':
          // For vault filter, ONLY show VAULT products
          filtered = products.filter(p => 
            p.vault_locked === true ||
            (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE'))) ||
            (p.category && p.category.toLowerCase() === 'vault')
          );
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, category, filter, includeVault]);

  return { 
    products: filteredProducts, 
    allProducts: products,
    loading, 
    error 
  };
};

// Get VAULT products exclusively - NO OVERLAP with Rebellion products
export const useVaultProducts = () => {
  const { products, loading, error } = useProducts();

  const vaultProducts = useMemo(() => {
    return products.filter(p => 
      p.vault_locked === true ||
      p.is_vault_exclusive === true ||
      (p.category && p.category.toLowerCase() === 'vault') ||
      (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE')))
      // REMOVED 'REBEL DROP' to prevent duplicates with Rebellion section
    );
  }, [products]);

  return { 
    products: vaultProducts, 
    loading, 
    error 
  };
};

// Get VAULT products with purchase unlock filtering
export const useVaultProductsWithUnlock = () => {
  const { products, loading, error } = useProducts();

  const vaultProducts = useMemo(() => {
    // Check if user has made any purchase
    const hasPurchased = localStorage.getItem('user_purchases') !== null;
    
    return products.filter(p => {
      const isVaultProduct = (
        p.vault_locked === true ||
        p.is_vault_exclusive === true ||
        (p.category && p.category.toLowerCase() === 'vault') ||
        (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE')))
      );
      
      // If it's a vault product that requires purchase unlock
      if (isVaultProduct && p.requires_purchase_unlock === true) {
        return hasPurchased; // Only show if user has purchased
      }
      
      return isVaultProduct; // Show all other vault products
    });
  }, [products]);

  return { 
    products: vaultProducts, 
    loading, 
    error 
  };
};

// Filter products to hide purchase-locked items from general sections
export const useFilteredProductsWithUnlock = (category, filter, includeVault = false) => {
  const { products, loading, error } = useProducts();

  const filteredProducts = useMemo(() => {
    // Check if user has made any purchase (temporarily set to true for testing)
    const hasPurchased = true; // localStorage.getItem('user_purchases') !== null;
    
    // Start with all products
    let filtered = products;

    // Hide purchase-locked products from all sections except vault
    if (category !== 'Vault' && filter !== 'vault') {
      filtered = products.filter(p => {
        // If product requires purchase unlock, hide it from general sections
        if (p.requires_purchase_unlock === true) {
          return false;
        }
        return true;
      });
    }

    // VAULT EXCLUSIVITY: Remove VAULT products from general listings unless specifically requested
    if (!includeVault && category !== 'Vault' && filter !== 'vault') {
      filtered = filtered.filter(p => {
        const isVaultProduct = (
          p.vault_locked === true ||
          (p.category && p.category.toLowerCase() === 'vault') ||
          (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE')))
        );
        return !isVaultProduct; // Exclude VAULT products from general listings
      });
    }

    // Category filtering
    if (category && category !== 'all') {
      if (category === 'Accessories') {
        // Handle accessories category mapping
        filtered = filtered.filter(p => 
          p.category && (
            p.category.toLowerCase() === 'accessories' ||
            p.category.toLowerCase() === 'hats' ||
            p.category.toLowerCase() === 'wallet' ||
            p.category.toLowerCase() === 'slippers'
          )
        );
      } else if (category === 'Vault') {
        // Handle VAULT category - show vault products based on purchase status
        console.log('Filtering for VAULT category. All products:', products.length);
        filtered = products.filter(p => {
          const isVaultCategory = p.category && p.category.toLowerCase() === 'vault';
          const hasVaultBadge = p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE'));
          const isVaultLocked = p.vault_locked === true;
          const isVaultProduct = isVaultCategory || hasVaultBadge || isVaultLocked;
          
          if (isVaultProduct) {
            // If product requires purchase unlock, only show if user has purchased
            if (p.requires_purchase_unlock === true) {
              return hasPurchased;
            }
            return true; // Show other vault products
          }
          return false;
        });
        console.log('VAULT filtered products:', filtered.length);
      } else if (category === 'Shirts') {
        // Handle Formal Arsenal - map 'Shirts' to 'Full Shirts' category
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === 'full shirts'
        );
      } else if (category === 'Tee Shirts') {
        // Handle REBEL TEES - map 'Tee Shirts' to 'Teeshirt' category
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === 'teeshirt'
        );
      } else {
        // Direct category matching (excluding VAULT products unless specifically requested)
        filtered = filtered.filter(p => 
          p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    // Badge/Special filtering
    if (filter) {
      switch (filter) {
        case 'new-arrivals':
          filtered = filtered.filter(p => p.badges && p.badges.includes('NEW'));
          break;
        case 'best-sellers':
          filtered = filtered.filter(p => p.badges && p.badges.includes('BEST SELLER'));
          break;
        case 'sale':
          filtered = filtered.filter(p => p.badges && p.badges.includes('SALE'));
          break;
        case 'vault':
          // For vault filter, show vault products based on purchase status
          filtered = products.filter(p => {
            const isVaultProduct = (
              p.vault_locked === true ||
              (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE'))) ||
              (p.category && p.category.toLowerCase() === 'vault')
            );
            
            if (isVaultProduct && p.requires_purchase_unlock === true) {
              return hasPurchased;
            }
            return isVaultProduct;
          });
          break;
        case 'rebellion':
          // For rebellion filter, show products with REBEL badges
          filtered = filtered.filter(p => 
            p.badges && (p.badges.includes('REBEL') || p.badges.includes('REBEL DROP') || p.badges.includes('DROP'))
          );
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [products, category, filter, includeVault]);

  return { 
    products: filteredProducts, 
    allProducts: products,
    loading, 
    error 
  };
};

// Cart management hook
export const useCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const addToCart = async (product, variant, quantity = 1) => {
    setLoading(true);
    try {
      // For demo mode, simulate cart addition
      if (process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN === 'demo-token-12345') {
        const newItem = {
          id: `${product.id}-${variant.id || 'default'}`,
          product,
          variant,
          quantity,
          price: product.price
        };
        
        setCart(prevCart => {
          const existingItemIndex = prevCart.items.findIndex(item => item.id === newItem.id);
          let newItems;
          
          if (existingItemIndex >= 0) {
            newItems = [...prevCart.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            newItems = [...prevCart.items, newItem];
          }
          
          const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return { items: newItems, total };
        });
        
        console.log('🎭 Demo: Added to cart', newItem);
        return { success: true };
      }
      
      // Real Shopify integration would go here
      return { success: true };
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total };
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return { items: newItems, total };
    });
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    loading,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
  };
};

export default useProducts;