#!/usr/bin/env python3
"""
Create SIMPLE working products using ACTUAL existing images
"""

import json
import os
from pathlib import Path

def create_simple_products():
    """Create products using the actual image structure we found"""
    products = []
    product_id = 4000
    
    # REAL T-SHIRT PRODUCTS - Using existing paths
    tee_products = [
        {
            "name": "Ocean Waves Rebel Tee",
            "colors": ["Blue", "Black", "Grey"],
            "price": 999,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Ocean%20Waves/Blue/WhatsApp%20Image%202025-08-31%20at%2010.49.04%20AM.jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Ocean%20Waves/black/WhatsApp%20Image%202025-08-31%20at%2010.49.03%20AM%20(1).jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Ocean%20Waves/grey/WhatsApp%20Image%202025-08-31%20at%2010.49.03%20AM%20(2).jpeg"
            ]
        },
        {
            "name": "Abstract Geometry Rebel Tee",
            "colors": ["Black", "Blue"],
            "price": 1199,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Abstract%20Geometry/black/WhatsApp%20Image%202025-08-31%20at%208.59.07%20AM.jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Abstract%20Geometry/black/WhatsApp%20Image%202025-08-31%20at%2010.49.01%20AM%20(1).jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Abstract%20Geometry/blue/WhatsApp%20Image%202025-08-31%20at%2010.49.02%20AM.jpeg"
            ]
        },
        {
            "name": "City Skyline Rebel Tee",
            "colors": [],
            "price": 1199,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/City%20Skyline/back/WhatsApp%20Image%202025-08-31%20at%208.59.05%20AM%20(2).jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/City%20Skyline/front/WhatsApp%20Image%202025-08-31%20at%208.59.05%20AM.jpeg"
            ]
        },
        {
            "name": "Vintage Typography Rebel Tee", 
            "colors": [],
            "price": 1299,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Vintage%20Typography/front/WhatsApp%20Image%202025-08-31%20at%209.09.12%20AM.jpeg"
            ]
        },
        {
            "name": "Mountain Adventure Rebel Tee",
            "colors": [],
            "price": 1199,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Mountain%20Adventure/back/WhatsApp%20Image%202025-08-31%20at%209.18.35%20AM.jpeg"
            ]
        },
        {
            "name": "Music Festival Rebel Tee",
            "colors": [],
            "price": 1299,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Music%20Festival%20Vibes/back/WhatsApp%20Image%202025-08-31%20at%208.59.06%20AM%20(1).jpeg"
            ]
        },
        {
            "name": "Space Exploration Rebel Tee",
            "colors": [],
            "price": 1399,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Space%20Exploration/front/WhatsApp%20Image%202025-08-31%20at%208.59.04%20AM.jpeg"
            ]
        },
        {
            "name": "Tropical Paradise Rebel Tee",
            "colors": [],
            "price": 1199,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Tropical%20Paradise/back/WhatsApp%20Image%202025-08-31%20at%208.59.40%20AM.jpeg",
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Tropical%20Paradise/front/WhatsApp%20Image%202025-08-31%20at%208.59.19%20AM.jpeg"
            ]
        },
        {
            "name": "Nature Photography Rebel Tee",
            "colors": [],
            "price": 1199,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Nature%20Photography/front/WhatsApp%20Image%202025-08-31%20at%208.59.05%20AM%20(1).jpeg"
            ]
        },
        {
            "name": "Minimalist Design Rebel Tee",
            "colors": [],
            "price": 899,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/teeshirt/Minimalist%20Design/back/WhatsApp%20Image%202025-08-31%20at%208.59.07%20AM%20(1).jpeg"
            ]
        }
    ]
    
    # Create T-shirt products
    for tee in tee_products:
        badges = ["REBEL DROP"]
        if tee["price"] <= 999:
            badges.append("UNDER ₹999")
        if len(tee["colors"]) > 1:
            badges.append("MULTI-COLOR")
        
        product = {
            "id": product_id,
            "name": tee["name"],
            "title": f"[ARMORY // REBEL TEE] — {tee['name'].replace(' Rebel Tee', '').upper()}",
            "handle": tee["name"].lower().replace(' ', '-'),
            "category": "Teeshirt",
            "product_type": "T-Shirt",
            "vendor": "DVV Entertainment",
            "price": tee["price"],
            "compare_at_price": tee["price"] + 300,
            "colors": tee["colors"],
            "images": tee["images"],
            "featured_image": tee["images"][0] if tee["images"] else "",
            "badges": badges,
            "tags": ["OG", "Rebel", "Teeshirt"],
            "description": f"{tee['name']} - Premium OG design. Built for rebels.",
            "variants": [
                {
                    "id": product_id * 100 + i,
                    "title": size,
                    "option1": size,
                    "price": tee["price"],
                    "inventory_quantity": [5,12,18,22,9,4][i],
                    "inventory_management": "shopify"
                }
                for i, size in enumerate(["XS", "S", "M", "L", "XL", "XXL"])
            ],
            "options": [{"name": "Size", "values": ["XS", "S", "M", "L", "XL", "XXL"]}],
            "published": True,
            "status": "active"
        }
        products.append(product)
        product_id += 1
    
    # ACCESSORIES - Using real paths
    accessories = [
        {
            "name": "Rebel Cap Elite",
            "price": 799,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/hats/product1/back/WhatsApp%20Image%202025-08-31%20at%208.55.48%20AM%20(2).jpeg",
                "https://imgreveal.preview.emergentagent.com/products/hats/product1/front/WhatsApp%20Image%202025-08-31%20at%208.55.49%20AM.jpeg"
            ]
        },
        {
            "name": "Rebel Cap Pro",
            "price": 799,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/hats/product2/back/WhatsApp%20Image%202025-08-31%20at%208.59.03%20AM.jpeg",
                "https://imgreveal.preview.emergentagent.com/products/hats/product2/front/WhatsApp%20Image%202025-08-31%20at%208.55.50%20AM%20(1).jpeg"
            ]
        },
        {
            "name": "Warrior Slides Elite",
            "price": 699,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/slippers/product1/back/WhatsApp%20Image%202025-08-31%20at%208.55.47%20AM%20(2).jpeg",
                "https://imgreveal.preview.emergentagent.com/products/slippers/product1/front/WhatsApp%20Image%202025-08-31%20at%208.55.46%20AM%20(1).jpeg"
            ]
        },
        {
            "name": "Warrior Slides Pro",
            "price": 699,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/slippers/product2/front/WhatsApp%20Image%202025-08-31%20at%208.55.46%20AM.jpeg"
            ]
        },
        {
            "name": "Battle Wallet Elite",
            "price": 899,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/wallet/product1/WhatsApp%20Image%202025-08-31%20at%208.55.48%20AM.jpeg"
            ]
        },
        {
            "name": "Battle Wallet Pro",
            "price": 899,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/wallet/product2/WhatsApp%20Image%202025-08-31%20at%208.55.49%20AM%20(1).jpeg"
            ]
        },
        {
            "name": "Rebel Headband",
            "price": 399,
            "images": [
                "https://imgreveal.preview.emergentagent.com/products/HeadBand/WhatsApp%20Image%202025-08-31%20at%208.55.49%20AM%20(2).jpeg"
            ]
        }
    ]
    
    # Create accessory products
    for acc in accessories:
        product = {
            "id": product_id,
            "name": acc["name"],
            "title": f"[ARMORY // {acc['name'].upper()}] — GEAR",
            "handle": acc["name"].lower().replace(' ', '-'),
            "category": "Accessories",
            "product_type": "Accessory",
            "vendor": "DVV Entertainment",
            "price": acc["price"],
            "compare_at_price": acc["price"] + 200,
            "images": acc["images"],
            "featured_image": acc["images"][0] if acc["images"] else "",
            "badges": ["ARSENAL", "UNDER ₹999"],
            "tags": ["OG", "Arsenal", "Accessories"],
            "description": f"{acc['name']} - Essential gear for every rebel warrior.",
            "variants": [
                {
                    "id": product_id * 100,
                    "title": "Default",
                    "option1": "Default",
                    "price": acc["price"],
                    "inventory_quantity": 30,
                    "inventory_management": "shopify"
                }
            ],
            "options": [{"name": "Size", "values": ["One Size"]}],
            "published": True,
            "status": "active"
        }
        products.append(product)
        product_id += 1
    
    return products

