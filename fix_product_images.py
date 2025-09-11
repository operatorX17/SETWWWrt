#!/usr/bin/env python3
"""
Script to fix product images and data structure for the frontend
"""

import json
import os
from pathlib import Path

def transform_grouped_products_to_frontend_format():
    """Transform grouped_products.json to frontend-compatible format"""
    
    # Read the grouped products data
    grouped_products_path = Path('frontend/public/grouped_products.json')
    with open(grouped_products_path, 'r', encoding='utf-8') as f:
        grouped_data = json.load(f)
    
    frontend_products = []
    
    for product in grouped_data['products']:
        # Create frontend-compatible product structure
        frontend_product = {
            "id": product['handle'],
            "name": product['title'],
            "handle": product['handle'],
            "category": product['category'],
            "price": product['price_inr'],
            "originalPrice": product['price_inr'] * 1.33,  # Add 33% markup as original
            "badges": [product['badge'], product['price_band']],
            "images": [],
            "primary_image_type": "front",
            "description": product['description'],
            "tags": product['tags'],
            "vendor": "OG Armory",
            "vault_locked": False,
            "visual_coolness_score": product['visual_coolness_score'],
            "hero_card_ready": product['hero_card_ready'],
            "palette": product['palette'],
            "variants": [
                {
                    "id": f"{product['handle']}-variant",
                    "title": "Standard Fit",
                    "price": product['price_inr'],
                    "available": True
                }
            ]
        }
        
        # Add images with correct paths
        for image in product['images']:
            if image['view'] == 'front':
                image_path = f"/images/front_view_designs/{product['handle_fragment']}/{image['image_id']}"
            else:
                image_path = f"/images/back_view_designs/{product['handle_fragment']}/{image['image_id']}"
            
            frontend_product['images'].append(image_path)
            
            # Set primary image type based on the primary image
            if image.get('is_primary', False):
                frontend_product['primary_image_type'] = image['view']
        
        # If no images were added, add a placeholder based on handle_fragment
        if not frontend_product['images']:
            # Try to find the image file in the directories
            front_dir = Path(f'frontend/public/images/front_view_designs/{product["handle_fragment"]}')
            back_dir = Path(f'frontend/public/images/back_view_designs/{product["handle_fragment"]}')
            
            if front_dir.exists():
                for img_file in front_dir.glob('*.jpeg'):
                    frontend_product['images'].append(f"/images/front_view_designs/{product['handle_fragment']}/{img_file.name}")
                    break
            
            if back_dir.exists():
                for img_file in back_dir.glob('*.jpeg'):
                    frontend_product['images'].append(f"/images/back_view_designs/{product['handle_fragment']}/{img_file.name}")
                    break
        
        frontend_products.append(frontend_product)
    
    # Write the transformed data
    output_path = Path('frontend/public/products.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(frontend_products, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Transformed {len(frontend_products)} products")
    print(f"📁 Updated {output_path}")
    
    return frontend_products

def verify_image_paths():
    """Verify that image paths exist"""
    
    products_path = Path('frontend/public/products.json')
    if not products_path.exists():
        print("❌ products.json not found")
        return
    
    with open(products_path, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    missing_images = []
    found_images = []
    
    for product in products:
        for image_path in product.get('images', []):
            # Convert web path to file system path
            file_path = Path('frontend/public' + image_path)
            if file_path.exists():
                found_images.append(image_path)
            else:
                missing_images.append(image_path)
    
    print(f"\n📊 Image Verification Results:")
    print(f"✅ Found: {len(found_images)} images")
    print(f"❌ Missing: {len(missing_images)} images")
    
    if missing_images:
        print("\n🔍 Missing images:")
        for img in missing_images[:10]:  # Show first 10
            print(f"  - {img}")
        if len(missing_images) > 10:
            print(f"  ... and {len(missing_images) - 10} more")

if __name__ == '__main__':
    print("🔧 Fixing product images and data structure...")
    
    # Transform the data
    transform_grouped_products_to_frontend_format()
    
    # Verify the results
    verify_image_paths()
    
    print("\n✨ Product image fix complete!")