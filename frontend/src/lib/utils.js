import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function filterByPriceRange(products, minPrice, maxPrice) {
  if (!products || !Array.isArray(products)) return [];
  return products.filter(product => {
    const price = parseFloat(product.price || 0);
    return price >= minPrice && price <= maxPrice;
  });
}

export function openCustomerSupport() {
  // Open WhatsApp support
  const supportNumber = process.env.REACT_APP_SUPPORT_PHONE || '+919876543210';
  const message = encodeURIComponent('Hi! I need help with my order.');
  window.open(`https://wa.me/${supportNumber.replace('+', '')}?text=${message}`, '_blank');
}
