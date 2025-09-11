# Files to Share with Web Development Agent

## Essential Product Data Files

### 1. **grouped_products.json** (Primary Product Catalog)
- **Path**: `out/grouped_products.json`
- **Purpose**: Main product catalog with linked front/back views
- **Contains**: 47 unified products with metadata, images, pricing, SEO handles
- **Why needed**: This is the clean, organized product data ready for store integration

### 2. **ai_products_for_admin.json** (Admin Dashboard Data)
- **Path**: `out/ai_products_for_admin.json`
- **Purpose**: Admin-friendly format for product management
- **Contains**: All product data in admin-consumable format
- **Why needed**: For building admin dashboard and product management interface

### 3. **front_selection.json** (Hero Images)
- **Path**: `out/front_selection.json`
- **Purpose**: Curated front-view images for homepage/featured sections
- **Contains**: Best front-view products for marketing
- **Why needed**: For homepage hero sections and featured product displays

## Product Images (Organized by Design)

### 4. **Front View Designs Folder**
- **Path**: `out/front_view_designs/`
- **Purpose**: All front-view product images organized by design name
- **Contains**: 50+ design folders with front-view images
- **Why needed**: Primary product images for store display

### 5. **Back View Designs Folder**
- **Path**: `out/back_view_designs/`
- **Purpose**: All back-view product images organized by design name
- **Contains**: 22+ design folders with back-view images
- **Why needed**: Secondary product images for detailed product pages

## Backend Integration Files

### 6. **Product Model** (Database Schema)
- **Path**: `models/Product.js`
- **Purpose**: MongoDB/Database schema for products
- **Contains**: Product data structure definition
- **Why needed**: For setting up database tables/collections

### 7. **API Routes**
- **Path**: `routes/products.js` - Product CRUD operations
- **Path**: `routes/sync.js` - Data synchronization endpoints
- **Path**: `routes/upload.js` - Image upload handling
- **Purpose**: Ready-to-use API endpoints
- **Why needed**: Backend API for product management

### 8. **Server Configuration**
- **Path**: `server.js`
- **Purpose**: Express.js server setup with all routes
- **Contains**: Complete backend server configuration
- **Why needed**: Backend foundation for the store

## Statistics and Analytics

### 9. **Product Grouping Statistics**
- **Path**: `out/product_grouping_stats.json`
- **Purpose**: Analytics on product catalog
- **Contains**: View counts, categories, coolness scores, etc.
- **Why needed**: For dashboard analytics and insights

## Documentation

### 10. **Product Linking Explanation**
- **Path**: `docs/PRODUCT_LINKING_EXPLANATION.md`
- **Purpose**: Technical documentation on how products are linked
- **Contains**: System architecture and linking logic
- **Why needed**: For understanding the product structure

## Frontend Foundation

### 11. **React Components** (Optional)
- **Path**: `client/src/components/`
- **Path**: `client/src/pages/`
- **Purpose**: Basic React components for product display
- **Why needed**: Frontend starting point (if using React)

## Configuration Files

### 12. **Package Dependencies**
- **Path**: `package.json`
- **Purpose**: Node.js dependencies for backend
- **Why needed**: For setting up the development environment

### 13. **Python Requirements** (For AI Processing)
- **Path**: `requirements.txt`
- **Purpose**: Python dependencies for AI image processing
- **Why needed**: If web dev agent needs to run AI processing

## Priority Order for Web Dev Agent

### **MUST HAVE** (Critical for store functionality):
1. `out/grouped_products.json` - Main product catalog
2. `out/front_view_designs/` - Product images
3. `models/Product.js` - Database schema
4. `routes/products.js` - Product API
5. `server.js` - Backend server

### **SHOULD HAVE** (Enhanced functionality):
6. `out/back_view_designs/` - Additional product images
7. `out/ai_products_for_admin.json` - Admin data
8. `routes/sync.js` - Sync endpoints
9. `out/front_selection.json` - Hero images
10. `package.json` - Dependencies

### **NICE TO HAVE** (Analytics and documentation):
11. `out/product_grouping_stats.json` - Analytics
12. `docs/PRODUCT_LINKING_EXPLANATION.md` - Documentation
13. `client/src/` - React components (if applicable)

## Integration Notes for Web Dev Agent

- **Product IDs**: Each product has a unique `product_id` for database operations
- **Image Paths**: Images are organized by design name in separate folders
- **SEO Ready**: All products have SEO-optimized handles and descriptions
- **Price Bands**: Products are categorized into price ranges (budget, mid-range, premium)
- **Hero Card Ready**: Products marked as `hero_card_ready: true` are optimized for featured display
- **Visual Coolness**: Products have coolness scores (0-1) for sorting/filtering
- **Multi-view Support**: Products can have multiple front views and back views

## File Size Information

- **grouped_products.json**: ~50KB (47 products)
- **Image folders**: ~2-5MB total (74 images)
- **Code files**: ~50KB total
- **Total package**: ~5-10MB

This gives the web development agent everything needed to build a complete e-commerce store with the AI-generated product catalog.