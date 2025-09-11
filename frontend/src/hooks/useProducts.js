import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMockDataIfShopifyUnavailable, shopify } from '../lib/shopify';
import { mockProducts } from '../data/mock';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
      
      // Try to load products from backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/storefront`);
        if (response.ok) {
          const apiData = await response.json();
          
          // Convert Shopify product format to our format
          const convertedProducts = apiData.products?.map(product => ({
            id: product.id,
            title: product.title,
            handle: product.handle,
            price: product.variants?.[0]?.price || '0',
            compareAtPrice: product.variants?.[0]?.compareAtPrice,
            images: product.images?.map(img => img.src) || [],
            category: product.productType || 'uncategorized',
            tags: product.tags || [],
            description: product.description || '',
            variants: product.variants || [],
            vendor: product.vendor || 'PSPK Store',
            available: product.availableForSale !== false
          })) || [];
          
          allProducts = [...convertedProducts];
          console.log('Loaded products from backend API:', convertedProducts.length);
        }
      } catch (apiError) {
        console.warn('Backend API unavailable, falling back to local catalog:', apiError);
        
        // Fallback 1: Load PSPK Fan Store catalog (highest quality)
        try {
          const response = await fetch('/imgprocess4/PSPK_FAN_STORE_CATALOG.json');
          if (response.ok) {
            const catalogData = await response.json();
            
            // Extract products from all tiers
            const allTierProducts = [];
            
            if (catalogData.fan_tiers) {
              Object.values(catalogData.fan_tiers).forEach(tier => {
                if (tier.products) {
                  allTierProducts.push(...tier.products);
                }
              });
            }
            
            // Normalize product data with PSPK fan psychology
            const normalizedProducts = allTierProducts.map(product => ({
              ...product,
              id: product.handle || product.id,
              price: typeof product.price === 'string' ? product.price : product.variants?.[0]?.price || '0',
              images: product.images ? 
                (typeof product.images === 'object' && !Array.isArray(product.images) ? 
                  Object.values(product.images).filter(Boolean) : 
                  Array.isArray(product.images) ? product.images : [product.images]
                ) : [],
              available: product.status === 'active' && product.published !== false,
              badges: product.tier_info?.display_name ? [product.tier_info.display_name] : 
                     product.tier === 'essentials' ? ['🔥 PSPK ESSENTIALS'] : 
                     product.tier === 'rebel_arsenal' ? ['⚔️ REBEL ARSENAL'] :
                     product.tier === 'boss_collection' ? ['👑 BOSS COLLECTION'] : 
                     product.tier === 'legend_vault' ? ['🏆 LEGEND VAULT'] : [],
              fanRating: product.fan_psychology?.conversion_triggers?.fan_rating,
              purchaseCount: product.fan_psychology?.conversion_triggers?.purchase_count,
              tierPsychology: product.fan_psychology?.tier_psychology
            }));
            
            allProducts = [...normalizedProducts];
            console.log('Loaded PSPK catalog products:', normalizedProducts.length);
          }
        } catch (pspkError) {
          console.warn('PSPK catalog not found, trying production catalog:', pspkError.message);
          
          // Fallback 2: Load production catalog
          try {
            const response = await fetch('/PRODUCTION_CATALOG.json');
            if (response.ok) {
              const productionData = await response.json();
              if (productionData && productionData.products) {
                const productionProducts = productionData.products.map(product => {
                  return {
                    ...product,
                    badges: product.badges || [
                      'PRODUCTION READY',
                      product.featured ? 'FEATURED' : null,
                      product.price > 100 ? 'PREMIUM' : null,
                      product.tags?.includes('limited') ? 'LIMITED' : null
                    ].filter(Boolean)
                  };
                });
                
                allProducts = [...productionProducts];
                console.log('Loaded production catalog products:', productionProducts.length);
              }
            }
          } catch (productionError) {
            console.warn('Production catalog not found, trying premium catalog:', productionError.message);
          }
          
          // Fallback 3: Load premium catalog
          try {
            const response = await fetch('/PREMIUM_CATALOG_REGENERATED.json');
            if (response.ok) {
              const catalogData = await response.json();
              if (catalogData && catalogData.products && catalogData.products.length > 0) {
                // Process premium catalog products
                const premiumProducts = catalogData.products.map(product => {
                  // Convert string prices to numbers for proper formatting
                  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
                  const originalPrice = typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice;
                  
                  // Convert variant prices from strings to numbers
                  const variants = product.variants ? product.variants.map(variant => ({
                    ...variant,
                    price: typeof variant.price === 'string' ? parseFloat(variant.price) : variant.price
                  })) : [];
                  
                  return {
                    ...product,
                    price: price || 0,
                    originalPrice: originalPrice || null,
                    variants: variants,
                    badges: product.badges || [
                      'PREMIUM COLLECTION',
                      product.featured ? 'FEATURED' : null,
                      price > 2000 ? 'PREMIUM' : null,
                      product.tags?.includes('Limited') ? 'LIMITED' : null
                    ].filter(Boolean)
                  };
                });
                
                allProducts = [...premiumProducts];
                console.log('Loaded premium catalog products:', premiumProducts.length);
              }
            }
          } catch (premiumError) {
            console.warn('Premium catalog not found:', premiumError.message);
          }
        }
      }
      
      // Load Shopify products as additional source (working images)
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
            
            // Add only products that don't already exist
            const newShopifyProducts = productsWithBadges.filter(p => 
              !productExists(p, allProducts)
            );
            
            allProducts = [...allProducts, ...newShopifyProducts];
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
          const comprehensiveData = await response.json();
          // Handle both array format and object format with products property
          const comprehensiveProducts = Array.isArray(comprehensiveData) 
            ? comprehensiveData 
            : comprehensiveData.products || [];
            
          if (comprehensiveProducts && comprehensiveProducts.length > 0) {
            // Normalize comprehensive products to match expected format
            const normalizedProducts = comprehensiveProducts.map(product => {
              const firstVariant = product.variants?.[0];
              return {
                ...product,
                id: product.id || product.handle,
                name: product.name || product.title,
                price: firstVariant?.price ? parseFloat(firstVariant.price) : 0,
                images: product.images ? [
                  product.images.front,
                  product.images.back
                ].filter(Boolean) : [],
                colors: product.conversion_data?.color_variants || [],
                category: product.category || product.product_type
              };
            });
            
            // Add only products that don't already exist
            const newProducts = normalizedProducts.filter(p => 
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
  }, []);

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
        
        // Try PSPK_FAN_STORE_CATALOG.json if not found
        if (!productData) {
          try {
            const response = await fetch('/imgprocess4/PSPK_FAN_STORE_CATALOG.json');
            if (response.ok) {
              const pspkCatalog = await response.json();
              // The PSPK catalog has a complex nested structure - extract all products
              let allPspkProducts = [];
              
              // Helper function to recursively find all products in the catalog
              const extractProducts = (obj) => {
                if (Array.isArray(obj)) {
                  obj.forEach(item => extractProducts(item));
                } else if (obj && typeof obj === 'object') {
                  if (obj.products && Array.isArray(obj.products)) {
                    allPspkProducts = [...allPspkProducts, ...obj.products];
                  }
                  // Also check if the object itself is a product (has handle property)
                  if (obj.handle && obj.title) {
                    allPspkProducts.push(obj);
                  }
                  // Recursively check all object properties
                  Object.values(obj).forEach(value => extractProducts(value));
                }
              };
              
              extractProducts(pspkCatalog);
              console.log('Extracted PSPK products:', allPspkProducts.length);
              
              if (isNumericId) {
                productData = allPspkProducts.find(p => p.id === parseInt(productIdentifier) || p.id === productIdentifier);
              } else {
                productData = allPspkProducts.find(p => p.handle === productIdentifier);
              }
              
              if (productData) {
                 console.log('Found product in PSPK catalog:', productData.title);
                 // Normalize PSPK product data to match expected structure
                 productData = {
                   ...productData,
                   name: productData.title, // Map title to name
                   id: productData.handle, // Use handle as ID if no ID exists
                   price: productData.variants && productData.variants[0] ? productData.variants[0].price : '0.00',
                   images: productData.images || {},
                   description: productData.tier_info?.description || 'No description available'
                 };
               }
            }
          } catch (pspkCatalogError) {
            console.warn('PSPK catalog not found:', pspkCatalogError.message);
          }
        }
        
        // Note: Added PSPK_FAN_STORE_CATALOG.json support for additional product coverage

        // If not found in direct integration, try Shopify
        if (!productData) {
          productData = await useMockDataIfShopifyUnavailable(
            () => shopify.getProduct(productIdentifier),
            mockProducts.find(p => isNumericId ? p.id === parseInt(productIdentifier) : p.handle === productIdentifier)
          );
        }
        
        console.log('useProduct: Setting product data:', productData ? productData.name || productData.title : 'null');
        setProduct(productData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Failed to load product:', err);
      } finally {
        console.log('useProduct: Setting loading to false');
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
          filtered = filtered.filter(p => p.conversion_data?.is_bestseller === true);
          break;
        case 'sale':
          filtered = filtered.filter(p => p.badges && p.badges.includes('SALE'));
          break;
        case 'vault':
          // For vault filter, ONLY show VAULT products
          filtered = products.filter(p => 
            p.vault_locked === true ||
            (p.badges && (p.badges.includes('VAULT') || p.badges.includes('LOCKED EXCLUSIVE') || p.badges.includes('VAULT EXCLUSIVE'))) ||
            (p.category && p.category.toLowerCase() === 'vault')
          );
          break;
        case 'rebellion-core':
          // REBELLION CORE filter
          filtered = filtered.filter(p => 
            p.badges && p.badges.includes('REBELLION CORE') ||
            (p.collection && p.collection === 'REBELLION CORE')
          );
          break;
        case 'premium':
          // PREMIUM COLLECTION filter
          filtered = filtered.filter(p => 
            p.badges && p.badges.includes('PREMIUM COLLECTION') ||
            (p.collection && p.collection === 'PREMIUM COLLECTION')
          );
          break;
        case 'tees':
          // TACTICAL TEES filter - all tee shirts
          filtered = filtered.filter(p => 
            p.category && (p.category.toLowerCase() === 'teeshirt' || p.category.toLowerCase() === 'tee shirts' || p.category.toLowerCase() === 'tee')
          );
          break;
        case 'hoodies':
          // BATTLE HOODIES filter - all hoodies
          filtered = filtered.filter(p => 
            p.category && (p.category.toLowerCase() === 'hoodies' || p.category.toLowerCase() === 'hoodie' || p.category.toLowerCase() === 'sweatshirts')
          );
          break;
        case 'accessories':
          // GEAR & ARSENAL filter - accessories
          filtered = filtered.filter(p => 
            p.category && (p.category.toLowerCase() === 'accessories' || p.category.toLowerCase() === 'wallet' || p.category.toLowerCase() === 'cap' || p.category.toLowerCase() === 'caps' || p.category.toLowerCase() === 'slides' || p.category.toLowerCase() === 'bands') ||
            (p.badges && p.badges.includes('GEAR & ARSENAL'))
          );
          break;
        case 'posters':
          // WAR POSTERS filter
          filtered = filtered.filter(p => 
            p.category && (p.category.toLowerCase() === 'posters' || p.category.toLowerCase() === 'poster') ||
            (p.badges && p.badges.includes('WAR POSTERS'))
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
          filtered = filtered.filter(p => p.conversion_data?.is_bestseller === true);
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