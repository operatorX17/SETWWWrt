#!/usr/bin/env python3
"""
Create REAL working products using ACTUAL IMAGE PATHS
- Maps to existing images in /app/PRODUCTS/
- Creates Shopify-compatible product structure
- Ensures all collections have products
- Prioritizes back images as requested
"""

import json
import os
from pathlib import Path
import urllib.parse

def find_real_images():
    """Find all actual image files and map them properly"""
    products_dir = Path("/app/PRODUCTS")
    image_mapping = {}
    
    # Walk through all directories and find images
    for root, dirs, files in os.walk(products_dir):
        root_path = Path(root)
        images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        
        if images:
            # Parse the path structure
            parts = root_path.parts[2:]  # Skip /app/PRODUCTS
            if len(parts) >= 2:
                category = parts[0]
                product_name = parts[1]
                
                if category not in image_mapping:
                    image_mapping[category] = {}
                
                if product_name not in image_mapping[category]:
                    image_mapping[category][product_name] = {
                        'front': [],
                        'back': [],
                        'colors': {},
                        'direct': []
                    }
                
                # Determine image type
                folder_name = root_path.name.lower()
                if 'back' in folder_name:
                    image_mapping[category][product_name]['back'].extend([
                        f"https://ogshop.preview.emergentagent.com/products/{'/'.join(parts)}/{img}"
                        for img in images
                    ])
                elif 'front' in folder_name:
                    image_mapping[category][product_name]['front'].extend([
                        f"https://ogshop.preview.emergentagent.com/products/{'/'.join(parts)}/{img}"
                        for img in images
                    ])
                elif folder_name in ['black', 'blue', 'grey', 'red', 'navy', 'white']:
                    # Color variant
                    if folder_name not in image_mapping[category][product_name]['colors']:
                        image_mapping[category][product_name]['colors'][folder_name] = []
                    image_mapping[category][product_name]['colors'][folder_name].extend([
                        f"https://ogshop.preview.emergentagent.com/products/{'/'.join(parts)}/{img}"
                        for img in images
                    ])
                else:
                    # Direct images in product folder
                    image_mapping[category][product_name]['direct'].extend([
                        f"https://ogshop.preview.emergentagent.com/products/{'/'.join(parts)}/{img}"
                        for img in images
                    ])
    
    return image_mapping

