import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopifyProfileContext = createContext();

export const useShopifyProfile = () => {
  const context = useContext(ShopifyProfileContext);
  if (!context) {
    throw new Error('useShopifyProfile must be used within a ShopifyProfileProvider');
  }
  return context;
};

export const ShopifyProfileProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [preferences, setPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Shopify Storefront API configuration
  const SHOPIFY_CONFIG = {
    domain: process.env.REACT_APP_SHOPIFY_STORE_DOMAIN,
    storefrontToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN,
    apiVersion: process.env.REACT_APP_SHOPIFY_STOREFRONT_API_VERSION || '2024-01'
  };

  // GraphQL queries for Shopify
  const CUSTOMER_QUERY = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        displayName
        email
        phone
        createdAt
        updatedAt
        acceptsMarketing
        tags
        orders(first: 50) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPriceV2 {
                amount
                currencyCode
              }
              fulfillmentStatus
              financialStatus
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      priceV2 {
                        amount
                        currencyCode
                      }
                      title
                    }
                  }
                }
              }
            }
          }
        }
        addresses(first: 10) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
      }
    }
  `;

  const CREATE_CUSTOMER_MUTATION = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
        }
        customerUserErrors {
          field
          message
        }
      }
    }
  `;

  const CUSTOMER_ACCESS_TOKEN_CREATE = `
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

  // Make GraphQL request to Shopify
  const makeShopifyRequest = async (query, variables = {}) => {
    const url = `https://${SHOPIFY_CONFIG.domain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      
      return data.data;
    } catch (error) {
      console.error('Shopify API Error:', error);
      throw error;
    }
  };

  // Create customer account
  const createCustomerAccount = async (customerData) => {
    setIsLoading(true);
    try {
      const input = {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        password: customerData.password,
        phone: customerData.phone,
        acceptsMarketing: customerData.acceptsMarketing || false
      };

      const result = await makeShopifyRequest(CREATE_CUSTOMER_MUTATION, { input });
      
      if (result.customerCreate.customerUserErrors.length > 0) {
        throw new Error(result.customerCreate.customerUserErrors[0].message);
      }

      return { success: true, customer: result.customerCreate.customer };
    } catch (error) {
      console.error('Error creating customer:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login customer
  const loginCustomer = async (email, password) => {
    setIsLoading(true);
    try {
      // Get access token
      const tokenResult = await makeShopifyRequest(CUSTOMER_ACCESS_TOKEN_CREATE, {
        input: { email, password }
      });

      if (tokenResult.customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw new Error(tokenResult.customerAccessTokenCreate.customerUserErrors[0].message);
      }

      const accessToken = tokenResult.customerAccessTokenCreate.customerAccessToken.accessToken;
      
      // Store access token
      localStorage.setItem('shopify_customer_token', accessToken);

      // Get customer data
      const customerData = await makeShopifyRequest(CUSTOMER_QUERY, {
        customerAccessToken: accessToken
      });

      const customerInfo = customerData.customer;
      const customerOrders = customerInfo.orders.edges.map(edge => ({
        id: edge.node.id,
        orderNumber: edge.node.orderNumber,
        processedAt: edge.node.processedAt,
        totalPrice: parseFloat(edge.node.totalPriceV2.amount),
        fulfillmentStatus: edge.node.fulfillmentStatus,
        financialStatus: edge.node.financialStatus,
        lineItems: edge.node.lineItems.edges.map(item => ({
          title: item.node.title,
          quantity: item.node.quantity,
          price: parseFloat(item.node.variant.priceV2.amount),
          variant: item.node.variant.title
        }))
      }));

      setCustomer({
        id: customerInfo.id,
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        createdAt: customerInfo.createdAt,
        tags: customerInfo.tags
      });

      setOrders(customerOrders);
      
      setAddresses(customerInfo.addresses.edges.map(edge => edge.node));

      return { success: true, customer: customerInfo };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-login from stored token
  useEffect(() => {
    const storedToken = localStorage.getItem('shopify_customer_token');
    if (storedToken && !customer) {
      // Auto-login with stored token
      makeShopifyRequest(CUSTOMER_QUERY, {
        customerAccessToken: storedToken
      }).then(data => {
        if (data.customer) {
          const customerInfo = data.customer;
          setCustomer({
            id: customerInfo.id,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            phone: customerInfo.phone,
            createdAt: customerInfo.createdAt,
            tags: customerInfo.tags
          });

          const customerOrders = customerInfo.orders.edges.map(edge => ({
            id: edge.node.id,
            orderNumber: edge.node.orderNumber,
            processedAt: edge.node.processedAt,
            totalPrice: parseFloat(edge.node.totalPriceV2.amount),
            fulfillmentStatus: edge.node.fulfillmentStatus,
            financialStatus: edge.node.financialStatus
          }));

          setOrders(customerOrders);
        }
      }).catch(() => {
        // Token expired or invalid
        localStorage.removeItem('shopify_customer_token');
      });
    }
  }, [customer]);

  // Logout
  const logoutCustomer = () => {
    localStorage.removeItem('shopify_customer_token');
    setCustomer(null);
    setOrders([]);
    setAddresses([]);
    setPreferences({});
  };

  // Calculate total spent
  const getTotalSpent = () => {
    return orders.reduce((total, order) => total + order.totalPrice, 0);
  };

  // Get order count
  const getOrderCount = () => {
    return orders.length;
  };

  const value = {
    customer,
    orders,
    addresses,
    preferences,
    isLoading,
    createCustomerAccount,
    loginCustomer,
    logoutCustomer,
    getTotalSpent,
    getOrderCount
  };

  return (
    <ShopifyProfileContext.Provider value={value}>
      {children}
    </ShopifyProfileContext.Provider>
  );
};