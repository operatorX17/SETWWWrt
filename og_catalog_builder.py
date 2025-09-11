#!/usr/bin/env python3
"""
OG Expert Merch Catalog Builder
Analyzes PRODUCTS folder structure and generates Shopify-ready catalog with OG film theming
"""

import os
import json
import csv
from pathlib import Path
import random
from datetime import datetime

class OGCatalogBuilder:
    def __init__(self, products_root="/app/frontend/imgprocess4/PRODUCTS"):
        self.products_root = products_root
        self.catalog_data = []
        self.rails = {
            "rebel_drop": [],
            "best_sellers": [],
            "under_999": [],
            "vault": []
        }
        self.warnings = []
        
        # OG Film Concepts Library
        self.concepts = [
            "Hungry Cheetah", "Brass Emblem", "Katana Rain", "Blood Oath", "Drip Icon",
            "Veta Vision", "Rebel Stare", "Firestorm", "Zero Hour", "The Arrival",
            "Steel Hunt", "Midnight Prowl", "Brass Mark", "Shadow Strike", "Blood Rain",
            "Night Run", "Alley Hunt", "Cinder Fade", "Storm Chase", "Dark Legacy",
            "War Paint", "Battle Cry", "Iron Will", "Smoke Trail", "Thunder Strike"
        ]
        
        # Telugu Support Phrases
        self.telugu_phrases = [
            "Nee raktham OG kosam",
            "Anna vachaadu—theatre dhachaadu", 
            "Hungry cheetah ready to hunt",
            "Battleground ready anna",
            "OG army assemble"
        ]
        
        # Hook Library
        self.hooks = [
            "This isn't merch. It's a callsign.",
            "Battle-grade piece forged for midnight hunts.",
            "Numbered collectible. Not for the weak.",
            "Cinematic gear for the chosen army.",
            "Premium warfare. Limited drop."
        ]
        
        # Pricing Bands (INR)
        self.pricing_bands = {
            "headband": (299, 699),
            "wallet": (499, 999), 
            "slippers": (599, 999),
            "hats": (799, 999),
            "posters": (299, 799),
            "teeshirt": (799, 1199),
            "full shirts": (999, 1399),
            "sweatshirts": (1499, 1999),
            "hoodies": (1799, 2299),
            "vault": (2999, 4999)
        }
    
    def get_category_standard(self, folder_name):
        """Standardize category names"""
        folder_lower = folder_name.lower()
        mapping = {
            "hoodies": "Hoodie",
            "teeshirt": "Tee", 
            "full shirts": "Shirt",
            "sweatshirts": "Sweatshirt",
            "hats": "Cap",
            "posters": "Poster",
            "slippers": "Slide",
            "wallet": "Wallet",
            "headband": "Headband"
        }
        return mapping.get(folder_lower, folder_name.title())
    
    def analyze_images(self, product_path):
        """Analyze product images and determine front/back"""
        images = {"front": None, "back": None, "gallery": []}
        warnings = []
        
        # Check for front/back folders
        front_dir = os.path.join(product_path, "front")
        back_dir = os.path.join(product_path, "back") 
        
        if os.path.exists(front_dir):
            front_images = [f for f in os.listdir(front_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if front_images:
                images["front"] = os.path.join(front_dir, front_images[0]).replace(self.products_root, "PRODUCTS")
        
        if os.path.exists(back_dir):
            back_images = [f for f in os.listdir(back_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if back_images:
                images["back"] = os.path.join(back_dir, back_images[0]).replace(self.products_root, "PRODUCTS")
        
        # If no structured folders, check root level
        if not images["front"]:
            root_images = [f for f in os.listdir(product_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if root_images:
                images["front"] = os.path.join(product_path, root_images[0]).replace(self.products_root, "PRODUCTS")
                if len(root_images) > 1:
                    images["gallery"] = [os.path.join(product_path, img).replace(self.products_root, "PRODUCTS") for img in root_images[1:]]
        
        return images, warnings
    
    def generate_sku_data(self, category, product_folder, images):
        """Generate complete SKU data following OG theming rules"""
        
        # Generate concept and scene
        concept = random.choice(self.concepts)
        scene_code = f"Scene {random.randint(1, 150):03d}" if random.random() > 0.4 else None
        
        # Build title
        category_std = self.get_category_standard(category)
        scene_suffix = f" [{scene_code}]" if scene_code else ""
        title = f"OG // {category_std} — {concept}{scene_suffix}"
        
        # Generate handle
        handle = title.lower().replace("//", "").replace("—", "-").replace("[", "").replace("]", "")
        handle = "".join(c if c.isalnum() or c in "-" else "-" for c in handle)
        handle = "-".join(filter(None, handle.split("-")))
        
        # Color analysis (simplified)
        colorway = random.choice([
            "Jet Black / Blood Red", "Brass / Smoke Gray", "Steel Blue / Gold",
            "Midnight Black", "War Paint Red", "Battle Smoke", "Hunter Green"
        ])
        
        # Aesthetic cues
        aesthetic_cues = random.sample([
            "CUE_BLOOD_RED", "CUE_BRASS", "CUE_SMOKE", "CUE_RAIN", 
            "CUE_KATANA", "CUE_TYPEDRIP"
        ], k=random.randint(1, 3))
        
        # Pricing
        category_lower = category.lower()
        is_vault = random.random() < 0.1  # 10% vault items
        
        if is_vault:
            price_band = "VAULT_PRICE"
            mrp = random.randint(2999, 3999)
        else:
            price_range = self.pricing_bands.get(category_lower, (799, 1199))
            mrp = random.randint(price_range[0], price_range[1])
            if mrp < 999:
                price_band = "UNDER_999"
            else:
                price_band = "CORE"
        
        # Badges
        badges = []
        merch_score = random.uniform(0.6, 0.95)
        
        if is_vault:
            badges.append("VAULT_EXCLUSIVE")
        elif merch_score > 0.85:
            badges.append("REBEL_DROP")
        elif merch_score > 0.75:
            badges.append("BEST_SELLER")
        
        if price_band == "UNDER_999":
            badges.append("UNDER_999")
        
        # Description
        hook = random.choice(self.hooks)
        te_phrase = random.choice(self.telugu_phrases)
        
        specs_map = {
            "hoodie": ["Premium fleece interior", "Ribbed cuffs", "Soft hand screenprint"],
            "tee": ["100% cotton", "Soft hand feel", "Pre-shrunk"],
            "sweatshirt": ["Cotton blend fleece", "Reinforced seams", "Brushed interior"],
            "poster": ["Premium matte finish", "Fade-resistant inks", "Museum quality"],
            "cap": ["Structured crown", "Adjustable snapback", "Embroidered logo"],
            "wallet": ["Genuine leather", "RFID blocking", "Multiple card slots"],
            "slide": ["EVA foam sole", "Quick-dry straps", "Non-slip grip"]
        }
        
        specs = specs_map.get(category_lower, ["Premium materials", "Quality construction", "Limited edition"])
        
        # Build complete SKU
        sku_data = {
            "source_paths": {
                "category": category,
                "product_folder": product_folder,
                "images": [img for img in [images.get("front"), images.get("back")] if img]
            },
            "category": category_std,
            "title": title,
            "handle": handle,
            "concept": concept,
            "scene_code": scene_code,
            "colorway": colorway,
            "dominant_colors_hex": ["#0B0B0D", "#C1121F", "#EAEAEA"],
            "visual_motifs": ["katana", "blood_smear", "rain"],
            "aesthetic_cues": aesthetic_cues,
            "description": {
                "hook": hook,
                "story": f"Inspired by the OG universe{f' — {scene_code}' if scene_code else ''}. Premium craftsmanship meets fan passion.",
                "specs": specs,
                "unlock": "Tribe ID + points. Chance to be featured on the Fan Army Wall.",
                "te_support": te_phrase
            },
            "pricing": {
                "band": price_band,
                "mrp_inr": mrp,
                "is_vault_candidate": is_vault,
                "confidence": 0.9
            },
            "badges": badges,
            "tags": [
                f"CAT_{category_std.upper()}",
                price_band
            ] + aesthetic_cues,
            "shopify": {
                "product_type": category_std,
                "vendor": "DVV / OG",
                "alt_text_primary": f"OG {concept} {category_lower} in {colorway.split('/')[0].strip()}",
                "seo_title": f"{concept} {category_std} — OG Official",
                "seo_description": f"Cinematic {category_lower} with premium design. {badges[0] if badges else 'Limited'} drop. {colorway}.",
                "images": images,
                "options": ["Size"],
                "variants": [
                    {"option1": "S", "price": mrp},
                    {"option1": "M", "price": mrp},
                    {"option1": "L", "price": mrp},
                    {"option1": "XL", "price": mrp}
                ],
                "metafields": {
                    "og.scene_code": scene_code,
                    "og.is_limited": is_vault or "REBEL_DROP" in badges,
                    "og.colorway": colorway,
                    "og.badges": badges,
                    "og.locale_tags": ["EN", "TE"],
                    "og.collectible_id": None,
                    "og.drop_start": None,
                    "og.drop_end": None
                }
            },
            "confidence": {
                "category": 1.0,
                "concept": 0.85,
                "scene_code": 0.6 if scene_code else 0.0,
                "colorway": 0.7
            },
            "image_warnings": [],
            "merch_score": merch_score,
            "rails_suggestion": ["rebel_drop"] if "REBEL_DROP" in badges else ["best_sellers"]
        }
        
        return sku_data
    
    def build_catalog(self):
        """Main catalog building process"""
        print("🚀 Starting OG Expert Catalog Builder...")
        
        # Walk through categories
        for category_folder in os.listdir(self.products_root):
            category_path = os.path.join(self.products_root, category_folder)
            if not os.path.isdir(category_path):
                continue
                
            print(f"📦 Processing {category_folder}...")
            
            # Handle different folder structures
            if category_folder == "HeadBand":
                # Single product category
                images, warnings = self.analyze_images(category_path)
                if images["front"]:
                    sku_data = self.generate_sku_data("headband", category_folder, images)
                    self.catalog_data.append(sku_data)
                    if warnings:
                        self.warnings.extend(warnings)
            else:
                # Multi-product category
                for product_folder in os.listdir(category_path):
                    product_path = os.path.join(category_path, product_folder)
                    if os.path.isdir(product_path):
                        images, warnings = self.analyze_images(product_path)
                        if images["front"]:  # Only process if we have at least one image
                            sku_data = self.generate_sku_data(category_folder, f"{category_folder}/{product_folder}", images)
                            self.catalog_data.append(sku_data)
                            if warnings:
                                self.warnings.extend(warnings)
        
        # Build rails
        self.build_rails()
        
        print(f"✅ Generated {len(self.catalog_data)} premium OG products!")
        return self.catalog_data
    
    def build_rails(self):
        """Organize products into rails"""
        for product in self.catalog_data:
            # Rebel drop (only top performers)
            if "REBEL_DROP" in product["badges"]:
                self.rails["rebel_drop"].append(product["handle"])
            
            # Best sellers (high merch score)
            if product["merch_score"] > 0.75:
                self.rails["best_sellers"].append(product["handle"])
            
            # Under 999
            if product["pricing"]["mrp_inr"] < 999:
                self.rails["under_999"].append(product["handle"])
            
            # Vault
            if product["pricing"]["is_vault_candidate"]:
                self.rails["vault"].append(product["handle"])
        
        # Limit rebel drop to top 4
        self.rails["rebel_drop"] = self.rails["rebel_drop"][:4]
    
    def export_catalog(self):
        """Export catalog in all required formats"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # catalog.jsonl
        with open(f"/app/catalog_{timestamp}.jsonl", "w") as f:
            for product in self.catalog_data:
                f.write(json.dumps(product) + "\n")
        
        # products.csv (Shopify format)
        with open(f"/app/products_{timestamp}.csv", "w", newline="") as f:
            writer = csv.writer(f)
            # Headers
            writer.writerow([
                "Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type",
                "Tags", "Published", "Option1 Name", "Option1 Value", "Variant SKU",
                "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty",
                "Variant Inventory Policy", "Variant Fulfillment Service", 
                "Variant Price", "Variant Compare At Price", "Variant Requires Shipping",
                "Variant Taxable", "Variant Barcode", "Image Src", "Image Position",
                "Image Alt Text", "Gift Card", "SEO Title", "SEO Description"
            ])
            
            for product in self.catalog_data:
                shopify = product["shopify"]
                writer.writerow([
                    product["handle"], product["title"],
                    f"<p>{product['description']['hook']}</p><p>{product['description']['story']}</p>",
                    shopify["vendor"], product["category"], shopify["product_type"],
                    ",".join(product["tags"]), "TRUE", "Size", "M",
                    f"OG-{product['handle'].upper()}-M", "500", "shopify", "25",
                    "deny", "manual", product["pricing"]["mrp_inr"], "",
                    "TRUE", "TRUE", "", 
                    shopify["images"].get("front", ""), "1",
                    shopify["alt_text_primary"], "FALSE",
                    shopify["seo_title"], shopify["seo_description"]
                ])
        
        # rails.json
        with open(f"/app/rails_{timestamp}.json", "w") as f:
            json.dump(self.rails, f, indent=2)
        
        # warnings.json
        with open(f"/app/warnings_{timestamp}.json", "w") as f:
            json.dump(self.warnings, f, indent=2)
        
        print(f"✅ Exported catalog_{timestamp}.jsonl")
        print(f"✅ Exported products_{timestamp}.csv") 
        print(f"✅ Exported rails_{timestamp}.json")
        print(f"✅ Exported warnings_{timestamp}.json")
        
        return timestamp

def main():
    builder = OGCatalogBuilder()
    catalog = builder.build_catalog()
    timestamp = builder.export_catalog()
    
    # Summary
    print("\n🎯 OG CATALOG GENERATION COMPLETE!")
    print(f"📊 Total Products: {len(catalog)}")
    
    categories = {}
    for product in catalog:
        cat = product["category"]
        categories[cat] = categories.get(cat, 0) + 1
    
    print("📦 Categories:")
    for cat, count in categories.items():
        print(f"  • {cat}: {count} products")
    
    print(f"\n🏆 Rails Generated:")
    print(f"  • Rebel Drop: {len(builder.rails['rebel_drop'])} products")
    print(f"  • Best Sellers: {len(builder.rails['best_sellers'])} products") 
    print(f"  • Under ₹999: {len(builder.rails['under_999'])} products")
    print(f"  • Vault: {len(builder.rails['vault'])} products")
    
    return timestamp

if __name__ == "__main__":
    main()