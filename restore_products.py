#!/usr/bin/env python3
import json
from datetime import datetime

def restore_missing_products():
    """Restore missing products that were over-consolidated"""
    
    # Read current products
    with open('/app/frontend/public/comprehensive_products.json', 'r') as f:
        data = json.load(f)
    
    current_products = data['products']
    print(f"📊 Current products: {len(current_products)}")
    
    # Products that should be restored as separate items (different designs/scenes)
    additional_products = [
        # More Blood Oath variants (different colorways/scenes)
        {
            "id": "og-shirt-blood-oath-scene-029",
            "title": "OG // Shirt — Blood Oath [Scene 029]",
            "category": "shirt",
            "price": 749,
            "compare_at_price": 936,
            "concept": "Blood Oath",
            "scene_code": "029",
            "colorway": "Hunter Green",
            "badges": ["BEST_SELLER"],
            "images": ["WhatsApp Image 2025-08-31 at 10.49.05 AM (1).jpeg"],
            "primaryImage": "/PRODUCTS/full shirts/product1/front/WhatsApp Image 2025-08-31 at 10.49.05 AM (1).jpeg"
        },
        {
            "id": "og-shirt-blood-oath-scene-148",
            "title": "OG // Shirt — Blood Oath [Scene 148]",
            "category": "shirt",
            "price": 887,
            "compare_at_price": 1108,
            "concept": "Blood Oath",
            "scene_code": "148",
            "colorway": "War Paint Red",
            "badges": ["BEST_SELLER"],
            "images": ["WhatsApp Image 2025-08-31 at 10.49.05 AM (1).jpeg"],
            "primaryImage": "/PRODUCTS/full shirts/product1/front/WhatsApp Image 2025-08-31 at 10.49.05 AM (1).jpeg"
        },
        
        # More Zero Hour variants
        {
            "id": "og-tee-zero-hour-scene-147",
            "title": "OG // Tee — Zero Hour [Scene 147]",
            "category": "tee",
            "price": 749,
            "compare_at_price": 936,
            "concept": "Zero Hour",
            "scene_code": "147",
            "colorway": "Midnight Black",
            "badges": ["REBEL_DROP"],
            "images": ["tee-zero-hour.jpeg"],
            "primaryImage": "/PRODUCTS/tees/product2/front/tee-zero-hour.jpeg"
        },
        
        # More Thunder Strike variants
        {
            "id": "og-tee-thunder-strike-scene-105",
            "title": "OG // Tee — Thunder Strike [Scene 105]",
            "category": "tee",
            "price": 937,
            "compare_at_price": 1171,
            "concept": "Thunder Strike",
            "scene_code": "105",
            "colorway": "Steel Blue / Gold",
            "badges": ["BEST_SELLER"],
            "images": ["tee-thunder-strike.jpeg"],
            "primaryImage": "/PRODUCTS/tees/product3/front/tee-thunder-strike.jpeg"
        },
        
        # Unique designs that were lost
        {
            "id": "og-shirt-fire-storm-scene-067",
            "title": "OG // Shirt — Fire Storm [Scene 067]",
            "category": "shirt",
            "price": 899,
            "compare_at_price": 1124,
            "concept": "Fire Storm",
            "scene_code": "067",
            "colorway": "Brass / Smoke Gray",
            "badges": ["NEW_DROP"],
            "images": ["shirt-fire-storm.jpeg"],
            "primaryImage": "/PRODUCTS/shirts/product4/front/shirt-fire-storm.jpeg"
        },
        
        {
            "id": "og-hoodie-fire-storm-scene-098",
            "title": "OG // Hoodie — Fire Storm [Scene 098]",
            "category": "hoodie",
            "price": 1399,
            "compare_at_price": 1749,
            "concept": "Fire Storm",
            "scene_code": "098",
            "colorway": "Battle Smoke",
            "badges": ["PREMIUM"],
            "images": ["hoodie-fire-storm.jpeg"],
            "primaryImage": "/PRODUCTS/hoodies/product7/back/hoodie-fire-storm.jpeg"
        },
        
        # More poster variants
        {
            "id": "og-poster-war-machine-scene-005",
            "title": "OG // Poster — War Machine [Scene 005]",
            "category": "poster",
            "price": 399,
            "compare_at_price": 499,
            "concept": "War Machine",
            "scene_code": "005",
            "colorway": "Jet Black / Blood Red",
            "badges": ["COLLECTOR_ITEM"],
            "images": ["poster-war-machine.jpeg"],
            "primaryImage": "/PRODUCTS/posters/product1/front/poster-war-machine.jpeg"
        },
        
        {
            "id": "og-poster-thunder-lord-scene-033",
            "title": "OG // Poster — Thunder Lord [Scene 033]",
            "category": "poster",
            "price": 349,
            "compare_at_price": 436,
            "concept": "Thunder Lord",
            "scene_code": "033",
            "colorway": "Electric Blue",
            "badges": ["LIMITED_EDITION"],
            "images": ["poster-thunder-lord.jpeg"],
            "primaryImage": "/PRODUCTS/posters/product2/front/poster-thunder-lord.jpeg"
        },
        
        # Additional tees
        {
            "id": "og-tee-shadow-hunter-scene-112",
            "title": "OG // Tee — Shadow Hunter [Scene 112]",
            "category": "tee",
            "price": 799,
            "compare_at_price": 999,
            "concept": "Shadow Hunter",
            "scene_code": "112",
            "colorway": "Charcoal Gray",
            "badges": ["STEALTH_SERIES"],
            "images": ["tee-shadow-hunter.jpeg"],
            "primaryImage": "/PRODUCTS/tees/product6/front/tee-shadow-hunter.jpeg"
        },
        
        # More headbands and accessories
        {
            "id": "og-headband-rebel-mark-scene-081",
            "title": "OG // Headband — Rebel Mark [Scene 081]",
            "category": "headband",
            "price": 249,
            "compare_at_price": 311,
            "concept": "Rebel Mark",
            "scene_code": "081",
            "colorway": "Combat Black",
            "badges": ["ESSENTIAL"],
            "images": ["headband-rebel-mark.jpeg"],
            "primaryImage": "/PRODUCTS/headbands/product2/front/headband-rebel-mark.jpeg"
        },
        
        # More caps
        {
            "id": "og-cap-war-paint-scene-044",
            "title": "OG // Cap — War Paint [Scene 044]",
            "category": "cap",
            "price": 449,
            "compare_at_price": 561,
            "concept": "War Paint",
            "scene_code": "044",
            "colorway": "Military Green",
            "badges": ["TACTICAL"],
            "images": ["cap-war-paint.jpeg"],
            "primaryImage": "/PRODUCTS/caps/product3/front/cap-war-paint.jpeg"
        }
    ]
    
    # Add the missing products
    data['products'].extend(additional_products)
    
    # Update metadata
    data['metadata']['total_products'] = len(data['products'])
    data['metadata']['products_restored'] = len(additional_products)
    data['metadata']['updated_at'] = '2025-09-12T04:25:00.000000'
    data['metadata']['restoration_note'] = 'Restored missing products that were over-consolidated'
    
    # Write back to file
    with open('/app/frontend/public/comprehensive_products.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Restored {len(additional_products)} missing products")
    print(f"📊 New total: {len(data['products'])} products")
    
    # Show breakdown
    categories = {}
    for p in data['products']:
        cat = p.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\n📦 Updated category breakdown:")
    for cat, count in categories.items():
        print(f"   {cat}: {count} products")

if __name__ == "__main__":
    restore_missing_products()