// Shopify Storefront API client - Real Shopify Store
const SHOPIFY_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN || '40fg1q-ju.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN || 'bab636f906ac3a48b7ff915141b55e21';

const SHOPIFY_API_VERSION = process.env.REACT_APP_SHOPIFY_STOREFRONT_API_VERSION || '2024-01';
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Demo mode flag - disabled now that real Shopify is configured
const DEMO_MODE = false; // Real Shopify products loading

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
  }

  async request(query, variables = {}) {
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