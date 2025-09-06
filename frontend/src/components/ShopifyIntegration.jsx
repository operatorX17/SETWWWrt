import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopifyContext = createContext();

export const useShopify = () => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
};

export const ShopifyProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [accessToken, setAccessToken] = useState(null);

  // Shopify Storefront API Configuration
  const SHOPIFY_DOMAIN = process.env.REACT_APP_SHOPIFY_STORE_DOMAIN;
  const STOREFRONT_TOKEN = process.env.REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN;
  const API_VERSION = process.env.REACT_APP_SHOPIFY_STOREFRONT_API_VERSION;

  const shopifyRequest = async (query, variables = {}) => {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error('Shopify GraphQL errors:', data.errors);
      throw new Error(data.errors[0]?.message || 'Shopify API error');
    }
    return data.data;
  };

  // Initialize customer from localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('shopify_customer_access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      fetchCustomerData(storedAccessToken);
    }
  }, []);

  const fetchCustomerData = async (token) => {
    try {
      setIsLoading(true);
      const query = `
        query getCustomer($customerAccessToken: String!) {
          customer(customerAccessToken: $customerAccessToken) {
            id
            firstName
            lastName
            email
            phone
            createdAt
            tags
            orders(first: 10) {
              edges {
                node {
                  id
                  orderNumber
                  totalPrice {
                    amount
                    currencyCode
                  }
                  processedAt
                  fulfillmentStatus
                  financialStatus
                  lineItems(first: 10) {
                    edges {
                      node {
                        title
                        quantity
                        variant {
                          price {
                            amount
                            currencyCode
                          }
                          title
                        }
                      }
                    }
                  }
                  shippingAddress {
                    city
                    province
                    country
                  }
                }
              }
            }
          }
        }
      `;

      const data = await shopifyRequest(query, { customerAccessToken: token });
      
      if (data.customer) {
        setCustomer(data.customer);
        const ordersList = data.customer.orders.edges.map(edge => ({
          id: edge.node.id,
          order_number: edge.node.orderNumber,
          created_at: edge.node.processedAt,
          total_price: edge.node.totalPrice.amount,
          fulfillment_status: edge.node.fulfillmentStatus?.toLowerCase() || 'unfulfilled',
          financial_status: edge.node.financialStatus?.toLowerCase() || 'pending',
          line_items: edge.node.lineItems.edges.map(lineEdge => ({
            title: lineEdge.node.title,
            quantity: lineEdge.node.quantity,
            price: lineEdge.node.variant?.price.amount || '0',
            variant_title: lineEdge.node.variant?.title || ''
          })),
          shipping_address: edge.node.shippingAddress
        }));
        setOrders(ordersList);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      // If token is invalid, clear it
      localStorage.removeItem('shopify_customer_access_token');
      setAccessToken(null);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeCustomer = async () => {
    const storedToken = localStorage.getItem('shopify_customer_access_token');
    if (storedToken) {
      await fetchCustomerData(storedToken);
    }
  };

  const createCustomerAccount = async (customerData) => {
    setIsLoading(true);
    try {
      const mutation = `
        mutation customerCreate($input: CustomerCreateInput!) {
          customerCreate(input: $input) {
            customer {
              id
              firstName
              lastName
              email
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          phone: customerData.phone,
          password: customerData.password
        }
      };

      const data = await shopifyRequest(mutation, variables);
      
      if (data.customerCreate.customerUserErrors.length > 0) {
        throw new Error(data.customerCreate.customerUserErrors[0].message);
      }

      return { success: true, customer: data.customerCreate.customer };
    } catch (error) {
      console.error('Error creating customer account:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginCustomer = async (email, password) => {
    setIsLoading(true);
    try {
      const mutation = `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            customerUserErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        input: {
          email,
          password
        }
      };

      const data = await shopifyRequest(mutation, variables);
      
      if (data.customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
      }

      const token = data.customerAccessTokenCreate.customerAccessToken.accessToken;
      localStorage.setItem('shopify_customer_access_token', token);
      setAccessToken(token);
      
      await fetchCustomerData(token);
      
      return { success: true, customer };
    } catch (error) {
      console.error('Error logging in customer:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logoutCustomer = async () => {
    try {
      if (accessToken) {
        const mutation = `
          mutation customerAccessTokenDelete($customerAccessToken: String!) {
            customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
              deletedAccessToken
              deletedCustomerAccessTokenId
              userErrors {
                field
                message
              }
            }
          }
        `;

        await shopifyRequest(mutation, { customerAccessToken: accessToken });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      localStorage.removeItem('shopify_customer_access_token');
      setAccessToken(null);
      setCustomer(null);
      setOrders([]);
    }
  };

  const trackOrder = async (orderNumber) => {
    try {
      if (!customer) return null;

      const order = orders.find(o => o.order_number === orderNumber);
      if (!order) return null;

      // Create tracking data based on order status
      const trackingData = {
        order_number: orderNumber,
        status: order.fulfillment_status,
        tracking_number: `OG${orderNumber}`,
        carrier: 'OG Express',
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        tracking_url: `https://track.ogarmory.com/${orderNumber}`,
        updates: [
          {
            timestamp: order.created_at,
            status: 'Order Confirmed',
            location: 'OG Armory Warehouse'
          }
        ]
      };

      if (order.fulfillment_status === 'fulfilled') {
        trackingData.updates.push({
          timestamp: new Date(new Date(order.created_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'Delivered',
          location: order.shipping_address?.city || 'Destination'
        });
      } else if (order.fulfillment_status === 'partial') {
        trackingData.updates.push({
          timestamp: new Date(new Date(order.created_at).getTime() + 12 * 60 * 60 * 1000).toISOString(),
          status: 'Out for Delivery',
          location: order.shipping_address?.city || 'Local Hub'
        });
      }

      return trackingData;
    } catch (error) {
      console.error('Error tracking order:', error);
      return null;
    }
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    customer,
    orders,
    cart,
    isLoading,
    accessToken,
    createCustomerAccount,
    loginCustomer,
    logoutCustomer,
    trackOrder,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    initializeCustomer
  };

  return (
    <ShopifyContext.Provider value={value}>
      {children}
    </ShopifyContext.Provider>
  );
};