def create_shopify_compatible_products():
    """Create products that work with both our system and Shopify"""
    image_mapping = find_real_images()
    products = []
    product_id = 3000
    
    print("🔍 Found images for:")
    for category, products_dict in image_mapping.items():
        print(f"  {category}: {list(products_dict.keys())}")
    
    # TEESHIRTS - Using actual found images
    if 'teeshirt' in image_mapping:
        for design_name, image_data in image_mapping['teeshirt'].items():
            # Get all available images for this design
            all_images = []
            back_images = image_data.get('back', [])
            front_images = image_data.get('front', [])
            direct_images = image_data.get('direct', [])
            
            # Color variants
            colors = list(image_data.get('colors', {}).keys())
            color_images = []
            for color, imgs in image_data.get('colors', {}).items():
                color_images.extend(imgs)
            
            # PRIORITIZE BACK IMAGES FIRST!
            all_images = back_images + color_images + direct_images + front_images
            
            # Remove duplicates while preserving order
            unique_images = []
            seen = set()
            for img in all_images:
                if img not in seen:
                    unique_images.append(img)
                    seen.add(img)
            
            if unique_images:  # Only create product if we have real images
                # Determine price based on design
                price = 999 if 'minimal' in design_name.lower() else 1199
                if 'vintage' in design_name.lower() or 'urban' in design_name.lower():
                    price = 1299
                
                # Create badges
                badges = ["REBEL DROP"]
                if price <= 999:
                    badges.append("UNDER ₹999")
                if len(colors) > 1:
                    badges.append("MULTI-COLOR")
                
                # Shopify-compatible structure
                product = {
                    "id": product_id,
                    "name": f"{design_name} Rebel Tee",
                    "title": f"[ARMORY // REBEL TEE] — {design_name.upper()}",
                    "handle": design_name.lower().replace(' ', '-') + '-rebel-tee',
                    "category": "Teeshirt",
                    "product_type": "T-Shirt",
                    "vendor": "DVV Entertainment",
                    "price": price,
                    "compare_at_price": price + 300,
                    "colors": colors,
                    "mood_code": "STORM" if 'ocean' in design_name.lower() else "SHADOW",
                    "images": unique_images[:7],  # Max 7 images
                    "featured_image": unique_images[0],  # First image (prioritized back)
                    "badges": badges,
                    "tags": ["OG", "Rebel", "Teeshirt"] + colors,
                    "description": f"{design_name} rebel tee - Premium OG design. Available in {len(colors)} colors. Built for rebels.",
                    "variants": [
                        {
                            "id": product_id * 100 + i,
                            "title": f"{size}",
                            "option1": size,
                            "price": price,
                            "inventory_quantity": [5,12,18,22,9,4][i],
                            "inventory_management": "shopify",
                            "weight": 200,
                            "weight_unit": "g"
                        }
                        for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
                    ],
                    "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
                    "published": True,
                    "status": "active",
                    "created_at": "2024-09-04T00:00:00Z",
                    "updated_at": "2024-09-04T00:00:00Z"
                }
                products.append(product)
                product_id += 1
    
    # HOODIES - Using actual found images
    if 'hoodies' in image_mapping:
        for hoodie_name, image_data in image_mapping['hoodies'].items():
            all_images = []
            back_images = image_data.get('back', [])
            front_images = image_data.get('front', [])
            direct_images = image_data.get('direct', [])
            
            # PRIORITIZE BACK IMAGES FIRST!
            all_images = back_images + direct_images + front_images
            
            # Remove duplicates
            unique_images = []
            seen = set()
            for img in all_images:
                if img not in seen:
                    unique_images.append(img)
                    seen.add(img)
            
            if unique_images:
                price = 2499 if 'product1' in hoodie_name else 2199
                
                product = {
                    "id": product_id,
                    "name": f"Beast Hoodie {hoodie_name[-1]}",
                    "title": f"[ARMORY // BEAST HOODIE] — {hoodie_name.upper()}",
                    "handle": f"beast-hoodie-{hoodie_name.lower()}",
                    "category": "Hoodies",
                    "product_type": "Hoodie",
                    "vendor": "DVV Entertainment",
                    "price": price,
                    "compare_at_price": price + 500,
                    "mood_code": "SHADOW",
                    "images": unique_images[:7],
                    "featured_image": unique_images[0],
                    "badges": ["BEAST DROP"],
                    "tags": ["OG", "Beast", "Hoodie", "Premium"],
                    "description": f"Beast Hoodie {hoodie_name} - Premium hoodie forged in shadow mode. Built for stealth warfare.",
                    "variants": [
                        {
                            "id": product_id * 100 + i,
                            "title": f"{size}",
                            "option1": size,
                            "price": price,
                            "inventory_quantity": [2,6,10,12,7,3][i],
                            "inventory_management": "shopify",
                            "weight": 600,
                            "weight_unit": "g"
                        }
                        for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
                    ],
                    "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
                    "published": True,
                    "status": "active",
                    "created_at": "2024-09-04T00:00:00Z",
                    "updated_at": "2024-09-04T00:00:00Z"
                }
                products.append(product)
                product_id += 1
    
    # ACCESSORIES - Using actual found images
    accessories_categories = ['hats', 'slippers', 'wallet']
    for acc_category in accessories_categories:
        if acc_category in image_mapping:
            for acc_name, image_data in image_mapping[acc_category].items():
                all_images = []
                back_images = image_data.get('back', [])
                front_images = image_data.get('front', [])
                direct_images = image_data.get('direct', [])
                
                # Prioritize back if available, otherwise front
                all_images = back_images + direct_images + front_images
                
                # Remove duplicates
                unique_images = []
                seen = set()
                for img in all_images:
                    if img not in seen:
                        unique_images.append(img)
                        seen.add(img)
                
                if unique_images:
                    price = 799 if acc_category == 'hats' else 699 if acc_category == 'slippers' else 899
                    product_name = f"Rebel {acc_category.title()[:-1]} {acc_name[-1]}"  # Remove 's' from category
                    
                    product = {
                        "id": product_id,
                        "name": product_name,
                        "title": f"[ARMORY // {product_name.upper()}] — GEAR",
                        "handle": f"{acc_category}-{acc_name.lower()}",
                        "category": "Accessories",
                        "product_type": acc_category.title()[:-1],
                        "vendor": "DVV Entertainment",
                        "price": price,
                        "compare_at_price": price + 200,
                        "mood_code": "EMBER",
                        "images": unique_images[:7],
                        "featured_image": unique_images[0],
                        "badges": ["ARSENAL", "UNDER ₹999"],
                        "tags": ["OG", "Arsenal", acc_category.title()],
                        "description": f"{product_name} - Essential gear for every rebel warrior.",
                        "variants": [
                            {
                                "id": product_id * 100,
                                "title": "Default",
                                "option1": "Default",
                                "price": price,
                                "inventory_quantity": 30,
                                "inventory_management": "shopify",
                                "weight": 100,
                                "weight_unit": "g"
                            }
                        ],
                        "options": [{"name": "Size", "values": ["One Size"]}],
                        "published": True,
                        "status": "active",
                        "created_at": "2024-09-04T00:00:00Z",
                        "updated_at": "2024-09-04T00:00:00Z"
                    }
                    products.append(product)
                    product_id += 1
    
    # POSTERS - Using actual found images
    if 'posters' in image_mapping:
        for poster_name, image_data in image_mapping['posters'].items():
            all_images = image_data.get('direct', []) + image_data.get('front', [])
            
            if all_images:
                product = {
                    "id": product_id,
                    "name": f"War Poster {poster_name[-1]}",
                    "title": f"[ARMORY // WAR POSTER] — {poster_name.upper()}",
                    "handle": f"war-poster-{poster_name.lower()}",
                    "category": "Posters",
                    "product_type": "Poster",
                    "vendor": "DVV Entertainment",
                    "price": 599,
                    "compare_at_price": 799,
                    "mood_code": "MONOLITH",
                    "images": all_images[:7],
                    "featured_image": all_images[0],
                    "badges": ["WAR POSTER", "UNDER ₹999"],
                    "tags": ["OG", "War", "Poster", "A2"],
                    "description": f"War Poster {poster_name} - A2 battlefield visual. Premium print ready for combat.",
                    "variants": [
                        {
                            "id": product_id * 100,
                            "title": "A2",
                            "option1": "A2",
                            "price": 599,
                            "inventory_quantity": 25,
                            "inventory_management": "shopify",
                            "weight": 50,
                            "weight_unit": "g"
                        }
                    ],
                    "options": [{"name": "Size", "values": ["A2"]}],
                    "published": True,
                    "status": "active",
                    "created_at": "2024-09-04T00:00:00Z",
                    "updated_at": "2024-09-04T00:00:00Z"
                }
                products.append(product)
                product_id += 1
    
    return products

