# Quick Start Guide

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Test API Endpoints**
   - GET `/api/products` - List all products
   - GET `/api/products/:category` - Products by category
   - GET `/api/hero` - Hero products
   - GET `/api/bundles` - Bundle suggestions

## Key Features

- [x] 44 AI-generated products
- [x] 8 product categories
- [x] Hero product selection
- [x] Bundle suggestions
- [x] Conversion optimization ready
- [x] Front/back image support
- [x] Relative image paths for web deployment

## File Structure

```
├── PRODUCTION_READY_CATALOG.json  # Main product catalog
├── PRODUCTS/                       # Product images
├── backend/                        # Server-side code
│   ├── models/Product.js          # Product schema
│   ├── routes/                    # API endpoints
│   └── server.js                  # Express server
├── frontend/                      # Client-side code
└── docs/                          # Documentation
```

See README.md for complete integration guide.
