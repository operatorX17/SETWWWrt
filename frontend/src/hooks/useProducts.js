import { useState, useEffect, useMemo, useCallback } from 'react';

// Simplified and fixed useProducts hook focused on images working
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    // Simple collection mapping function
    const getProductCollection = (product) => {
      const badges = product.badges || [];
      const price = parseFloat(product.price) || 0;
      
      if (badges.includes('VAULT_EXCLUSIVE') || badges.includes('VAULT')) {
        return 'VAULT';
      }
      if (badges.includes('REBEL_DROP')) {
        return 'REBELLION CORE';
      }
      if (badges.includes('BEST_SELLER') || price >= 1200) {
        return 'PREMIUM COLLECTION';
      }
      if (price < 999) {
        return 'REBELLION CORE';
      }
      
      return 'REBELLION CORE';
    };
    
    try {
      setLoading(true);
      console.log('🔄 Loading products from comprehensive_products.json...');
      
      // Load from our OG Expert Catalog
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
      
      // Transform products with SIMPLE image handling that works
      const processedProducts = rawProducts.map(product => {
        // Simple image handling - just use what's available
        let imageList = [];
        
        if (product.images) {
          // If it's an object with front/back
          if (typeof product.images === 'object' && !Array.isArray(product.images)) {
            if (product.images.back) imageList.push(product.images.back);
            if (product.images.front) imageList.push(product.images.front);
          } 
          // If it's already an array
          else if (Array.isArray(product.images)) {
            imageList = product.images.filter(Boolean);
          }
        }
        
        // Fallback to any available image
        if (imageList.length === 0) {
          if (product.primaryImage) imageList.push(product.primaryImage);
          if (product.backImage) imageList.push(product.backImage);
          if (product.frontImage) imageList.push(product.frontImage);
        }
        
        // Ensure images array is never empty
        if (imageList.length === 0) {
          imageList = ['/placeholder-product.jpg'];
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
          
          // Simple image array that always works
          images: imageList,
          
          // OG specific data
          concept: product.concept,
          scene_code: product.scene_code,
          colorway: product.colorway,
          rails: product.rails || [],
          merch_score: product.merch_score || 0.5,
          
          // Variants
          variants: product.variants || [],
          
          // Collection mapping - simple version
          collection: getProductCollection(product),
          
          // Additional metadata
          seo: product.seo || {}
        };
      });
      
      console.log(`✅ Successfully processed ${processedProducts.length} products`);
      
      setProducts(processedProducts);
      setError(null);
      
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Helper functions
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

// Additional hooks with proper React imports
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

export const useFilteredProductsWithUnlock = (filters = {}) => {
  const { products, loading, error } = useProducts();
  
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.collection) {
      filtered = filtered.filter(p => p.collection === filters.collection);
    }
    
    if (filters.badge) {
      filtered = filtered.filter(p => p.badges.includes(filters.badge));
    }
    
    return filtered;
  }, [products, filters]);

  return {
    products: filteredProducts,
    loading,
    error
  };
};

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