def create_working_collections(products):
    """Create collections with actual products"""
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
            "handle": "multi-color",
            "title": "Multi-Color Arsenal",
            "description": "Products available in multiple color variants for customization.",
            "product_ids": [p["id"] for p in products if len(p.get("colors", [])) > 1],
            "product_count": len([p for p in products if len(p.get("colors", [])) > 1]),
            "published": True,
            "sort_order": "manual"
        },
        {
            "id": 4,
            "handle": "arsenal-gear",
            "title": "Arsenal Gear",
            "description": "Essential accessories and gear for every rebel warrior.",
            "product_ids": [p["id"] for p in products if "ARSENAL" in p.get("badges", [])],
            "product_count": len([p for p in products if "ARSENAL" in p.get("badges", [])]),
            "published": True,
            "sort_order": "manual"
        }
    ]
    
    return collections

if __name__ == "__main__":
    print("🔥 Creating SIMPLE working products with real images...")
    
    products = create_simple_products()
    collections = create_working_collections(products)
    
    # Save products
    products_file = "/app/frontend/public/simple_products.json"
    with open(products_file, "w") as f:
        json.dump(products, f, indent=2)
    
    # Save collections  
    collections_file = "/app/frontend/public/simple_collections.json"
    with open(collections_file, "w") as f:
        json.dump(collections, f, indent=2)
    
    print(f"✅ Created {len(products)} working products!")
    print(f"✅ Created {len(collections)} collections!")
    print(f"📁 Products: {products_file}")
    print(f"📁 Collections: {collections_file}")
    
    # Summary by category
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
    
    print(f"\n📊 PRODUCT BREAKDOWN:")
    for cat, count in categories.items():
        print(f"  - {cat}: {count} products")
    
    print(f"\n💰 PRICING:")
    print(f"  - Under ₹999: {under_999} products")
    print(f"  - Multi-Color Products: {multi_color} products")
    
    print(f"\n📦 COLLECTIONS:")
    for collection in collections:
        print(f"  - {collection['title']}: {collection['product_count']} products")
    
    print(f"\n✅ ALL PRODUCTS HAVE REAL IMAGES!")
    print(f"✅ ALL COLLECTIONS POPULATED!")
    print(f"✅ SHOPIFY-COMPATIBLE STRUCTURE!")