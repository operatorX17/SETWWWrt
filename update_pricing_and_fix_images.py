#!/usr/bin/env python3
"""
Update OG catalog pricing based on user feedback and fix image paths
"""

import json
import os
from datetime import datetime

def update_og_catalog():
    print("🔧 Updating OG catalog with new pricing and image fixes...")
    
    # Load current catalog
    with open('/app/frontend/public/comprehensive_products.json', 'r') as f:
        catalog = json.load(f)
    
    products = catalog.get('products', [])
    updated_count = 0
    
    # User's pricing guidelines:
    # T-shirts: ₹699 sweet spot, can go ₹899-₹975 for exclusives  
    # Hoodies affordable: ₹1119-₹1299
    # Headbands: lower cost for reach
    
    pricing_rules = {
        'tee': {
            'base': (699, 799),
            'exclusive': (899, 975),
            'premium': (849, 925)
        },
        'shirt': {
            'base': (699, 799), 
            'exclusive': (899, 975),
            'premium': (849, 925)
        },
        'hoodie': {
            'base': (1119, 1299),
            'exclusive': (1399, 1599),
            'premium': (1299, 1499)
        },
        'sweatshirt': {
            'base': (999, 1199),
            'exclusive': (1299, 1499),
            'premium': (1199, 1399)
        },
        'headband': {
            'base': (199, 299),
            'exclusive': (399, 499),
            'premium': (299, 399)
        },
        'cap': {
            'base': (599, 799),
            'exclusive': (899, 999),
            'premium': (799, 899)
        },
        'poster': {
            'base': (299, 499),
            'exclusive': (599, 799),
            'premium': (499, 599)
        },
        'slide': {
            'base': (799, 999),
            'exclusive': (1199, 1399),
            'premium': (999, 1199)
        },
        'wallet': {
            'base': (999, 1299),
            'exclusive': (1499, 1799),
            'premium': (1299, 1499)
        }
    }
    
    for product in products:
        category = product.get('category', '').lower()
        badges = product.get('badges', [])
        
        # Determine pricing tier
        tier = 'base'
        if any(badge in ['VAULT_EXCLUSIVE', 'VAULT', 'REBEL_DROP'] for badge in badges):
            tier = 'exclusive'
        elif any(badge in ['BEST_SELLER', 'PREMIUM'] for badge in badges):
            tier = 'premium'
        
        # Update pricing if category exists in rules
        if category in pricing_rules:
            price_range = pricing_rules[category][tier]
            # Use middle of range for consistency
            new_price = (price_range[0] + price_range[1]) // 2
            old_price = product.get('price')
            
            product['price'] = str(new_price)
            product['compare_at_price'] = str(int(new_price * 1.25))  # 25% markup for compare
            
            # Update variants
            for variant in product.get('variants', []):
                variant['price'] = new_price
            
            if old_price != str(new_price):
                updated_count += 1
                print(f"  📊 {product['title'][:50]}... {old_price} → ₹{new_price}")
        
        # Fix image paths - ensure they're web accessible
        if 'images' in product:
            images = product['images']
            
            # Convert paths to web-accessible format
            for img_type in ['front', 'back']:
                if images.get(img_type):
                    # Ensure path starts with forward slash for web access
                    img_path = images[img_type]
                    if not img_path.startswith('/'):
                        images[img_type] = '/' + img_path
                    
                    # Replace spaces with %20 for URL encoding
                    images[img_type] = images[img_type].replace(' ', '%20')
            
            # Also update the primary image in the main images array
            primary_image = None
            if images.get('back'):
                primary_image = images['back']
            elif images.get('front'):
                primary_image = images['front']
            
            if primary_image:
                product['primaryImage'] = primary_image
                # Ensure images array exists for product card compatibility
                if 'images' not in product or not isinstance(product.get('images'), list):
                    product['images'] = []
                
                # Add both front and back to images array
                image_list = []
                if images.get('back'):
                    image_list.append(images['back'])
                if images.get('front'):
                    image_list.append(images['front'])
                
                # Update the images array for Rail component
                if image_list:
                    product['images'] = image_list
    
    # Update metadata
    catalog['metadata']['updated_at'] = datetime.now().isoformat()
    catalog['metadata']['pricing_update'] = 'user_feedback_applied'
    catalog['metadata']['image_fixes'] = 'web_accessible_paths'
    
    # Save updated catalog
    with open('/app/frontend/public/comprehensive_products.json', 'w') as f:
        json.dump(catalog, f, indent=2)
    
    print(f"✅ Updated pricing for {updated_count} products")
    print("✅ Fixed image paths for web accessibility")
    print("✅ Catalog updated successfully!")
    
    return updated_count

if __name__ == "__main__":
    update_og_catalog()