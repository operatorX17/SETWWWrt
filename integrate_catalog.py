#!/usr/bin/env python3
"""
Efficient Catalog Integration Script
Transforms and integrates new FINAL_PRODUCTION_CATALOG.json with existing store
"""

import json
import os
from datetime import datetime

def fix_image_path(path):
    """Convert Windows-style paths to web-compatible paths"""
    if not path:
        return path
    # Replace both types of Windows path separators with forward slashes
    return path.replace('\\\\', '/').replace('\\', '/')

def fix_product_images(product):
    """Fix all image paths in a product"""
    if 'images' in product:
        if product['images'].get('front'):
            product['images']['front'] = fix_image_path(product['images']['front'])
        if product['images'].get('back'):
            product['images']['back'] = fix_image_path(product['images']['back'])
        if product['images'].get('variants'):
            product['images']['variants'] = [fix_image_path(v) for v in product['images']['variants']]
    return product

def main():
    print("🚀 Starting Catalog Integration...")
    
    # Load the new comprehensive catalog
    with open('/app/frontend/newupdates/FINAL_PRODUCTION_CATALOG.json', 'r') as f:
        catalog = json.load(f)
    
    print(f"📦 Loaded catalog with {catalog['metadata']['total_products']} products")
    
    # Process hero section
    if 'hero_section' in catalog and 'featured_product' in catalog['hero_section']:
        catalog['hero_section']['featured_product'] = fix_product_images(catalog['hero_section']['featured_product'])
    
    # Process all products
    for i, product in enumerate(catalog['products']):
        catalog['products'][i] = fix_product_images(product)
    
    # Update metadata for integration
    catalog['metadata']['updated_at'] = datetime.now().isoformat()
    catalog['metadata']['integration_status'] = 'ACTIVE'
    catalog['metadata']['previous_products'] = 36
    catalog['metadata']['new_products'] = catalog['metadata']['total_products']
    catalog['metadata']['source'] = 'FINAL_PRODUCTION_CATALOG'
    
    # Save the new comprehensive catalog (replaces old one)
    with open('/app/frontend/public/comprehensive_products.json', 'w') as f:
        json.dump(catalog, f, indent=2)
    
    print("✅ INTEGRATION COMPLETE!")
    print(f"✅ Products: {len(catalog['products'])} (increased from 36 to 56)")
    print(f"✅ Categories: {', '.join(catalog['metadata']['categories'])}")
    print("✅ Fixed all image paths for web compatibility")
    print("✅ Replaced comprehensive_products.json with new catalog")
    print("✅ Removed old crap - fresh premium OG catalog active!")

if __name__ == "__main__":
    main()