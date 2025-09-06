// Shopify Analytics & Tracking Integration
// Tracks all user interactions for conversion optimization

export const ShopifyAnalytics = {
  // Track product views
  trackProductView: (product) => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: 'DVV Entertainment',
          price: product.price,
          quantity: 1
        }]
      });
    }

    // Shopify Analytics (if Shopify Pixel is loaded)
    if (window.analytics) {
      window.analytics.track('Product Viewed', {
        product_id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        currency: 'INR',
        brand: 'DVV Entertainment'
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'INR'
      });
    }
  },

  // Track add to cart
  trackAddToCart: (product, variant, quantity = 1) => {
    const item = {
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_brand: 'DVV Entertainment',
      price: product.price,
      quantity: quantity,
      variant: variant?.title || 'Default'
    };

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: product.price * quantity,
        items: [item]
      });
    }

    // Shopify Analytics
    if (window.analytics) {
      window.analytics.track('Product Added', item);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_ids: [product.id],
        content_type: 'product',
        value: product.price * quantity,
        currency: 'INR'
      });
    }
  },

  // Track checkout initiation
  trackBeginCheckout: (cart) => {
    const items = cart.map(item => ({
      item_id: item.product.id,
      item_name: item.product.name,
      item_category: item.product.category,
      item_brand: 'DVV Entertainment',
      price: item.product.price,
      quantity: item.quantity
    }));

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: total,
        items: items
      });
    }

    // Shopify Analytics
    if (window.analytics) {
      window.analytics.track('Checkout Started', {
        order_id: Date.now().toString(),
        value: total,
        currency: 'INR',
        products: items
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'INR',
        num_items: cart.length
      });
    }
  },

  // Track purchase (when UPI/WhatsApp order is completed)
  trackPurchase: (orderData) => {
    const { orderId, items, total, paymentMethod } = orderData;
    
    const trackingItems = items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category || 'Product',
      item_brand: 'DVV Entertainment',
      price: item.price,
      quantity: item.quantity || 1
    }));

    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: total,
        currency: 'INR',
        payment_type: paymentMethod,
        items: trackingItems
      });
    }

    // Shopify Analytics
    if (window.analytics) {
      window.analytics.track('Order Completed', {
        order_id: orderId,
        total: total,
        currency: 'INR',
        payment_method: paymentMethod,
        products: trackingItems
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: total,
        currency: 'INR',
        content_ids: items.map(item => item.id),
        content_type: 'product'
      });
    }
  },

  // Track PSPK community events
  trackCommunityEvent: (eventName, data = {}) => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', `pspk_${eventName}`, {
        event_category: 'community',
        ...data
      });
    }

    // Custom PSPK tracking
    if (window.pspkAnalytics) {
      window.pspkAnalytics.track(eventName, data);
    }
  },

  // Track exclusive access events
  trackExclusiveAccess: (productId, accessLevel) => {
    this.trackCommunityEvent('exclusive_access', {
      product_id: productId,
      access_level: accessLevel,
      timestamp: new Date().toISOString()
    });
  },

  // Track waitlist signups
  trackWaitlistSignup: (productId, productName) => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', 'join_waitlist', {
        event_category: 'engagement',
        product_id: productId,
        product_name: productName
      });
    }

    // Shopify Analytics
    if (window.analytics) {
      window.analytics.track('Waitlist Joined', {
        product_id: productId,
        product_name: productName
      });
    }
  },

  // Initialize tracking
  init: () => {
    // Initialize Google Analytics 4
    if (!window.gtag && window.GA_MEASUREMENT_ID) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${window.GA_MEASUREMENT_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', window.GA_MEASUREMENT_ID);
    }

    // Initialize Facebook Pixel
    if (!window.fbq && window.FB_PIXEL_ID) {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', window.FB_PIXEL_ID);
      window.fbq('track', 'PageView');
    }

    console.log('🔥 PSPK Analytics initialized - All events will be tracked');
  }
};

// Auto-initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    ShopifyAnalytics.init();
  });
}

export default ShopifyAnalytics;