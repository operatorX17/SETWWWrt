import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ children }) => {
  const [analytics, setAnalytics] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    topProducts: [],
    customerSegments: {},
    monthlyGrowth: 0
  });

  // Shopify Analytics API integration
  const SHOPIFY_ADMIN_CONFIG = {
    domain: process.env.REACT_APP_SHOPIFY_STORE_DOMAIN,
    accessToken: process.env.REACT_APP_SHOPIFY_ADMIN_API_TOKEN,
    apiVersion: '2024-01'
  };

  // GraphQL queries for analytics
  const ANALYTICS_QUERY = `
    query getAnalytics($first: Int!) {
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              id
              email
              ordersCount
              totalSpentV2 {
                amount
                currencyCode
              }
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    product {
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      customers(first: $first) {
        edges {
          node {
            id
            email
            createdAt
            ordersCount
            totalSpentV2 {
              amount
              currencyCode
            }
            tags
          }
        }
      }
      
      products(first: 50, sortKey: CREATED_AT) {
        edges {
          node {
            id
            title
            handle
            totalInventory
            variants(first: 1) {
              edges {
                node {
                  price
                }
              }
            }
          }
        }
      }
    }
  `;

  // Make Shopify Admin API request
  const makeShopifyAdminRequest = async (query, variables = {}) => {
    const url = `https://${SHOPIFY_ADMIN_CONFIG.domain}/admin/api/${SHOPIFY_ADMIN_CONFIG.apiVersion}/graphql.json`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_CONFIG.accessToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Shopify Admin API Error:', error);
      // Return mock data for development
      return getMockAnalytics();
    }
  };

  // Mock analytics data for development
  const getMockAnalytics = () => ({
    orders: {
      edges: [
        {
          node: {
            id: 'gid://shopify/Order/1001',
            name: '#OG1001',
            createdAt: '2024-09-05T10:00:00Z',
            totalPriceSet: { shopMoney: { amount: '2499.00', currencyCode: 'INR' } },
            customer: {
              id: 'gid://shopify/Customer/501',
              email: 'warrior@example.com',
              ordersCount: 3,
              totalSpentV2: { amount: '7497.00', currencyCode: 'INR' }
            },
            lineItems: {
              edges: [
                {
                  node: {
                    title: 'Blood Wolf Hoodie',
                    quantity: 1,
                    variant: { product: { title: 'Blood Wolf Hoodie', handle: 'blood-wolf-hoodie' } }
                  }
                }
              ]
            }
          }
        },
        {
          node: {
            id: 'gid://shopify/Order/1002',
            name: '#OG1002',
            createdAt: '2024-09-04T15:30:00Z',
            totalPriceSet: { shopMoney: { amount: '1299.00', currencyCode: 'INR' } },
            customer: {
              id: 'gid://shopify/Customer/502',
              email: 'rebel@example.com',
              ordersCount: 1,
              totalSpentV2: { amount: '1299.00', currencyCode: 'INR' }
            }
          }
        }
      ]
    },
    customers: {
      edges: [
        {
          node: {
            id: 'gid://shopify/Customer/501',
            email: 'warrior@example.com',
            createdAt: '2024-08-15T10:00:00Z',
            ordersCount: 3,
            totalSpentV2: { amount: '7497.00', currencyCode: 'INR' },
            tags: ['WARRIOR', 'VIP']
          }
        },
        {
          node: {
            id: 'gid://shopify/Customer/502',
            email: 'rebel@example.com',
            createdAt: '2024-09-01T14:00:00Z',
            ordersCount: 1,
            totalSpentV2: { amount: '1299.00', currencyCode: 'INR' },
            tags: ['REBEL']
          }
        }
      ]
    }
  });

  // Fetch and process analytics data
  const fetchAnalytics = async () => {
    try {
      const data = await makeShopifyAdminRequest(ANALYTICS_QUERY, { first: 100 });
      
      // Process orders data
      const orders = data.orders.edges.map(edge => edge.node);
      const customers = data.customers.edges.map(edge => edge.node);
      
      // Calculate metrics
      const totalRevenue = orders.reduce((sum, order) => 
        sum + parseFloat(order.totalPriceSet.shopMoney.amount), 0
      );
      
      const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
      
      // Customer segmentation by spending
      const customerSegments = {
        'FOOT SOLDIER': customers.filter(c => parseFloat(c.totalSpentV2.amount) < 1000).length,
        'REBEL': customers.filter(c => {
          const spent = parseFloat(c.totalSpentV2.amount);
          return spent >= 1000 && spent < 5000;
        }).length,
        'WARRIOR': customers.filter(c => {
          const spent = parseFloat(c.totalSpentV2.amount);
          return spent >= 5000 && spent < 10000;
        }).length,
        'BATTLE ELITE': customers.filter(c => {
          const spent = parseFloat(c.totalSpentV2.amount);
          return spent >= 10000 && spent < 25000;
        }).length,
        'OG COMMANDER': customers.filter(c => {
          const spent = parseFloat(c.totalSpentV2.amount);
          return spent >= 25000 && spent < 50000;
        }).length,
        'VAULT LEGEND': customers.filter(c => parseFloat(c.totalSpentV2.amount) >= 50000).length
      };

      // Top products by sales
      const productSales = {};
      orders.forEach(order => {
        order.lineItems?.edges.forEach(lineItem => {
          const product = lineItem.node.variant.product.title;
          productSales[product] = (productSales[product] || 0) + lineItem.node.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([product, sales]) => ({ product, sales }));

      // Calculate conversion rate (mock)
      const conversionRate = 3.2; // Mock conversion rate

      // Calculate monthly growth (mock)
      const monthlyGrowth = 15.8; // Mock growth rate

      setAnalytics({
        totalCustomers: customers.length,
        totalOrders: orders.length,
        totalRevenue,
        conversionRate,
        avgOrderValue,
        topProducts,
        customerSegments,
        monthlyGrowth
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  // Track events
  const trackEvent = async (eventName, properties = {}) => {
    try {
      // Send to Shopify Analytics or Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
      }
      
      // Also send to Shopify Customer Events API if available
      console.log('Event tracked:', eventName, properties);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Track purchase
  const trackPurchase = (order) => {
    trackEvent('purchase', {
      transaction_id: order.id,
      value: order.total,
      currency: 'INR',
      items: order.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price
      }))
    });
  };

  // Track product view
  const trackProductView = (product) => {
    trackEvent('view_item', {
      currency: 'INR',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        price: product.price
      }]
    });
  };

  // Track add to cart
  const trackAddToCart = (product, quantity = 1) => {
    trackEvent('add_to_cart', {
      currency: 'INR',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        category: product.category,
        quantity: quantity,
        price: product.price
      }]
    });
  };

  // Initialize analytics
  useEffect(() => {
    fetchAnalytics();
    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    analytics,
    fetchAnalytics,
    trackEvent,
    trackPurchase,
    trackProductView,
    trackAddToCart
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};