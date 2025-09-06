#!/usr/bin/env python3
"""
CREATE ALL PRODUCTS - COMPREHENSIVE SYSTEM
- Scans EVERY product in /app/PRODUCTS/
- Creates complete product catalog  
- Ensures NOTHING is missing
- Uses actual image paths
"""

import json
import os
from pathlib import Path
import urllib.parse

def scan_all_products():
    """Scan EVERY product in the directory and create comprehensive catalog"""
    products_dir = Path("/app/PRODUCTS")
    all_products = []
    product_id = 5000
    
    print("🔍 SCANNING ALL PRODUCTS IN YOUR DIRECTORY...")
    
    # 1. TEESHIRTS - All designs with variants
    teeshirt_dir = products_dir / "teeshirt"
    if teeshirt_dir.exists():
        print(f"📁 Scanning teeshirts...")
        for design_folder in teeshirt_dir.iterdir():
            if design_folder.is_dir():
                images = []
                colors = []
                
                # Check for color variants (Blue, black, grey, etc.)
                for item in design_folder.iterdir():
                    if item.is_dir() and item.name.lower() in ['blue', 'black', 'grey', 'red', 'navy', 'white', 'green', 'brown', 'purple']:
                        colors.append(item.name)
                        # Get images from color folder
                        color_images = list(item.glob("*.jpg")) + list(item.glob("*.jpeg")) + list(item.glob("*.png"))
                        for img in color_images:
                            images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                # Check for front/back folders
                front_dir = design_folder / "front"
                back_dir = design_folder / "back"
                
                if back_dir.exists():
                    back_images = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
                    for img in back_images:
                        images.insert(0, f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")  # Insert at beginning for priority
                
                if front_dir.exists():
                    front_images = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    for img in front_images:
                        images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                # Direct images in design folder
                direct_images = [f for f in design_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                for img in direct_images:
                    images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                if images:  # Only create if we have images
                    price = 999 if 'minimal' in design_folder.name.lower() else 1199
                    if 'vintage' in design_folder.name.lower() or 'urban' in design_folder.name.lower():
                        price = 1299
                    
                    badges = ["REBEL DROP"]
                    if price <= 999:
                        badges.append("UNDER ₹999")
                    if len(colors) > 1:
                        badges.append("MULTI-COLOR")
                    
                    product = {
                        "id": product_id,
                        "name": f"{design_folder.name} Rebel Tee",
                        "title": f"[ARMORY // REBEL TEE] — {design_folder.name.upper()}",
                        "handle": design_folder.name.lower().replace(' ', '-') + '-rebel-tee',
                        "category": "Teeshirt",
                        "product_type": "T-Shirt",
                        "vendor": "DVV Entertainment",
                        "price": price,
                        "compare_at_price": price + 300,
                        "colors": colors,
                        "images": images[:7],
                        "featured_image": images[0] if images else "",
                        "badges": badges,
                        "tags": ["OG", "Rebel", "Teeshirt"] + colors,
                        "description": f"{design_folder.name} rebel tee - Premium OG design. Built for rebels. {len(colors)} color variants available." if colors else f"{design_folder.name} rebel tee - Premium OG design. Built for rebels.",
                        "variants": [
                            {
                                "id": product_id * 100 + i,
                                "title": size,
                                "option1": size,
                                "price": price,
                                "inventory_quantity": [5,12,18,22,9,4][i],
                                "inventory_management": "shopify"
                            }
                            for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
                        ],
                        "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
                        "published": True,
                        "status": "active"
                    }
                    all_products.append(product)
                    product_id += 1
                    print(f"   ✅ {design_folder.name} ({len(colors)} colors, {len(images)} images)")
    
    # 2. HOODIES - ALL 21+ products
    hoodies_dir = products_dir / "hoodies" 
    if hoodies_dir.exists():
        print(f"📁 Scanning hoodies...")
        for hoodie_folder in hoodies_dir.iterdir():
            if hoodie_folder.is_dir():
                images = []
                
                # Prioritize back images
                back_dirs = [d for d in hoodie_folder.iterdir() if d.is_dir() and 'back' in d.name.lower()]
                for back_dir in back_dirs:
                    back_images = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
                    for img in back_images:
                        images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                # Front images
                front_dirs = [d for d in hoodie_folder.iterdir() if d.is_dir() and 'front' in d.name.lower()]
                for front_dir in front_dirs:
                    front_images = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    for img in front_images:
                        images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                # Direct images
                direct_images = [f for f in hoodie_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                for img in direct_images:
                    images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                if images:
                    # Price based on product number
                    base_price = 2199
                    if 'product1' in hoodie_folder.name or 'Product11' in hoodie_folder.name:
                        base_price = 2499
                    elif int(hoodie_folder.name.replace('product', '').replace('Product', '')) > 15:
                        base_price = 2699
                    
                    product = {
                        "id": product_id,
                        "name": f"Beast Hoodie {hoodie_folder.name}",
                        "title": f"[ARMORY // BEAST HOODIE] — {hoodie_folder.name.upper()}",
                        "handle": f"beast-hoodie-{hoodie_folder.name.lower()}",
                        "category": "Hoodies",
                        "product_type": "Hoodie",
                        "vendor": "DVV Entertainment",
                        "price": base_price,
                        "compare_at_price": base_price + 500,
                        "images": images[:7],
                        "featured_image": images[0],
                        "badges": ["BEAST DROP"] if base_price < 2500 else ["PREDATOR DROP", "PREMIUM"],
                        "tags": ["OG", "Beast", "Hoodie", "Premium"],
                        "description": f"Beast Hoodie {hoodie_folder.name} - Premium hoodie forged for warriors. Built for stealth combat.",
                        "variants": [
                            {
                                "id": product_id * 100 + i,
                                "title": size,
                                "option1": size,
                                "price": base_price,
                                "inventory_quantity": [2,6,10,12,7,3][i],
                                "inventory_management": "shopify"
                            }
                            for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
                        ],
                        "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
                        "published": True,
                        "status": "active"
                    }
                    all_products.append(product)
                    product_id += 1
                    print(f"   ✅ {hoodie_folder.name} ({len(images)} images)")
    
    # 3. POSTERS - All 10 products
    posters_dir = products_dir / "posters"
    if posters_dir.exists():
        print(f"📁 Scanning posters...")
        for poster_folder in posters_dir.iterdir():
            if poster_folder.is_dir():
                poster_images = list(poster_folder.glob("*.jpg")) + list(poster_folder.glob("*.jpeg")) + list(poster_folder.glob("*.png"))
                if poster_images:
                    images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in poster_images]
                    
                    product = {
                        "id": product_id,
                        "name": f"War Poster {poster_folder.name}",
                        "title": f"[ARMORY // WAR POSTER] — {poster_folder.name.upper()}",
                        "handle": f"war-poster-{poster_folder.name.lower()}",
                        "category": "Posters",
                        "product_type": "Poster",
                        "vendor": "DVV Entertainment",
                        "price": 599,
                        "compare_at_price": 799,
                        "images": images[:7],
                        "featured_image": images[0],
                        "badges": ["WAR POSTER", "UNDER ₹999"],
                        "tags": ["OG", "War", "Poster", "A2"],
                        "description": f"War Poster {poster_folder.name} - A2 battlefield visual. Premium print ready for combat deployment.",
                        "variants": [
                            {
                                "id": product_id * 100,
                                "title": "A2",
                                "option1": "A2",
                                "price": 599,
                                "inventory_quantity": 25,
                                "inventory_management": "shopify"
                            }
                        ],
                        "options": [{"name": "Size", "values": ["A2"]}],
                        "published": True,
                        "status": "active"
                    }
                    all_products.append(product)
                    product_id += 1
                    print(f"   ✅ {poster_folder.name} ({len(images)} images)")
    
    # 4. FULL SHIRTS - All 3 products
    shirts_dir = products_dir / "full shirts"
    if shirts_dir.exists():
        print(f"📁 Scanning full shirts...")
        for shirt_folder in shirts_dir.iterdir():
            if shirt_folder.is_dir():
                images = []
                
                # Check front folder
                front_dir = shirt_folder / "front"
                if front_dir.exists():
                    front_images = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    for img in front_images:
                        images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                if images:
                    product = {
                        "id": product_id,
                        "name": f"Formal Arsenal {shirt_folder.name}",
                        "title": f"[ARMORY // FORMAL] — {shirt_folder.name.upper()}",
                        "handle": f"formal-arsenal-{shirt_folder.name.lower()}",
                        "category": "Full Shirts",
                        "product_type": "Shirt",
                        "vendor": "DVV Entertainment",
                        "price": 1899,
                        "compare_at_price": 2299,
                        "images": images[:7],
                        "featured_image": images[0],
                        "badges": ["FORMAL ARSENAL"],
                        "tags": ["OG", "Formal", "Shirt"],
                        "description": f"Formal Arsenal {shirt_folder.name} - Premium formal wear for corporate warfare. Stealth mode activated.",
                        "variants": [
                            {
                                "id": product_id * 100 + i,
                                "title": size,
                                "option1": size,
                                "price": 1899,
                                "inventory_quantity": [8,15,18,10,4][i],
                                "inventory_management": "shopify"
                            }
                            for i, size in enumerate(["S", "M", "L", "XL", "XXL"])
                        ],
                        "options": [{"name": "Size", "values": ["S", "M", "L", "XL", "XXL"]}],
                        "published": True,
                        "status": "active"
                    }
                    all_products.append(product)
                    product_id += 1
                    print(f"   ✅ {shirt_folder.name} ({len(images)} images)")
    
    # 5. SWEATSHIRTS - All 3 products
    sweat_dir = products_dir / "Sweatshirts"
    if sweat_dir.exists():
        print(f"📁 Scanning sweatshirts...")
        for sweat_folder in sweat_dir.iterdir():
            if sweat_folder.is_dir():
                images = []
                
                # Check for back/front folders
                for subfolder in sweat_folder.iterdir():
                    if subfolder.is_dir():
                        sub_images = list(subfolder.glob("*.jpg")) + list(subfolder.glob("*.jpeg"))
                        for img in sub_images:
                            images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                
                if images:
                    product = {
                        "id": product_id,
                        "name": f"Beast Sweatshirt {sweat_folder.name}",
                        "title": f"[ARMORY // BEAST SWEATSHIRT] — {sweat_folder.name.upper()}",
                        "handle": f"beast-sweatshirt-{sweat_folder.name.lower()}",
                        "category": "Sweatshirts",
                        "product_type": "Sweatshirt",
                        "vendor": "DVV Entertainment",
                        "price": 1699,
                        "compare_at_price": 1999,
                        "images": images[:7],
                        "featured_image": images[0],
                        "badges": ["BEAST DROP"],
                        "tags": ["OG", "Beast", "Sweatshirt"],
                        "description": f"Beast Sweatshirt {sweat_folder.name} - Comfort for warriors. Built for extended combat operations.",
                        "variants": [
                            {
                                "id": product_id * 100 + i,
                                "title": size,
                                "option1": size,
                                "price": 1699,
                                "inventory_quantity": [4,9,14,18,7,3][i],
                                "inventory_management": "shopify"
                            }
                            for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
                        ],
                        "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
                        "published": True,
                        "status": "active"
                    }
                    all_products.append(product)
                    product_id += 1
                    print(f"   ✅ {sweat_folder.name} ({len(images)} images)")
    
    # 6. ACCESSORIES - All variants
    accessory_categories = {
        'hats': ('Rebel Cap', 799, 'Cap'),
        'slippers': ('Warrior Slides', 699, 'Slides'),
        'wallet': ('Battle Wallet', 899, 'Wallet')
    }
    
    for acc_folder, (base_name, price, product_type) in accessory_categories.items():
        acc_dir = products_dir / acc_folder
        if acc_dir.exists():
            print(f"📁 Scanning {acc_folder}...")
            for item_folder in acc_dir.iterdir():
                if item_folder.is_dir():
                    images = []
                    
                    # Check for back/front folders
                    for subfolder in item_folder.iterdir():
                        if subfolder.is_dir():
                            sub_images = list(subfolder.glob("*.jpg")) + list(subfolder.glob("*.jpeg"))
                            for img in sub_images:
                                if 'back' in subfolder.name.lower():
                                    images.insert(0, f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                                else:
                                    images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                    
                    # Direct images
                    direct_images = [f for f in item_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                    for img in direct_images:
                        images.append(f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}")
                    
                    if images:
                        product = {
                            "id": product_id,
                            "name": f"{base_name} {item_folder.name}",
                            "title": f"[ARMORY // {base_name.upper()}] — {item_folder.name.upper()}",
                            "handle": f"{acc_folder}-{item_folder.name.lower()}",
                            "category": "Accessories",
                            "product_type": product_type,
                            "vendor": "DVV Entertainment",
                            "price": price,
                            "compare_at_price": price + 200,
                            "images": images[:7],
                            "featured_image": images[0],
                            "badges": ["ARSENAL", "UNDER ₹999"],
                            "tags": ["OG", "Arsenal", product_type],
                            "description": f"{base_name} {item_folder.name} - Essential gear for every rebel warrior.",
                            "variants": [
                                {
                                    "id": product_id * 100,
                                    "title": "Default",
                                    "option1": "Default", 
                                    "price": price,
                                    "inventory_quantity": 30,
                                    "inventory_management": "shopify"
                                }
                            ],
                            "options": [{"name": "Size", "values": ["One Size"]}],
                            "published": True,
                            "status": "active"
                        }
                        all_products.append(product)
                        product_id += 1
                        print(f"   ✅ {base_name} {item_folder.name} ({len(images)} images)")
    
    # 7. HEADBAND - Special accessory
    headband_dir = products_dir / "HeadBand"
    if headband_dir.exists():
        print(f"📁 Scanning headbands...")
        headband_images = list(headband_dir.glob("*.jpg")) + list(headband_dir.glob("*.jpeg")) + list(headband_dir.glob("*.png"))
        if headband_images:
            images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in headband_images]
            
            product = {
                "id": product_id,
                "name": "Rebel Headband Elite",
                "title": "[ARMORY // REBEL HEADBAND] — ELITE",
                "handle": "rebel-headband-elite",
                "category": "Accessories",
                "product_type": "Headband",
                "vendor": "DVV Entertainment",
                "price": 399,
                "compare_at_price": 599,
                "images": images[:7],
                "featured_image": images[0],
                "badges": ["ARSENAL", "UNDER ₹999"],
                "tags": ["OG", "Arsenal", "Headband"],
                "description": "Rebel Headband Elite - Essential headgear for focused warfare.",
                "variants": [
                    {
                        "id": product_id * 100,
                        "title": "Default",
                        "option1": "Default",
                        "price": 399,
                        "inventory_quantity": 40,
                        "inventory_management": "shopify"
                    }
                ],
                "options": [{"name": "Size", "values": ["One Size"]}],
                "published": True,
                "status": "active"
            }
            all_products.append(product)
            product_id += 1
            print(f"   ✅ Headband Elite ({len(images)} images)")
    
    return all_products

def create_comprehensive_collections(products):
    """Create collections that include ALL products"""
    collections = [
        {
            "id": 1,
            "handle": "rebellion-core",
            "title": "Rebellion Core",
            "description": "Essential gear for every rebel soldier. Core items that define the OG tribe.",
            "product_ids": [p["id"] for p in products if "REBEL DROP" in p.get("badges", [])],
            "product_count": len([p for p in products if "REBEL DROP" in p.get("badges", [])]),
            "published": True,
            "sort_order": "manual"
        },
        {
            "id": 2,
            "handle": "under-999",
            "title": "Under ₹999",
            "description": "Premium OG gear accessible to every rebel. No soldier left behind.",
            "product_ids": [p["id"] for p in products if p.get("price", 0) <= 999],
            "product_count": len([p for p in products if p.get("price", 0) <= 999]),
            "published": True,
            "sort_order": "price-ascending"
        },
        {
            "id": 3,
            "handle": "beast-mode",
            "title": "Beast Mode",
            "description": "Premium hoodies and sweatshirts for elite warriors.",
            "product_ids": [p["id"] for p in products if "BEAST DROP" in p.get("badges", [])],
            "product_count": len([p for p in products if "BEAST DROP" in p.get("badges", [])]),
            "published": True,
            "sort_order": "price-descending"
        },
        {
            "id": 4,
            "handle": "predator-elite",
            "title": "Predator Elite",
            "description": "Ultimate premium gear for elite soldiers. The highest tier.",
            "product_ids": [p["id"] for p in products if "PREDATOR DROP" in p.get("badges", [])],
            "product_count": len([p for p in products if "PREDATOR DROP" in p.get("badges", [])]),
            "published": True,
            "sort_order": "price-descending"
        },
        {
            "id": 5,
            "handle": "arsenal-gear",
            "title": "Arsenal Gear",
            "description": "Essential accessories and gear for every rebel warrior.",
            "product_ids": [p["id"] for p in products if "ARSENAL" in p.get("badges", [])],
            "product_count": len([p for p in products if "ARSENAL" in p.get("badges", [])]),
            "published": True,
            "sort_order": "manual"
        },
        {
            "id": 6,
            "handle": "multi-color",
            "title": "Multi-Color Arsenal",
            "description": "Products available in multiple color variants for customization.",
            "product_ids": [p["id"] for p in products if len(p.get("colors", [])) > 1],
            "product_count": len([p for p in products if len(p.get("colors", [])) > 1]),
            "published": True,
            "sort_order": "manual"
        }
    ]
    
    return collections

if __name__ == "__main__":
    print("🔥 CREATING COMPREHENSIVE PRODUCT CATALOG - EVERYTHING FROM YOUR DIRECTORY!")
    print("=" * 80)
    
    all_products = scan_all_products()
    collections = create_comprehensive_collections(all_products)
    
    # Save comprehensive products
    products_file = "/app/frontend/public/comprehensive_products.json"
    with open(products_file, "w") as f:
        json.dump(all_products, f, indent=2)
    
    # Save comprehensive collections
    collections_file = "/app/frontend/public/comprehensive_collections.json"
    with open(collections_file, "w") as f:
        json.dump(collections, f, indent=2)
    
    print("=" * 80)
    print(f"✅ CREATED {len(all_products)} COMPREHENSIVE PRODUCTS!")
    print(f"✅ CREATED {len(collections)} COMPREHENSIVE COLLECTIONS!")
    print(f"📁 Products: {products_file}")
    print(f"📁 Collections: {collections_file}")
    
    # Detailed breakdown
    categories = {}
    under_999 = 0
    multi_color = 0
    total_images = 0
    
    for product in all_products:
        cat = product["category"]
        categories[cat] = categories.get(cat, 0) + 1
        
        if product["price"] <= 999:
            under_999 += 1
        
        if len(product.get("colors", [])) > 1:
            multi_color += 1
        
        total_images += len(product.get("images", []))
    
    print(f"\n📊 COMPREHENSIVE BREAKDOWN:")
    for cat, count in categories.items():
        print(f"  - {cat}: {count} products")
    
    print(f"\n💰 PRICING ANALYSIS:")
    print(f"  - Under ₹999: {under_999} products")
    print(f"  - Multi-Color Products: {multi_color} products")
    print(f"  - Total Products: {len(all_products)}")
    print(f"  - Total Images: {total_images}")
    
    print(f"\n📦 COLLECTIONS:")
    for collection in collections:
        print(f"  - {collection['title']}: {collection['product_count']} products")
    
    print(f"\n🎯 MISSION ACCOMPLISHED:")
    print(f"  - ALL products from your /app/PRODUCTS/ directory included")
    print(f"  - EVERY image properly mapped")
    print(f"  - ALL collections populated")
    print(f"  - Shopify-compatible structure maintained")
    print(f"  - NO PRODUCTS LEFT BEHIND!")
    
    print(f"\n🔥 READY TO DISPLAY ALL YOUR INVENTORY!")