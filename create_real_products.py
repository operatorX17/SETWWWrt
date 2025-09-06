#!/usr/bin/env python3
"""
Create Real OG Armory Products from Actual Assets
- Uses your 84 real product images
- Consolidates color variants
- Prioritizes back images
- Creates production-ready JSON
"""

import os
import json
from pathlib import Path

def create_real_products():
    products_dir = Path("/app/PRODUCTS")
    products = []
    product_id = 1000  # Start with high ID to avoid conflicts
    
    # 1. TEESHIRTS - Your main category with variants
    teeshirt_designs = {
        "Ocean Waves": {
            "colors": ["Blue", "black", "grey"],
            "price": 999,  # Under ₹999 for the rail
            "mood": "STORM"
        },
        "Abstract Geometry": {
            "colors": ["black", "blue"], 
            "price": 1199,
            "mood": "MONOLITH"
        },
        "City Skyline": {
            "colors": [],
            "price": 1199,
            "mood": "SHADOW"
        },
        "Minimalist Design": {
            "colors": [],
            "price": 899,  # Under ₹999
            "mood": "GHOST"
        },
        "Nature Photography": {
            "colors": [],
            "price": 1199,
            "mood": "STORM"
        },
        "Vintage Typography": {
            "colors": [],
            "price": 1299,
            "mood": "MONOLITH"
        },
        "Mountain Adventure": {
            "colors": [],
            "price": 1199,
            "mood": "STORM"
        },
        "Music Festival Vibes": {
            "colors": [],
            "price": 1299,
            "mood": "EMBER"
        },
        "Space Exploration": {
            "colors": [],
            "price": 1399,
            "mood": "SHADOW"
        },
        "Tropical Paradise": {
            "colors": [],
            "price": 1199,
            "mood": "EMBER"
        },
        "Urban Street Art": {
            "colors": [],
            "price": 1299,
            "mood": "SHADOW"
        },
        "Neon Lights": {
            "colors": [],
            "price": 1199,
            "mood": "EMBER"
        }
    }
    
    for design, config in teeshirt_designs.items():
        design_dir = products_dir / "teeshirt" / design
        if not design_dir.exists():
            continue
            
        images = []
        
        # Handle color variants
        if config["colors"]:
            for color in config["colors"]:
                color_dir = design_dir / color
                if color_dir.exists():
                    color_images = list(color_dir.glob("*.jpg")) + list(color_dir.glob("*.jpeg"))
                    images.extend([f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in color_images])
        
        # Handle front/back structure
        back_dir = design_dir / "back"
        front_dir = design_dir / "front"
        
        back_images = []
        front_images = []
        
        if back_dir.exists():
            back_imgs = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
            back_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in back_imgs]
        
        if front_dir.exists():
            front_imgs = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
            front_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in front_imgs]
        
        # PRIORITIZE BACK IMAGES FIRST!
        all_images = back_images + images + front_images
        
        # Remove duplicates while preserving order
        final_images = []
        seen = set()
        for img in all_images:
            if img not in seen:
                final_images.append(img)
                seen.add(img)
        
        if final_images:
            badges = ["REBEL DROP"]
            if config["price"] <= 999:
                badges.append("UNDER ₹999")
            if config["colors"]:
                badges.append("MULTI-COLOR")
            
            products.append({
                "id": product_id,
                "name": f"{design} Rebel Tee",
                "title": f"[ARMORY // REBEL TEE] — {design.upper()}",
                "category": "Teeshirt",
                "price": config["price"],
                "originalPrice": config["price"] + 300,
                "colors": config["colors"],
                "mood_code": config["mood"],
                "images": final_images[:7],  # Max 7 images
                "badges": badges,
                "description": f"{design} - Forged in {config['mood'].lower()} mode. Built for rebels. Back design prioritized.",
                "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                "stock": {"XS":5,"S":12,"M":18,"L":22,"XL":9,"XXL":4},
                "vendor": "DVV Entertainment"
            })
            product_id += 1
    
    # 2. HOODIES - Premium items
    hoodie_dir = products_dir / "hoodies"
    if hoodie_dir.exists():
        hoodie_products = []
        for hoodie_folder in hoodie_dir.iterdir():
            if hoodie_folder.is_dir():
                images = []
                
                # Check for back/front structure
                back_dir = hoodie_folder / "back"
                front_dir = hoodie_folder / "front"
                
                back_images = []
                front_images = []
                direct_images = []
                
                if back_dir.exists():
                    back_imgs = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
                    back_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in back_imgs]
                
                if front_dir.exists():
                    front_imgs = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    front_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in front_imgs]
                
                # Direct images in folder
                direct_imgs = [f for f in hoodie_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                if direct_imgs:
                    direct_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in direct_imgs]
                
                # PRIORITIZE BACK IMAGES FIRST!
                all_images = back_images + direct_images + front_images
                
                if all_images:
                    hoodie_name = hoodie_folder.name.replace("product", "Beast Hoodie").replace("Product", "Predator Hoodie")
                    price = 2499 if "Predator" in hoodie_name else 1999
                    
                    products.append({
                        "id": product_id,
                        "name": hoodie_name,
                        "title": f"[ARMORY // {hoodie_name.upper()}] — SHADOW MODE",
                        "category": "Hoodies",
                        "price": price,
                        "originalPrice": price + 500,
                        "mood_code": "SHADOW",
                        "images": all_images[:7],
                        "badges": ["PREDATOR DROP"] if price > 2000 else ["BEAST DROP"],
                        "description": f"{hoodie_name} - Forged in shadow mode. Built for stealth warfare. Back design prioritized.",
                        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                        "stock": {"XS":3,"S":7,"M":12,"L":15,"XL":8,"XXL":3},
                        "vendor": "DVV Entertainment"
                    })
                    product_id += 1
    
    # 3. ACCESSORIES - Hats, Wallet, Slippers
    accessories = [
        ("hats", "Rebel Cap", 799, "EMBER"),
        ("wallet", "Battle Wallet", 899, "SHADOW"), 
        ("slippers", "Warrior Slides", 799, "GHOST")
    ]
    
    for folder_name, product_name, price, mood in accessories:
        acc_dir = products_dir / folder_name
        if acc_dir.exists():
            for acc_folder in acc_dir.iterdir():
                if acc_folder.is_dir():
                    images = []
                    
                    # Check for back/front structure
                    back_dir = acc_folder / "back"
                    front_dir = acc_folder / "front"
                    
                    back_images = []
                    front_images = []
                    direct_images = []
                    
                    if back_dir.exists():
                        back_imgs = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
                        back_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in back_imgs]
                    
                    if front_dir.exists():
                        front_imgs = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                        front_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in front_imgs]
                    
                    # Direct images
                    direct_imgs = [f for f in acc_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png']]
                    if direct_imgs:
                        direct_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in direct_imgs]
                    
                    # PRIORITIZE BACK IMAGES FIRST!
                    all_images = back_images + direct_images + front_images
                    
                    if all_images:
                        badges = ["ARSENAL"]
                        if price <= 999:
                            badges.append("UNDER ₹999")
                        
                        products.append({
                            "id": product_id,
                            "name": f"{product_name} {acc_folder.name[-1]}",
                            "title": f"[ARMORY // {product_name.upper()}] — {mood} MODE",
                            "category": "Accessories",
                            "price": price,
                            "originalPrice": price + 200,
                            "mood_code": mood,
                            "images": all_images[:7],
                            "badges": badges,
                            "description": f"{product_name} - Forged in {mood.lower()} mode. Essential gear for rebels.",
                            "sizes": ["ONE SIZE"] if folder_name in ["hats", "wallet"] else ["6", "7", "8", "9", "10", "11"],
                            "stock": {"ONE_SIZE": 25} if folder_name in ["hats", "wallet"] else {"6":5,"7":8,"8":12,"9":15,"10":12,"11":8},
                            "vendor": "DVV Entertainment"
                        })
                        product_id += 1
    
    # 4. POSTERS - War Posters
    poster_dir = products_dir / "posters"
    if poster_dir.exists():
        for poster_folder in poster_dir.iterdir():
            if poster_folder.is_dir():
                poster_images = list(poster_folder.glob("*.jpg")) + list(poster_folder.glob("*.jpeg"))
                if poster_images:
                    images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in poster_images]
                    
                    products.append({
                        "id": product_id,
                        "name": f"War Poster {poster_folder.name[-1]}",
                        "title": f"[ARMORY // WAR POSTER] — BATTLEFIELD {poster_folder.name[-1]}",
                        "category": "Posters",
                        "price": 599,
                        "originalPrice": 799,
                        "mood_code": "MONOLITH",
                        "images": images[:7],
                        "badges": ["ARSENAL", "UNDER ₹999"],
                        "description": f"War Poster {poster_folder.name[-1]} - Battlefield visual arsenal. A2 ready for combat.",
                        "sizes": ["A2"],
                        "stock": {"A2": 30},
                        "vendor": "DVV Entertainment"
                    })
                    product_id += 1
    
    # 5. FULL SHIRTS - Formal Arsenal
    shirts_dir = products_dir / "full shirts"
    if shirts_dir.exists():
        for shirt_folder in shirts_dir.iterdir():
            if shirt_folder.is_dir():
                # Check front folder
                front_dir = shirt_folder / "front"
                if front_dir.exists():
                    shirt_images = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    if shirt_images:
                        images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in shirt_images]
                        
                        products.append({
                            "id": product_id,
                            "name": f"Formal Arsenal {shirt_folder.name[-1]}",
                            "title": f"[ARMORY // FORMAL] — STEALTH SHIRT {shirt_folder.name[-1]}",
                            "category": "Full Shirts",
                            "price": 1899,
                            "originalPrice": 2299,
                            "mood_code": "SHADOW",
                            "images": images[:7],
                            "badges": ["FORMAL ARSENAL"],
                            "description": f"Formal Arsenal {shirt_folder.name[-1]} - Stealth mode for corporate warfare.",
                            "sizes": ["S", "M", "L", "XL", "XXL"],
                            "stock": {"S":8,"M":15,"L":18,"XL":10,"XXL":4},
                            "vendor": "DVV Entertainment"
                        })
                        product_id += 1
    
    # 6. SWEATSHIRTS - Beast Mode
    sweat_dir = products_dir / "Sweatshirts"
    if sweat_dir.exists():
        for sweat_folder in sweat_dir.iterdir():
            if sweat_folder.is_dir():
                images = []
                
                # Check for back/front structure
                back_dir = sweat_folder / "back"
                front_dir = sweat_folder / "front"
                
                back_images = []
                front_images = []
                
                if back_dir.exists():
                    back_imgs = list(back_dir.glob("*.jpg")) + list(back_dir.glob("*.jpeg"))
                    back_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in back_imgs]
                
                if front_dir.exists():
                    front_imgs = list(front_dir.glob("*.jpg")) + list(front_dir.glob("*.jpeg"))
                    front_images = [f"https://ogshop.preview.emergentagent.com/products/{img.relative_to(products_dir)}" for img in front_imgs]
                
                # PRIORITIZE BACK IMAGES FIRST!
                all_images = back_images + front_images
                
                if all_images:
                    products.append({
                        "id": product_id,
                        "name": f"Beast Sweatshirt {sweat_folder.name[-1]}",
                        "title": f"[ARMORY // BEAST SWEATSHIRT] — EMBER {sweat_folder.name[-1]}",
                        "category": "Sweatshirts",
                        "price": 1699,
                        "originalPrice": 1999,
                        "mood_code": "EMBER",
                        "images": all_images[:7],
                        "badges": ["BEAST DROP"],
                        "description": f"Beast Sweatshirt {sweat_folder.name[-1]} - Ember mode comfort for warriors.",
                        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                        "stock": {"XS":4,"S":9,"M":14,"L":18,"XL":7,"XXL":3},
                        "vendor": "DVV Entertainment"
                    })
                    product_id += 1
    
    return products

if __name__ == "__main__":
    print("🔥 Creating Real OG Armory Products from Your Assets...")
    products = create_real_products()
    
    # Save to frontend public directory
    output_file = "/app/frontend/public/real_products.json"
    with open(output_file, "w") as f:
        json.dump(products, f, indent=2)
    
    print(f"✅ Created {len(products)} real products!")
    print(f"📁 Saved to: {output_file}")
    
    # Print summary
    categories = {}
    under_999 = 0
    for product in products:
        cat = product["category"]
        if cat not in categories:
            categories[cat] = 0
        categories[cat] += 1
        
        if product["price"] <= 999:
            under_999 += 1
    
    print(f"\n📊 PRODUCT BREAKDOWN:")
    for cat, count in categories.items():
        print(f"  - {cat}: {count} products")
    
    print(f"\n💰 PRICING:")
    print(f"  - Under ₹999: {under_999} products")
    print(f"  - Total Products: {len(products)}")
    print(f"\n🎨 BACK IMAGES PRIORITIZED IN ALL PRODUCTS!")
    print(f"🎯 COLOR VARIANTS CONSOLIDATED!")
    print(f"🔥 READY FOR RAILS SYSTEM!")