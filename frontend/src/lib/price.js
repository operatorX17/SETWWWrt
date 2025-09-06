// Price utilities for OG Armory

export const formatPrice = (price) => {
  return `₹${Math.round(price)}`;
};

export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

export const isAffordable = (price) => {
  return price <= 999;
};

export const getPriceCategory = (price) => {
  if (price <= 999) return 'affordable';
  if (price <= 1999) return 'premium';
  return 'vault';
};

// For the rails system
export const filterByPriceRange = (products, maxPrice) => {
  return products.filter(product => product.price <= maxPrice);
};

export const sortByPrice = (products, ascending = true) => {
  return [...products].sort((a, b) => 
    ascending ? a.price - b.price : b.price - a.price
  );
};