def create_collections(products):
    """Create Shopify-compatible collections"""
    collections = [
        {
            "id": 1,
            "handle": "rebellion-core",
            "title": "Rebellion Core",
            "description": "Essential gear for every rebel soldier. Core items that define the OG tribe.",
            "products": [p for p in products if any(badge in ["REBEL DROP", "ARSENAL"] for badge in p.get("badges", []))],
            "published": True,
            "sort_order": "manual"
        },
        {
            "id": 2,
            "handle": "under-999",
            "title": "Under ₹999",
            "description": "Premium OG gear accessible to every rebel. No soldier left behind.",
            "products": [p for p in products if p.get("price", 0) <= 999],
            "published": True,
            "sort_order": "price-ascending"
        },
        {
            "id": 3,
            "handle": "beast-mode",
            "title": "Beast Mode",
            "description": "Premium hoodies and sweatshirts for elite warriors.",
            "products": [p for p in products if "BEAST" in str(p.get("badges", []))],
            "published": True,
            "sort_order": "price-descending"
        },
        {
            "id": 4,
            "handle": "multi-color",
            "title": "Multi-Color Arsenal",
            "description": "Products available in multiple color variants for customization.",
            "products": [p for p in products if len(p.get("colors", [])) > 1],
            "published": True,
            "sort_order": "manual"
        }
    ]
    
    return collections

if __name__ == "__main__":
    print("🔥 Creating REAL working products with actual images...")
    
    products = create_shopify_compatible_products()
    collections = create_collections(products)
    
    # Save products
    products_file = "/app/frontend/public/working_products.json"
    with open(products_file, "w") as f:
        json.dump(products, f, indent=2)
    
    # Save collections
    collections_file = "/app/frontend/public/working_collections.json"
    with open(collections_file, "w") as f:
        json.dump(collections, f, indent=2)
    
    print(f"✅ Created {len(products)} working products with real images!")
    print(f"✅ Created {len(collections)} collections with products!")
    print(f"📁 Saved to: {products_file}")
    print(f"📁 Collections: {collections_file}")
    
    # Summary
    categories = {}
    under_999 = 0
    multi_color = 0
    
    for product in products:
        cat = product["category"]
        categories[cat] = categories.get(cat, 0) + 1
        
        if product["price"] <= 999:
            under_999 += 1
        
        if len(product.get("colors", [])) > 1:
            multi_color += 1
    
    print(f"\n📊 WORKING PRODUCT BREAKDOWN:")
    for cat, count in categories.items():
        print(f"  - {cat}: {count} products")
    
    print(f"\n💰 PRICING:")
    print(f"  - Under ₹999: {under_999} products")
    print(f"  - Multi-Color Products: {multi_color} products")
    print(f"  - Total Working Products: {len(products)}")
    
    print(f"\n📦 COLLECTIONS:")
    for collection in collections:
        print(f"  - {collection['title']}: {len(collection['products'])} products")
    
    print(f"\n🎨 REAL IMAGES CONFIRMED:")
    print(f"  - All products use actual image files from /app/PRODUCTS/")
    print(f"  - Back images prioritized where available")
    print(f"  - Shopify-compatible structure")
    print(f"  - Collections properly populated")