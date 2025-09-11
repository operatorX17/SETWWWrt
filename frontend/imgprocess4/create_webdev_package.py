#!/usr/bin/env python3
import os
import shutil
import json
from datetime import datetime

def create_webdev_package():
    """Create a clean package for web development team with only essential files"""
    
    # Create package directory
    package_name = f"AI_PRODUCT_CATALOG_WEBDEV_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    package_dir = os.path.join(os.getcwd(), package_name)
    
    if os.path.exists(package_dir):
        shutil.rmtree(package_dir)
    
    os.makedirs(package_dir)
    
    print(f"Creating web development package: {package_name}")
    
    # Essential files to copy
    essential_files = [
        # Core catalog and images
        ("FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json", "PRODUCTION_READY_CATALOG.json"),
        ("FINAL_DEPLOYMENT_FILES/PRODUCTS", "PRODUCTS"),
        
        # Backend files
        ("models/Product.js", "backend/models/Product.js"),
        ("routes/products.js", "backend/routes/products.js"),
        ("routes/sync.js", "backend/routes/sync.js"),
        ("server.js", "backend/server.js"),
        ("package.json", "backend/package.json"),
        
        # Frontend files
        ("client/src/App.js", "frontend/src/App.js"),
        ("client/src/components", "frontend/src/components"),
        ("client/src/pages", "frontend/src/pages"),
        
        # Documentation
        ("WEB_DEV_INTEGRATION_GUIDE.md", "README.md"),
        ("docs/WEB_DEV_OPTIMIZATION_GUIDE.md", "docs/OPTIMIZATION_GUIDE.md"),
    ]
    
    copied_files = []
    skipped_files = []
    
    for source, dest in essential_files:
        source_path = os.path.join(os.getcwd(), source)
        dest_path = os.path.join(package_dir, dest)
        
        if os.path.exists(source_path):
            # Create destination directory
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            
            if os.path.isdir(source_path):
                shutil.copytree(source_path, dest_path)
                copied_files.append(f"DIR {dest}/ (directory)")
            else:
                shutil.copy2(source_path, dest_path)
                copied_files.append(f"FILE {dest}")
        else:
            skipped_files.append(f"SKIP {source} (not found)")
    
    # Create environment template
    env_template = """.env.example
# Environment Variables Template
# Copy this to .env and fill in your values

# Database
DATABASE_URL=your_database_url_here
MONGO_URI=your_mongodb_uri_here

# Server
PORT=3000
NODE_ENV=development

# API Keys (if needed)
API_KEY=your_api_key_here

# Image serving
IMAGE_BASE_URL=http://localhost:3000/images
"""
    
    with open(os.path.join(package_dir, ".env.example"), "w", encoding='utf-8') as f:
        f.write(env_template)
    copied_files.append("FILE .env.example")
    
    # Create quick start guide
    quick_start = """# Quick Start Guide

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
"""
    
    with open(os.path.join(package_dir, "QUICK_START.md"), "w", encoding='utf-8') as f:
        f.write(quick_start)
    copied_files.append("FILE QUICK_START.md")
    
    # Create package manifest
    manifest = {
        "package_name": package_name,
        "created_at": datetime.now().isoformat(),
        "description": "AI-Generated Product Catalog for Web Development",
        "total_products": 44,
        "categories": 8,
        "hero_products": 3,
        "bundle_offers": 5,
        "files_included": copied_files,
        "files_skipped": skipped_files,
        "system_requirements": {
            "node_js": ">= 14.0.0",
            "npm": ">= 6.0.0",
            "database": "MongoDB or PostgreSQL"
        },
        "features": [
            "AI-generated product names and descriptions",
            "Smart categorization system",
            "Conversion optimization ready",
            "Hero product selection",
            "Bundle suggestions",
            "Front/back image support",
            "RESTful API endpoints",
            "Modern React components"
        ]
    }
    
    with open(os.path.join(package_dir, "PACKAGE_MANIFEST.json"), "w", encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)
    copied_files.append("FILE PACKAGE_MANIFEST.json")
    
    # Print summary
    print(f"\n[SUCCESS] Web Development Package Created: {package_name}")
    print(f"[PACKAGE] Package Location: {package_dir}")
    print(f"\n[FILES] Files Included ({len(copied_files)}):")
    for file in copied_files:
        print(f"   {file}")
    
    if skipped_files:
        print(f"\n[WARNING] Files Skipped ({len(skipped_files)}):")
        for file in skipped_files:
            print(f"   {file}")
    
    print(f"\n[NEXT STEPS] For Web Dev Team:")
    print(f"   1. Extract/copy the package to your development environment")
    print(f"   2. Read QUICK_START.md for setup instructions")
    print(f"   3. Review README.md for complete integration guide")
    print(f"   4. Check PACKAGE_MANIFEST.json for package details")
    
    return package_dir

if __name__ == "__main__":
    create_webdev_package()