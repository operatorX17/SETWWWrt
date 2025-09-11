// Shopify Storefront API client - Production Ready Configuration
const SHOPIFY_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_API_VERSION = process.env.REACT_APP_SHOPIFY_API_VERSION || '2024-01';

// Validate required environment variables
if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
  console.warn('Missing Shopify configuration. Please check your environment variables.');
}

const SHOPIFY_ENDPOINT = SHOPIFY_DOMAIN ? `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json` : null;

// Backend API configuration
const BACKEND_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Demo mode flag - use backend API as primary source
const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API !== 'false';
const DEMO_MODE = !SHOPIFY_ENDPOINT || process.env.REACT_APP_DEMO_MODE === 'true';

// GraphQL queries with OG metafields support
const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          tags
          productType
          metafields(identifiers: [
            {namespace: "ogfilm", key: "rank"},
            {namespace: "ogfilm", key: "drop_end"},
            {namespace: "ogfilm", key: "is_limited"},
            {namespace: "ogfilm", key: "scene_code"}
          ]) {
            key
            value
            type
            namespace
          }
        }
      }
    }
  }
`;

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      tags
      productType
      vendor
    }
  }
`;

const SHOP_QUERY = `
  query getShop {
    shop {
      id
      name
      description
      primaryDomain {
        url
      }
      currencyCode
      metafields(identifiers: [
        {namespace: "ogfilm", key: "affordable_price_ceiling"}
      ]) {
        key
        value
        type
        namespace
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Shopify API client
class ShopifyAPI {
  constructor() {
    this.endpoint = SHOPIFY_ENDPOINT;
    this.token = SHOPIFY_STOREFRONT_TOKEN;
    this.backendUrl = BACKEND_API_URL;
    this.useBackend = USE_BACKEND_API;
  }

  async request(query, variables = {}) {
    // If backend API is preferred and available, try it first
    if (this.useBackend) {
      try {
        const backendResponse = await this.requestFromBackend(query, variables);
        if (backendResponse) {
          return backendResponse;
        }
      } catch (backendError) {
        console.warn('Backend API failed, falling back to Shopify:', backendError.message);
      }
    }

    // Fallback to direct Shopify API
    if (!this.endpoint || !this.token) {
      throw new Error('Shopify configuration missing. Please check environment variables.');
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.token,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      return data;
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw error;
    }
  }

  async requestFromBackend(query, variables = {}) {
    try {
      // Convert GraphQL query to backend API call
      if (query.includes('products(first:')) {
        const response = await fetch(`${this.backendUrl}/products?limit=${variables.first || 20}`);
        if (response.ok) {
          const data = await response.json();
          return {
            products: {
              edges: data.products?.map(product => ({ node: this.transformBackendProduct(product) })) || []
            }
          };
        }
      } else if (query.includes('productByHandle')) {
        const response = await fetch(`${this.backendUrl}/products/${variables.handle}`);
        if (response.ok) {
          const data = await response.json();
          return {
            productByHandle: this.transformBackendProduct(data.product)
          };
        }
      }
    } catch (error) {
      console.warn('Backend API request failed:', error);
      return null;
    }
    return null;
  }

  transformBackendProduct(backendProduct) {
    if (!backendProduct) return null;
    
    return {
      id: backendProduct.shopify_id || backendProduct.id,
      title: backendProduct.title,
      handle: backendProduct.handle,
      description: backendProduct.description || backendProduct.body_html,
      descriptionHtml: backendProduct.body_html || backendProduct.description,
      priceRange: {
        minVariantPrice: {
          amount: backendProduct.variants?.[0]?.price || '0',
          currencyCode: 'USD'
        },
        maxVariantPrice: {
          amount: backendProduct.variants?.[0]?.price || '0',
          currencyCode: 'USD'
        }
      },
      images: {
        edges: (backendProduct.images || []).map(img => ({
          node: {
            url: img.src || img.url || img,
            altText: backendProduct.title,
            width: 800,
            height: 800
          }
        }))
      },
      variants: {
        edges: (backendProduct.variants || []).map(variant => ({
          node: {
            id: variant.id,
            title: variant.title || 'Default',
            availableForSale: variant.available !== false,
            price: {
              amount: variant.price || '0',
              currencyCode: 'USD'
            },
            selectedOptions: variant.options || []
          }
        }))
      },
      tags: backendProduct.tags || [],
      productType: backendProduct.product_type || 'general',
      vendor: backendProduct.vendor || 'OG Store'
    };
  }

  // Get all products
  async getProducts(first = 20) {
    const data = await this.request(PRODUCTS_QUERY, { first });
    return data.products.edges.map(edge => this.transformProduct(edge.node));
  }

  // Get single product by handle
  async getProduct(handle) {
    const data = await this.request(PRODUCT_QUERY, { handle });
    return this.transformProduct(data.productByHandle);
  }

  // Create cart
  async createCart(lines = []) {
    const data = await this.request(CART_CREATE_MUTATION, {
      input: { lines }
    });
    
    if (data.cartCreate.userErrors.length > 0) {
      throw new Error(data.cartCreate.userErrors[0].message);
    }
    
    return data.cartCreate.cart;
  }

  // Transform Shopify product to our format
  transformProduct(shopifyProduct) {
    if (!shopifyProduct) return null;

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      category: shopifyProduct.productType || 'General',
      price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
      originalPrice: null, // Could be calculated from compareAtPrice
      badges: this.getBadges(shopifyProduct),
      images: shopifyProduct.images.edges.map(edge => edge.node.url),
      variants: shopifyProduct.variants.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        price: parseFloat(edge.node.price.amount),
        available: edge.node.availableForSale,
        options: edge.node.selectedOptions
      })),
      tags: shopifyProduct.tags || [],
      vendor: shopifyProduct.vendor
    };
  }

  // Generate badges based on Shopify data - Enhanced for OG products
  getBadges(product) {
    const badges = [];
    
    // Check tags (case insensitive)
    const tags = product.tags.map(tag => tag.toLowerCase());
    
    if (tags.includes('new') || tags.includes('og') || tags.includes('limited')) badges.push('NEW');
    if (tags.includes('bestseller') || tags.includes('premium')) badges.push('BEST SELLER');
    if (tags.includes('sale')) badges.push('SALE');
    
    // Add OG-specific badges
    if (tags.includes('og') || product.title.includes('OG')) badges.push('REBEL DROP');
    if (tags.includes('premium') || tags.includes('limited')) badges.push('FAN ARSENAL');
    
    // Ensure at least one badge for OG products
    if (badges.length === 0 && (product.title.includes('OG') || tags.includes('og'))) {
      badges.push('NEW');
    }
    
    return badges;
  }
}

// Export singleton instance
export const shopify = new ShopifyAPI();

// Enhanced helper functions for seamless Shopify integration
export const useMockDataIfShopifyUnavailable = async (shopifyFunction, mockData) => {
  if (DEMO_MODE) {
    console.log('🎭 Demo Mode: Using mock data - Shopify not configured');
    return mockData;
  }
  
  try {
    const result = await shopifyFunction();
    console.log('✅ Shopify: Data loaded successfully', `Found ${result.length || 0} products`);
    
    // If no products returned, fallback to enhanced mock data with OG badges
    if (!result || result.length === 0) {
      console.log('⚠️ No products from Shopify, using enhanced mock data');
      const enhancedMockData = mockData.map(product => ({
        ...product,
        badges: [...(product.badges || []), 'NEW', 'REBEL DROP']
      }));
      return enhancedMockData;
    }
    
    return result;
  } catch (error) {
    console.warn('⚠️ Shopify API failed, falling back to enhanced mock data:', error.message);
    const enhancedMockData = mockData.map(product => ({
      ...product,
      badges: [...(product.badges || []), 'NEW', 'REBEL DROP']
    }));
    return enhancedMockData;
  }
};

// Cart management functions
export const addToShopifyCart = async (variantId, quantity = 1) => {
  if (DEMO_MODE) {
    console.log('🎭 Demo Mode: Simulating add to cart', { variantId, quantity });
    return { success: true, cartId: 'demo-cart-id' };
  }
  
  try {
    const cart = await shopify.createCart([
      {
        merchandiseId: variantId,
        quantity: quantity
      }
    ]);
    return { success: true, cart };
  } catch (error) {
    console.error('Failed to add to Shopify cart:', error);
    return { success: false, error: error.message };
  }
};

// Generate Shopify checkout URL
export const getShopifyCheckoutUrl = (cartId) => {
  if (DEMO_MODE) {
    return '#demo-checkout';
  }
  return `https://${SHOPIFY_DOMAIN}/cart/${cartId}`;
};

export default shopify;