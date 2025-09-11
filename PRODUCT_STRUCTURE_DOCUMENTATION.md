# Product Catalog Structure Documentation

## Overview
This document outlines the required structure for generating new product catalogs with proper metadata, tall images, and all necessary product information.

## Catalog Files Structure

### 1. PRODUCTION_CATALOG.json
**Location:** `frontend/public/PRODUCTION_CATALOG.json`
**Purpose:** Main production catalog for the OG Store

```json
{
  "metadata": {
    "store_name": "OG Store",
    "version": "3.0.0",
    "last_updated": "2025-09-11",
    "total_products": 0,
    "psychology_targeting": "OG Store - Military Tactical Theme",
    "status": "CLEARED_FOR_NEW_CATALOG"
  },
  "products": []
}
```

### 2. PSPK_FAN_STORE_CATALOG.json
**Location:** `frontend/public/imgprocess4/PSPK_FAN_STORE_CATALOG.json`
**Purpose:** PSPK fan merchandise catalog

```json
{
  "metadata": {
    "store_name": "PSPK Fan Store",
    "total_products": 0,
    "fan_tiers": ["basic", "premium", "ultimate"],
    "categories": ["apparel", "accessories", "collectibles"],
    "status": "CLEARED_FOR_NEW_CATALOG"
  },
  "products": []
}
```

### 3. PREMIUM_CATALOG_REGENERATED.json
**Location:** `frontend/PREMIUM_CATALOG_REGENERATED.json`
**Purpose:** Premium tier product catalog

```json
{
  "metadata": {
    "version": "3.0.0",
    "generated_at": "2025-09-11",
    "status": "CLEARED_FOR_NEW_CATALOG",
    "premium_tier_system": true,
    "total_products": 0
  },
  "premium_tiers": {
    "hero": [],
    "elite": [],
    "standard": []
  }
}
```

## Required Product Structure

### Individual Product Format
```json
{
  "id": "unique_product_id",
  "name": "Product Name",
  "category": "category_name",
  "price": 699,
  "original_price": 999,
  "discount_percentage": 30,
  "description": "Detailed product description",
  "short_description": "Brief product summary",
  "images": {
    "main": "/PRODUCTS/category/product_id/main.jpg",
    "gallery": [
      "/PRODUCTS/category/product_id/image1.jpg",
      "/PRODUCTS/category/product_id/image2.jpg"
    ],
    "thumbnail": "/PRODUCTS/category/product_id/thumb.jpg"
  },
  "variants": {
    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    "colors": ["black", "white", "red"],
    "materials": ["cotton", "polyester"]
  },
  "badges": {
    "official": true,
    "limited_edition": false,
    "bestseller": true,
    "new_arrival": false
  },
  "features": {
    "cash_on_delivery": true,
    "free_shipping": true,
    "return_policy": "7-day return",
    "warranty": "1 year"
  },
  "metadata": {
    "sku": "SKU123456",
    "weight": "200g",
    "dimensions": "30x40cm",
    "material_details": "100% Cotton",
    "care_instructions": "Machine wash cold",
    "country_of_origin": "India"
  },
  "seo": {
    "meta_title": "Product Name - OG Store",
    "meta_description": "Buy Product Name at best price",
    "keywords": ["keyword1", "keyword2"]
  },
  "availability": {
    "in_stock": true,
    "stock_count": 50,
    "pre_order": false,
    "estimated_delivery": "3-5 days"
  }
}
```

## Image Requirements

### Image Specifications
- **Format:** JPG/JPEG preferred for photos, PNG for graphics
- **Aspect Ratio:** Tall images recommended (3:4 or 2:3 ratio)
- **Minimum Resolution:** 800x1200px for main images
- **Maximum File Size:** 500KB per image
- **Naming Convention:** `product_id_variant.jpg`

### Directory Structure
```
PRODUCTS/
├── category1/
│   ├── product_id_1/
│   │   ├── main.jpg
│   │   ├── image1.jpg
│   │   ├── image2.jpg
│   │   └── thumb.jpg
│   └── product_id_2/
└── category2/
```

### Image Types Required
1. **Main Image:** Primary product photo (tall format)
2. **Gallery Images:** Multiple angles/views (2-5 images)
3. **Thumbnail:** Small preview image (square format)
4. **Variant Images:** Different colors/styles if applicable

## Categories and Classifications

### Supported Categories
- `posters` - Wall posters and prints
- `hats` - Caps and headwear
- `wallet` - Wallets and accessories
- `teeshirt` - T-shirts and casual wear
- `hoodies` - Hooded sweatshirts
- `sweatshirts` - Regular sweatshirts
- `slippers` - Footwear
- `full_shirts` - Formal and casual shirts

### Premium Tier Classifications
- **Hero:** Premium flagship products
- **Elite:** High-quality featured items
- **Standard:** Regular catalog items

## UI/UX Features Preserved

### Design Elements
- Dark theme with military tactical styling
- Size selector buttons (XS, S, M, L, XL, XXL)
- Badge system (Official, Limited Edition, etc.)
- Price display with discount calculations
- Add to cart and buy now buttons
- WhatsApp integration
- UPI payment options

### Interactive Features
- Image gallery with zoom
- Size selection
- Quantity selector
- Wishlist functionality
- Product comparison
- Reviews and ratings
- Related products suggestions

## Payment Integration
- UPI payment gateway
- Cash on Delivery (COD)
- WhatsApp ordering
- Razorpay integration

## Backend API Endpoints
- `/api/products` - Get all products
- `/api/products/:id` - Get single product
- `/api/categories` - Get categories
- `/api/search` - Product search
- `/api/cart` - Cart operations

## Next Steps for New Catalog Generation

1. **Prepare Product Data:**
   - Collect high-quality tall images (3:4 ratio)
   - Gather complete product information
   - Ensure all metadata is available

2. **Image Processing:**
   - Resize images to optimal dimensions
   - Compress for web optimization
   - Generate thumbnails

3. **Catalog Generation:**
   - Follow the JSON structure above
   - Validate all required fields
   - Test with sample products first

4. **Testing:**
   - Verify UI rendering
   - Test all interactive features
   - Confirm payment integration
   - Check mobile responsiveness

## Backup Information
- All original products backed up in `PRODUCT_BACKUP_2025-09-11_12-26-24/`
- Catalog backups created with timestamps
- Original structure preserved for reference

---

**Note:** This structure maintains all existing UI features, payment systems, and design elements while providing a clean foundation for new product catalogs with proper tall image support and comprehensive metadata.