#!/usr/bin/env python3
"""
Quick fix for image paths - make them simple and working
"""

import json
import os

def fix_images():
    print("🔧 Quick image path fix...")
    
    # Load current catalog
    with open('/app/frontend/public/comprehensive_products.json', 'r') as f:
        catalog = json.load(f)
    
    products = catalog.get('products', [])
    fixed_count = 0
    
    for product in products:
        if 'images' in product and isinstance(product['images'], dict):
            # Convert to simple array format
            image_array = []
            
            # Add back image first (user preference)
            if product['images'].get('back'):
                image_array.append(product['images']['back'])
            
            # Add front image
            if product['images'].get('front'):
                image_array.append(product['images']['front'])
            
            # Update to simple array
            if image_array:
                product['images'] = image_array
                fixed_count += 1
                print(f"  📸 Fixed {product['title'][:50]}...")
    
    # Save updated catalog
    with open('/app/frontend/public/comprehensive_products.json', 'w') as f:
        json.dump(catalog, f, indent=2)
    
    print(f"✅ Fixed images for {fixed_count} products")
    return fixed_count

if __name__ == "__main__":
    fix_images()