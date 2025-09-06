// Shopify Metafields Integration for OG Theme
// All commerce data & control live in Shopify via metafields

// Product metafields (namespace: og)
export const PRODUCT_METAFIELDS = {
  RANK: 'og.rank',           // Common | Rebel | Vault
  DROP_END: 'og.drop_end',   // ISO datetime for countdowns
  SCENE_CODE: 'og.scene_code', // string ("OG-SCN-###") for "Merch ↔ Scene" reveal
  IS_LIMITED: 'og.is_limited', // boolean (shows gold "Limited" badge)
};

// Collection metafields (namespace: og)
export const COLLECTION_METAFIELDS = {
  PIN_ORDER: 'og.pin_order',   // list of product handles to pin first
  HERO_COPY: 'og.hero_copy',   // short line to show at top of collection page
};

// Customer metafields (namespace: og)
export const CUSTOMER_METAFIELDS = {
  TRIBE_ID: 'og.tribe_id',     // auto-assigned number/string ("Rebel #047")
  RANK: 'og.rank',             // string ("Rebel", "Captain", "Gambheera")
  POINTS: 'og.points',         // integer (display only)
};

// Shop metafields (namespace: og)
export const SHOP_METAFIELDS = {
  HOME_HERO_VIDEO: 'og.home_hero_video',
  HOME_HERO_IMAGE: 'og.home_hero_image',
  BANNER_COPY: 'og.banner_copy',
  AFFORDABLE_PRICE_CEILING: 'og.affordable_price_ceiling', // Under ₹999 rail
  LEADERBOARD: 'og.leaderboard', // JSON curated list
};

