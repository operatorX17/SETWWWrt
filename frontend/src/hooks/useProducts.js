import { useState, useEffect, useMemo, useCallback } from 'react';

// React import needed for additional hooks

// Simplified and optimized useProducts hook focused on comprehensive_products.json
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    // Helper function to map OG products to homepage collections
    const mapToCollection = (product) => {
      const badges = product.badges || [];
      const tags = product.tags || [];
      const price = parseFloat(product.price) || 0;
      
      // Map based on badges and characteristics
      if (badges.includes('VAULT_EXCLUSIVE') || badges.includes('VAULT')) {
        return 'VAULT';
      }
      if (badges.includes('REBEL_DROP')) {
        return 'REBELLION CORE';
      }
      if (badges.includes('BEST_SELLER') || product.merch_score > 0.8) {
        return 'PREMIUM COLLECTION';
      }
      if (price < 999 || badges.includes('UNDER_999')) {
        return 'REBELLION CORE';
      }
      if (price >= 1200) {
        return 'PREMIUM COLLECTION';
      }
      
      // Default mapping
      return 'REBELLION CORE';
    };

    try {
      setLoading(true);
      console.log('🔄 Loading products from comprehensive_products.json...');
      
      // Load from our OG Expert Catalog (comprehensive_products.json)
      const response = await fetch('/comprehensive_products.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const catalogData = await response.json();
      console.log('📦 Raw catalog data loaded:', catalogData);
      
      // Handle both object format with products property and direct array
      let rawProducts = [];
      if (catalogData.products && Array.isArray(catalogData.products)) {
        rawProducts = catalogData.products;
      } else if (Array.isArray(catalogData)) {
        rawProducts = catalogData;
      } else {
        throw new Error('Invalid catalog format: no products array found');
      }
      
      console.log(`📊 Processing ${rawProducts.length} raw products...`);
      
      // Transform products to standard format with enhanced image handling
      const processedProducts = rawProducts.map(product => {
        // Determine best image to show (prioritize back image as requested)
        let primaryImage = null;
        let secondaryImage = null;
        
        if (product.images) {
          // Prioritize back image for front display (user's request)
          if (product.images.back) {
            primaryImage = product.images.back;
            secondaryImage = product.images.front;
          } else if (product.images.front) {
            primaryImage = product.images.front;
          }
        }
        
        return {
          id: product.id || product.handle,
          title: product.title,
          handle: product.handle,
          name: product.title, // Alias for compatibility
          price: parseFloat(product.price) || 0,
          compareAtPrice: product.compare_at_price ? parseFloat(product.compare_at_price) : null,
          category: product.category?.toLowerCase() || 'uncategorized',
          description: product.description || '',
          tags: product.tags || [],
          badges: product.badges || [],
          vendor: product.vendor || 'DVV / OG',
          product_type: product.product_type || product.category,
          
          // Enhanced image handling
          images: [primaryImage, secondaryImage].filter(Boolean),
          primaryImage: primaryImage,
          backImage: product.images?.back,
          frontImage: product.images?.front,
          showBackFirst: !!product.images?.back, // Flag to show back image first
          
          // OG specific data
          concept: product.concept,
          scene_code: product.scene_code,
          colorway: product.colorway,
          rails: product.rails || [],
          merch_score: product.merch_score || 0.5,
          
          // Variants
          variants: product.variants || [],
          
          // Collection mapping for homepage filters
          collection: mapToCollection(product),
          
          // Additional metadata
          seo: product.seo || {}
        };
      });
      
      console.log(`✅ Successfully processed ${processedProducts.length} products`);
      console.log('🎯 Sample product:', processedProducts[0]);
      
      // Log category distribution
      const categories = {};
      processedProducts.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + 1;
      });
      console.log('📊 Category distribution:', categories);
      
      setProducts(processedProducts);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message);
      
      // Fallback to empty array instead of crashing
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Memoized product categories for filtering
  const productCategories = useMemo(() => {
    const categories = new Set();
    products.forEach(product => {
      if (product.category) {
        categories.add(product.category);
      }
    });
    return Array.from(categories);
  }, [products]);

  // Helper functions for filtering
  const getProductsByCategory = useCallback((category) => {
    if (!category) return products;
    return products.filter(p => 
      p.category.toLowerCase().includes(category.toLowerCase()) ||
      p.product_type?.toLowerCase().includes(category.toLowerCase())
    );
  }, [products]);

  const getProductsByCollection = useCallback((collection) => {
    if (!collection) return products;
    return products.filter(p => p.collection === collection);
  }, [products]);

  const getProductsByBadge = useCallback((badge) => {
    if (!badge) return products;
    return products.filter(p => p.badges.includes(badge));
  }, [products]);

  const getBestProducts = useCallback((limit = 8) => {
    return products
      .filter(p => p.badges.includes('BEST_SELLER') || p.merch_score > 0.75)
      .slice(0, limit);
  }, [products]);

  const getPremiumProducts = useCallback((limit = 8) => {
    return products
      .filter(p => p.collection === 'PREMIUM COLLECTION' || p.price >= 1200)
      .slice(0, limit);
  }, [products]);

  const getAffordableProducts = useCallback((limit = 8) => {
    return products
      .filter(p => p.price < 999)
      .slice(0, limit);
  }, [products]);

  return {
    products,
    loading,
    error,
    productCategories,
    
    // Helper functions
    getProductsByCategory,
    getProductsByCollection, 
    getProductsByBadge,
    getBestProducts,
    getPremiumProducts,
    getAffordableProducts,
    
    // Reload function
    reload: loadProducts
  };
};

// Additional hook for Vault products with unlock functionality
export const useVaultProductsWithUnlock = () => {
  const { products } = useProducts();
  
  const vaultProducts = useMemo(() => {
    return products.filter(p => 
      p.badges.includes('VAULT_EXCLUSIVE') || 
      p.badges.includes('VAULT') ||
      p.collection === 'VAULT' ||
      p.price >= 2000
    );
  }, [products]);

  return {
    products: vaultProducts,
    loading: false,
    error: null
  };
};

// Hook for filtered products with unlock functionality
export const useFilteredProductsWithUnlock = (filters = {}) => {
  const { products, loading, error } = useProducts();
  
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase().includes(filters.category.toLowerCase()) ||
        p.product_type?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    // Apply collection filter
    if (filters.collection) {
      filtered = filtered.filter(p => p.collection === filters.collection);
    }
    
    // Apply badge filter
    if (filters.badge) {
      filtered = filtered.filter(p => p.badges.includes(filters.badge));
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    return filtered;
  }, [products, filters]);

  return {
    products: filteredProducts,
    loading,
    error
  };
};

// Hook for single product
export const useProduct = (productId) => {
  const { products, loading, error } = useProducts();
  
  const product = useMemo(() => {
    if (!productId || !products.length) return null;
    return products.find(p => 
      p.id === productId || 
      p.handle === productId ||
      p.id === parseInt(productId)
    );
  }, [products, productId]);

  return {
    product,
    loading,
    error: product ? null : 'Product not found'
  };
};

// Hook for filtered products (simple version)
export const useFilteredProducts = (filterFn) => {
  const { products, loading, error } = useProducts();
  
  const filteredProducts = useMemo(() => {
    if (!filterFn || typeof filterFn !== 'function') return products;
    return products.filter(filterFn);
  }, [products, filterFn]);

  return {
    products: filteredProducts,
    loading,
    error
  };
};