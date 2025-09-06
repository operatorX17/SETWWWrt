// UPI Payment utilities for OG Armory

export function upiDeepLink({
  pa, // UPI ID  
  pn, // Payee name
  am, // Amount
  tn, // Transaction note
  cu = "INR" // Currency
}) {
  const params = new URLSearchParams({
    pa, 
    pn, 
    am: am.toFixed(2), 
    tn, 
    cu
  });
  return `upi://pay?${params.toString()}`;
}

export function generateUPIQR(upiString) {
  // For now, we'll use a QR code service
  // In production, you'd use a proper QR library
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
}

export function detectUPICapability() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
  const isAndroid = /android/.test(userAgent);
  const isIOS = /iphone|ipad|ipod/.test(userAgent);
  
  return {
    isMobile,
    isAndroid,
    isIOS,
    supportsUPI: isMobile // Most mobile devices in India support UPI
  };
}

export function initiateUPIPayment({ 
  amount, 
  orderId, 
  items,
  customerInfo,
  upiId = process.env.REACT_APP_UPI_VPA || "ogarmory@paytm",
  merchantName = process.env.REACT_APP_BRAND_NAME || "OG Armory"
}) {
  const device = detectUPICapability();
  
  const transactionNote = `OG Armory Order ${orderId}`;
  const upiString = upiDeepLink({
    pa: upiId,
    pn: merchantName,
    am: amount,
    tn: transactionNote
  });
  
  if (device.supportsUPI) {
    // Try to open UPI app
    window.location.href = upiString;
    
    // Fallback: show QR after 3 seconds if user didn't leave
    setTimeout(() => {
      const shouldShowQR = confirm(
        "UPI app not opening? Click OK to see QR code for payment."
      );
      if (shouldShowQR) {
        showUPIQR(upiString, amount, orderId);
      }
    }, 3000);
  } else {
    // Desktop: show QR immediately
    showUPIQR(upiString, amount, orderId);
  }
}

function showUPIQR(upiString, amount, orderId) {
  const qrURL = generateUPIQR(upiString);
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-sm mx-4 text-center">
      <h3 class="text-xl font-bold mb-4 text-black">Scan to Pay ₹${amount}</h3>
      <img src="${qrURL}" alt="UPI QR Code" class="mx-auto mb-4 border-2 border-gray-300">
      <p class="text-sm text-gray-600 mb-4">Order: ${orderId}</p>
      <p class="text-xs text-gray-500 mb-4">Scan with any UPI app: GPay, PhonePe, Paytm, etc.</p>
      <button onclick="this.parentElement.parentElement.remove()" 
              class="bg-red-600 text-white px-4 py-2 rounded font-bold">
        Close
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Remove modal on click outside
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
}

// Analytics tracking
export function trackUPIClick(orderId, amount) {
  // Track UPI payment attempt
  if (window.gtag) {
    window.gtag('event', 'upi_payment_attempt', {
      event_category: 'ecommerce',
      event_label: orderId,
      value: amount
    });
  }
  
  // Track with Plausible if available
  if (window.plausible) {
    window.plausible('UPI Payment Attempt', {
      props: { orderId, amount }
    });
  }
}