// Enhanced GraphQL queries with metafields
export const PRODUCTS_WITH_METAFIELDS_QUERY = `
  query GetProductsWithMetafields($first: Int!) {
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
          variants(first: 10) {
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
          metafields(first: 10) {
            edges {
              node {
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_WITH_METAFIELDS_QUERY = `
  query GetProductWithMetafields($handle: String!) {
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
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
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
      metafields(first: 20) {
        edges {
          node {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const COLLECTION_WITH_METAFIELDS_QUERY = `
  query GetCollectionWithMetafields($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(first: 50, sortKey: BEST_SELLING) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            tags
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                  type
                }
              }
            }
          }
        }
      }
      metafields(first: 10) {
        edges {
          node {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const SHOP_METAFIELDS_QUERY = `
  query GetShopMetafields {
    shop {
      name
      description
      metafields(first: 20) {
        edges {
          node {
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

// Utility functions to extract metafield values
export const getMetafieldValue = (metafields, namespace, key) => {
  if (!metafields) return null;
  
  const metafield = metafields.find(m => 
    m.namespace === namespace && m.key === key
  );
  
  if (!metafield) return null;
  
  // Parse based on type
  switch (metafield.type) {
    case 'boolean':
      return metafield.value === 'true';
    case 'number_integer':
      return parseInt(metafield.value);
    case 'number_decimal':
      return parseFloat(metafield.value);
    case 'date_time':
      return new Date(metafield.value);
    case 'json':
      try {
        return JSON.parse(metafield.value);
      } catch {
        return metafield.value;
      }
    case 'list.single_line_text_field':
      return metafield.value.split(',').map(s => s.trim());
    default:
      return metafield.value;
  }
};

// Transform Shopify product to OG format with metafields
export const transformProductWithMetafields = (shopifyProduct) => {
  if (!shopifyProduct) return null;

  const metafields = shopifyProduct.metafields?.edges?.map(edge => edge.node) || [];
  
  // Extract OG metafields
  const rank = getMetafieldValue(metafields, 'og', 'rank') || 'Common';
  const dropEnd = getMetafieldValue(metafields, 'og', 'drop_end');
  const sceneCode = getMetafieldValue(metafields, 'og', 'scene_code');
  const isLimited = getMetafieldValue(metafields, 'og', 'is_limited') || false;
  
  // Generate badges based on metafields and tags
  const badges = [];
  if (shopifyProduct.tags.includes('new')) badges.push('NEW');
  if (shopifyProduct.tags.includes('bestseller')) badges.push('BEST SELLER');
  if (shopifyProduct.tags.includes('sale')) badges.push('SALE');
  if (isLimited) badges.push('LIMITED');
  if (rank === 'Vault') badges.push('VAULT');
  
  return {
    id: shopifyProduct.id,
    handle: shopifyProduct.handle,
    name: shopifyProduct.title,
    category: shopifyProduct.productType || 'Apparel',
    price: parseFloat(shopifyProduct.priceRange.minVariantPrice.amount),
    currency: shopifyProduct.priceRange.minVariantPrice.currencyCode,
    originalPrice: null, // Could be calculated from compareAtPrice
    badges,
    images: shopifyProduct.images.edges.map(edge => edge.node.url),
    description: shopifyProduct.description,
    variants: shopifyProduct.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: parseFloat(edge.node.price.amount),
      available: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable,
      options: edge.node.selectedOptions
    })),
    tags: shopifyProduct.tags,
    vendor: shopifyProduct.vendor,
    // OG specific fields
    rank,
    dropEnd,
    sceneCode,
    isLimited,
    // Additional computed fields
    isVaultItem: rank === 'Vault',
    hasActiveCountdown: dropEnd && new Date(dropEnd) > new Date(),
    isExpired: dropEnd && new Date(dropEnd) <= new Date(),
  };
};

// Check if user has vault access (based on customer tags or localStorage)
export const hasVaultAccess = (customerTags = []) => {
  // Check Shopify customer tags
  if (customerTags.includes('vault_access')) return true;
  
  // Check localStorage for demo purposes
  const localVaultAccess = localStorage.getItem('og-vault-access');
  return localVaultAccess === 'true';
};

// Get affordable price ceiling from shop metafields
export const getAffordablePriceCeiling = (shopMetafields) => {
  const ceiling = getMetafieldValue(shopMetafields, 'og', 'affordable_price_ceiling');
  return ceiling || 999; // Default to ₹999
};

// Format price for India
export const formatIndianPrice = (price, currency = 'INR') => {
  if (currency === 'INR') {
    return `₹${Math.round(price)}`;
  }
  return `${currency} ${price}`;
};

// Get customer tribe info
export const getCustomerTribeInfo = (customerMetafields) => {
  const tribeId = getMetafieldValue(customerMetafields, 'og', 'tribe_id');
  const rank = getMetafieldValue(customerMetafields, 'og', 'rank') || 'Rebel';
  const points = getMetafieldValue(customerMetafields, 'og', 'points') || 0;
  
  return { tribeId, rank, points };
};

// OG Theme specific metafield helpers
export const getOGRank = (product) => {
  const metafields = product.metafields?.edges?.map(edge => edge.node) || product.metafields || [];
  const rank = getMetafieldValue(metafields, 'og', 'rank');
  return rank || 'Common';
};

export const isLimitedProduct = (product) => {
  const metafields = product.metafields?.edges?.map(edge => edge.node) || product.metafields || [];
  const isLimited = getMetafieldValue(metafields, 'og', 'is_limited');
  return isLimited === 'true' || isLimited === true;
};

export const getDropEndTime = (product) => {
  const metafields = product.metafields?.edges?.map(edge => edge.node) || product.metafields || [];
  const dropEnd = getMetafieldValue(metafields, 'og', 'drop_end');
  return dropEnd ? new Date(dropEnd) : null;
};

export const hasActiveCountdown = (product) => {
  const dropEnd = getDropEndTime(product);
  return dropEnd && dropEnd > new Date();
};

export const getRankBadgeStyle = (rank) => {
  switch (rank?.toLowerCase()) {
    case 'vault':
      return {
        class: 'bg-[var(--color-gold)] text-black border border-[var(--color-gold)]',
        glow: 'shadow-[0_0_15px_rgba(201,151,0,0.6)]'
      };
    case 'captain':
      return {
        class: 'bg-[var(--color-red)] text-white border border-[var(--color-gold)]',
        glow: 'shadow-[0_0_15px_rgba(193,18,31,0.6)]'
      };
    case 'rebel':
      return {
        class: 'bg-white text-black border border-[var(--color-red)]',
        glow: 'shadow-[0_0_10px_rgba(255,255,255,0.4)]'
      };
    default: // Common
      return {
        class: 'bg-[var(--color-steel)] text-white border border-[var(--color-steel)]',
        glow: ''
      };
  }
};

export const isVaultLocked = (product, userRank = 'Common') => {
  const productRank = getOGRank(product);
  const rankOrder = { 'Common': 0, 'Rebel': 1, 'Captain': 2, 'Vault': 3 };
  
  return rankOrder[productRank] > rankOrder[userRank];
};

export default {
  PRODUCT_METAFIELDS,
  COLLECTION_METAFIELDS,
  CUSTOMER_METAFIELDS,
  SHOP_METAFIELDS,
  getMetafieldValue,
  transformProductWithMetafields,
  hasVaultAccess,
  getAffordablePriceCeiling,
  formatIndianPrice,
  getCustomerTribeInfo,
  getOGRank,
  isLimitedProduct,
  getDropEndTime,
  hasActiveCountdown,
  getRankBadgeStyle,
  isVaultLocked
};