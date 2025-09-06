// WhatsApp utilities for OG Armory

export function waOrderText({
  items,
  total,
  name,
  phone,
  address,
  orderId,
  paymentMethod = 'COD'
}) {
  const itemsList = items.map(item => 
    `• ${item.title || item.name} [${item.size || 'Default'}] x${item.quantity} - ₹${item.price}`
  ).join('%0A');
  
  const message = `🔥 OG ARMORY ORDER%0A%0A` +
    `Order ID: ${orderId}%0A%0A` +
    `ITEMS:%0A${itemsList}%0A%0A` +
    `TOTAL: ₹${total}%0A%0A` +
    `CUSTOMER DETAILS:%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Phone: ${phone}%0A` +
    `Address: ${encodeURIComponent(address)}%0A%0A` +
    `Payment: ${paymentMethod}%0A%0A` +
    `Ready to ship to the battlefield! 🏴‍☠️`;
    
  return message;
}

export function waLink(number, text) {
  // Remove any non-digit characters from number
  const cleanNumber = number.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export function sendOrderToWhatsApp({
  items,
  total,
  customerInfo,
  orderId,
  paymentMethod = 'COD',
  storeWhatsApp = process.env.REACT_APP_SUPPORT_WHATSAPP || '+919876543210'
}) {
  const orderText = waOrderText({
    items,
    total,
    name: customerInfo.name,
    phone: customerInfo.phone,
    address: customerInfo.address,
    orderId,
    paymentMethod
  });
  
  const whatsappURL = waLink(storeWhatsApp, orderText);
  
  // Open WhatsApp
  window.open(whatsappURL, '_blank');
  
  // Track the action
  trackWhatsAppOrder(orderId, total, paymentMethod);
}

export function waRestockAlert(productName, customerPhone, customerName) {
  const message = `🔔 RESTOCK ALERT REQUEST%0A%0A` +
    `Product: ${encodeURIComponent(productName)}%0A` +
    `Customer: ${encodeURIComponent(customerName)}%0A` +
    `Phone: ${customerPhone}%0A%0A` +
    `Please notify when back in stock! 🎯`;
    
  return message;
}

export function sendRestockAlert(productName, customerInfo, storeWhatsApp = process.env.REACT_APP_SUPPORT_WHATSAPP || '+919876543210') {
  const alertText = waRestockAlert(productName, customerInfo.phone, customerInfo.name);
  const whatsappURL = waLink(storeWhatsApp, alertText);
  
  window.open(whatsappURL, '_blank');
  
  // Track restock request
  if (window.gtag) {
    window.gtag('event', 'restock_request', {
      event_category: 'engagement',
      event_label: productName
    });
  }
}

export function waCustomerSupport(issue = 'General Query', orderId = null) {
  let message = `🆘 CUSTOMER SUPPORT%0A%0A` +
    `Issue: ${encodeURIComponent(issue)}%0A`;
    
  if (orderId) {
    message += `Order ID: ${orderId}%0A`;
  }
  
  message += `%0ANeed assistance with my OG Armory order. Please help! 🙏`;
  
  return message;
}

export function openCustomerSupport(issue, orderId, storeWhatsApp = process.env.REACT_APP_SUPPORT_WHATSAPP || '+919876543210') {
  const supportText = waCustomerSupport(issue, orderId);
  const whatsappURL = waLink(storeWhatsApp, supportText);
  
  window.open(whatsappURL, '_blank');
  
  // Track support request
  if (window.gtag) {
    window.gtag('event', 'customer_support', {
      event_category: 'support',
      event_label: issue
    });
  }
}

// Quick action buttons
export function createWAFloatingButton(storeWhatsApp = process.env.REACT_APP_SUPPORT_WHATSAPP || '+919876543210') {
  const button = document.createElement('div');
  button.className = 'fixed bottom-6 right-6 z-50';
  button.innerHTML = `
    <button onclick="window.open('${waLink(storeWhatsApp, 'Hi! I need help with OG Armory 🔥')}', '_blank')"
            class="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.513"/>
      </svg>
    </button>
  `;
  
  document.body.appendChild(button);
}

// Analytics tracking
export function trackWhatsAppOrder(orderId, amount, paymentMethod) {
  // Track WhatsApp order
  if (window.gtag) {
    window.gtag('event', 'whatsapp_order', {
      event_category: 'ecommerce', 
      event_label: paymentMethod,
      value: amount
    });
  }
  
  // Track with Plausible if available
  if (window.plausible) {
    window.plausible('WhatsApp Order', {
      props: { orderId, amount, paymentMethod }
    });
  }
}