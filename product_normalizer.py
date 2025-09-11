#!/usr/bin/env python3
"""
OG Shopify Product Normalizer
Normalizes all products with proper naming, categorization, price bands, and tagging
"""

import json
import csv
import os
from datetime import datetime, timedelta
import random
from typing import Dict, List, Any

class OGProductNormalizer:
    def __init__(self):
        self.dry_run = True
        self.changes_log = []
        self.stats = {
            'total_products': 0,
            'products_added': 0,
            'products_modified': 0,
            'categories_created': 0,
            'price_adjustments': 0,
            'tags_applied': 0
        }
        
        # Price bands as specified
        self.price_bands = {
            'Bands': {'min': 299, 'max': 999},
            'Posters': {'min': 299, 'max': 999},
            'Caps': {'min': 299, 'max': 999},
            'Slides': {'min': 299, 'max': 999},
            'Tees': {'min': 799, 'max': 1199},
            'Sweatshirts': {'min': 1499, 'max': 1999},
            'Hoodies': {'min': 1799, 'max': 2299},
            'Vault': {'min': 2999, 'max': 4999}
        }
        
        # Category mappings
        self.category_tags = {
            'Hoodies': 'CAT_HOODIE',
            'Tees': 'CAT_TEE',
            'Tee Shirts': 'CAT_TEE',
            'Sweatshirts': 'CAT_SWEATSHIRT',
            'Caps': 'CAT_CAP',
            'Slides': 'CAT_SLIDES',
            'Bands': 'CAT_BAND',
            'Posters': 'CAT_POSTER',
            'Vault': 'CAT_VAULT'
        }
        
        # Scene codes for different themes
        self.scene_codes = {
            'Urban': 'URB',
            'Street': 'STR',
            'Beast': 'BST',
            'Shadow': 'SHD',
            'Storm': 'STM',
            'Fire': 'FIR',
            'Ocean': 'OCN',
            'Mountain': 'MTN',
            'Tactical': 'TAC',
            'Rebellion': 'RBL',
            'Predator': 'PRD',
            'Wolf': 'WLF',
            'Iron': 'IRN',
            'Crimson': 'CRM',
            'Vault': 'VLT'
        }

    def load_current_products(self) -> List[Dict]:
        """Load current products from comprehensive_products.json"""
        try:
            with open('frontend/public/comprehensive_products.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print("Warning: comprehensive_products.json not found, starting with empty list")
            return []

    def generate_missing_products(self) -> List[Dict]:
        """Generate missing product types: slides, hats, caps, bands, posters, sweatshirts"""
        missing_products = []
        
        # Slides
        slides = [
            {
                'name': 'REBEL STRIKE SLIDES',
                'concept': 'Rebel Strike',
                'scene': 'Urban',
                'category': 'Slides',
                'description': 'Strike with every step. Rebel comfort for street warriors.',
                'colors': ['Rebel Black', 'Strike Red'],
                'price': 699
            },
            {
                'name': 'SHADOW WALKER SLIDES',
                'concept': 'Shadow Walker',
                'scene': 'Street',
                'category': 'Slides',
                'description': 'Walk in shadows. Move without sound. Ghost protocol.',
                'colors': ['Shadow Black', 'Stealth Grey'],
                'price': 799
            },
            {
                'name': 'BEAST MODE SLIDES',
                'concept': 'Beast Mode',
                'scene': 'Beast',
                'category': 'Slides',
                'description': 'Unleash the beast. Comfort meets power.',
                'colors': ['Beast Black', 'Fury Red'],
                'price': 899
            }
        ]
        
        # Caps/Hats
        caps = [
            {
                'name': 'TACTICAL STRIKE CAP',
                'concept': 'Tactical Strike',
                'scene': 'Tactical',
                'category': 'Caps',
                'description': 'Precision headgear. Built for tactical advantage.',
                'colors': ['Tactical Black', 'Strike Green'],
                'price': 599
            },
            {
                'name': 'URBAN REBEL CAP',
                'concept': 'Urban Rebel',
                'scene': 'Urban',
                'category': 'Caps',
                'description': 'Urban rebellion starts here. Street-ready headgear.',
                'colors': ['Urban Black', 'Rebel Red'],
                'price': 699
            },
            {
                'name': 'SHADOW OPS CAP',
                'concept': 'Shadow Ops',
                'scene': 'Shadow',
                'category': 'Caps',
                'description': 'Stealth operations headgear. Move unseen.',
                'colors': ['Shadow Black', 'Ops Grey'],
                'price': 799
            }
        ]
        
        # Bands
        bands = [
            {
                'name': 'REBELLION CORE BAND',
                'concept': 'Rebellion Core',
                'scene': 'Rebellion',
                'category': 'Bands',
                'description': 'Core rebellion accessory. Show your allegiance.',
                'colors': ['Rebel Black', 'Core Red'],
                'price': 399
            },
            {
                'name': 'BEAST FURY BAND',
                'concept': 'Beast Fury',
                'scene': 'Beast',
                'category': 'Bands',
                'description': 'Channel the beast. Fury in every fiber.',
                'colors': ['Beast Black', 'Fury Orange'],
                'price': 499
            }
        ]
        
        # Posters
        posters = [
            {
                'name': 'REBELLION MANIFESTO POSTER',
                'concept': 'Rebellion Manifesto',
                'scene': 'Rebellion',
                'category': 'Posters',
                'description': 'The rebellion manifesto. Declare your allegiance.',
                'colors': ['Classic Print'],
                'price': 599
            },
            {
                'name': 'BEAST MODE ARTWORK POSTER',
                'concept': 'Beast Mode Artwork',
                'scene': 'Beast',
                'category': 'Posters',
                'description': 'Beast mode artwork. Unleash your space.',
                'colors': ['Premium Print'],
                'price': 799
            }
        ]
        
        # Sweatshirts
        sweatshirts = [
            {
                'name': 'URBAN WARRIOR SWEATSHIRT',
                'concept': 'Urban Warrior',
                'scene': 'Urban',
                'category': 'Sweatshirts',
                'description': 'Urban warfare comfort. Built for street battles.',
                'colors': ['Warrior Black', 'Urban Grey'],
                'price': 1699
            },
            {
                'name': 'STORM RIDER SWEATSHIRT',
                'concept': 'Storm Rider',
                'scene': 'Storm',
                'category': 'Sweatshirts',
                'description': 'Ride the storm. Weather any challenge.',
                'colors': ['Storm Grey', 'Thunder Black'],
                'price': 1799
            },
            {
                'name': 'SHADOW LEGION SWEATSHIRT',
                'concept': 'Shadow Legion',
                'scene': 'Shadow',
                'category': 'Sweatshirts',
                'description': 'Join the shadow legion. Elite comfort.',
                'colors': ['Legion Black', 'Shadow Grey'],
                'price': 1899
            }
        ]
        
        # Combine all missing products
        all_missing = slides + caps + bands + posters + sweatshirts
        
        # Generate full product objects
        for i, product_data in enumerate(all_missing, start=1000):
            product = self.create_product_object(i, product_data)
            missing_products.append(product)
            
        return missing_products

    def create_product_object(self, base_id: int, product_data: Dict) -> Dict:
        """Create a complete product object with all required fields"""
        category = product_data['category']
        concept = product_data['concept']
        scene = product_data['scene']
        
        # Generate OG naming convention: OG // <Category> — <Concept Name> [<Scene>]
        og_name = f"OG // {category} — {concept} [{scene}]"
        
        # Generate handle
        handle = concept.lower().replace(' ', '-')
        
        # Generate scene code
        scene_code = self.scene_codes.get(scene, 'GEN')
        
        # Generate SKU
        category_short = category[:3].upper()
        sku = f"OG-{category_short}-{base_id:03d}"
        
        # Determine stock level for scarcity tags
        stock = random.randint(5, 150)
        
        # Generate badges
        badges = [self.category_tags.get(category, 'CAT_GENERAL')]
        
        # Add scarcity badges
        if stock <= 5:
            badges.append('LAST_CALL')
        elif stock <= 15:
            badges.append('LOW_STOCK')
            
        # Add random additional badges
        additional_badges = ['NEW', 'BESTSELLER', 'LIMITED', 'PREMIUM']
        if random.random() > 0.7:
            badges.append(random.choice(additional_badges))
            
        # Generate sizes based on category
        if category in ['Slides']:
            sizes = ['7', '8', '9', '10', '11']
        elif category in ['Caps']:
            sizes = ['One Size']
        elif category in ['Bands']:
            sizes = ['S/M', 'L/XL']
        elif category in ['Posters']:
            sizes = ['A3', 'A2']
        else:
            sizes = ['S', 'M', 'L', 'XL']
            
        # Generate metafields
        metafields = {
            'og': {
                'rank': random.randint(1, 100),
                'scene_code': scene_code,
                'is_limited': random.random() > 0.8,
                'drop_start': None,
                'drop_end': None,
                'badges': badges,
                'colorway': product_data['colors'][0] if product_data['colors'] else 'Default',
                'size_chart': f"{category.lower()}_size_chart.jpg",
                'locale_tags': ['IN', 'EN'],
                'collectible_id': f"OG-{base_id:06d}"
            }
        }
        
        # Add drop dates for limited items
        if metafields['og']['is_limited']:
            drop_start = datetime.now() + timedelta(days=random.randint(1, 30))
            drop_end = drop_start + timedelta(days=random.randint(7, 21))
            metafields['og']['drop_start'] = drop_start.isoformat()
            metafields['og']['drop_end'] = drop_end.isoformat()
            badges.append('DROP')
            
        return {
            'id': f"og-{category.lower()}-{base_id:03d}",
            'handle': handle,
            'name': product_data['name'],
            'og_name': og_name,
            'category': category,
            'product_type': category,
            'price': product_data['price'],
            'originalPrice': int(product_data['price'] * 1.25),
            'images': [
                f"https://smart-store-sync.preview.emergentagent.com/products/{category.lower()}/{concept}/front/main.jpg",
                f"https://smart-store-sync.preview.emergentagent.com/products/{category.lower()}/{concept}/back/main.jpg"
            ],
            'primary_image_type': 'front',
            'badges': badges,
            'description': product_data['description'],
            'sizes': sizes,
            'colors': product_data['colors'],
            'vault_locked': False,
            'collection': 'OG COLLECTION',
            'material': self.get_material_by_category(category),
            'fit': 'Regular Fit' if category not in ['Caps', 'Bands', 'Posters'] else 'Standard',
            'weight': self.get_weight_by_category(category),
            'care': 'Machine wash cold' if category not in ['Posters'] else 'Handle with care',
            'sku': sku,
            'stock': stock,
            'metafields': metafields
        }

    def get_material_by_category(self, category: str) -> str:
        """Get appropriate material based on category"""
        materials = {
            'Hoodies': 'Premium Cotton Blend',
            'Sweatshirts': 'Cotton Fleece',
            'Tees': 'Premium Cotton',
            'Caps': 'Cotton Twill',
            'Slides': 'EVA Foam',
            'Bands': 'Silicone',
            'Posters': 'Premium Paper'
        }
        return materials.get(category, 'Premium Material')

    def get_weight_by_category(self, category: str) -> str:
        """Get appropriate weight based on category"""
        weights = {
            'Hoodies': '400 GSM',
            'Sweatshirts': '320 GSM',
            'Tees': '180 GSM',
            'Caps': '150 GSM',
            'Slides': '200g',
            'Bands': '50g',
            'Posters': '250 GSM'
        }
        return weights.get(category, '200 GSM')

    def normalize_existing_products(self, products: List[Dict]) -> List[Dict]:
        """Normalize existing products with new naming convention and structure"""
        normalized = []
        
        for product in products:
            # Create normalized copy
            normalized_product = product.copy()
            
            # Extract category and concept from existing name
            category = product.get('category', 'Unknown')
            if category == 'Tee Shirts':
                category = 'Tees'
            elif category == 'Vault':
                category = 'Vault'
                
            # Extract concept from name
            name = product.get('name', '')
            concept = name.replace('HOODIE', '').replace('TEE', '').strip()
            
            # Determine scene from concept
            scene = 'Urban'  # Default
            for scene_key in self.scene_codes.keys():
                if scene_key.upper() in name.upper():
                    scene = scene_key
                    break
                    
            # Generate OG name
            og_name = f"OG // {category} — {concept} [{scene}]"
            normalized_product['og_name'] = og_name
            normalized_product['product_type'] = category
            
            # Enforce price bands
            current_price = product.get('price', 0)
            if category in self.price_bands:
                band = self.price_bands[category]
                if current_price < band['min']:
                    normalized_product['price'] = band['min']
                    self.stats['price_adjustments'] += 1
                elif current_price > band['max']:
                    normalized_product['price'] = band['max']
                    self.stats['price_adjustments'] += 1
                    
            # Add category tags
            badges = normalized_product.get('badges', [])
            category_tag = self.category_tags.get(category)
            if category_tag and category_tag not in badges:
                badges.append(category_tag)
                
            # Add scarcity tags
            stock = product.get('stock', 100)
            if stock <= 5 and 'LAST_CALL' not in badges:
                badges.append('LAST_CALL')
            elif stock <= 15 and 'LOW_STOCK' not in badges:
                badges.append('LOW_STOCK')
                
            # Add exclusivity tags
            price = normalized_product.get('price', 0)
            is_limited = product.get('is_vault_exclusive', False) or product.get('vault_locked', False)
            if price >= 3000 or is_limited:
                if 'VAULT_ELIGIBLE' not in badges:
                    badges.append('VAULT_ELIGIBLE')
                    
            normalized_product['badges'] = badges
            
            # Add metafields if missing
            if 'metafields' not in normalized_product:
                scene_code = self.scene_codes.get(scene, 'GEN')
                normalized_product['metafields'] = {
                    'og': {
                        'rank': random.randint(1, 100),
                        'scene_code': scene_code,
                        'is_limited': is_limited,
                        'drop_start': None,
                        'drop_end': None,
                        'badges': badges,
                        'colorway': product.get('colors', ['Default'])[0] if product.get('colors') else 'Default',
                        'size_chart': f"{category.lower()}_size_chart.jpg",
                        'locale_tags': ['IN', 'EN'],
                        'collectible_id': f"OG-{product.get('id', '000000')}"
                    }
                }
                
            normalized.append(normalized_product)
            self.stats['products_modified'] += 1
            
        return normalized

    def generate_report(self, all_products: List[Dict]) -> str:
        """Generate normalization report CSV"""
        report_data = []
        
        for product in all_products:
            report_data.append({
                'ID': product.get('id'),
                'OG_Name': product.get('og_name'),
                'Original_Name': product.get('name'),
                'Category': product.get('category'),
                'Product_Type': product.get('product_type'),
                'Price': product.get('price'),
                'Original_Price': product.get('originalPrice'),
                'Stock': product.get('stock'),
                'Badges': ', '.join(product.get('badges', [])),
                'Scene_Code': product.get('metafields', {}).get('og', {}).get('scene_code'),
                'Is_Limited': product.get('metafields', {}).get('og', {}).get('is_limited'),
                'Collectible_ID': product.get('metafields', {}).get('og', {}).get('collectible_id')
            })
            
        # Write CSV
        report_file = 'normalization-report.csv'
        with open(report_file, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['ID', 'OG_Name', 'Original_Name', 'Category', 'Product_Type', 'Price', 'Original_Price', 'Stock', 'Badges', 'Scene_Code', 'Is_Limited', 'Collectible_ID']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(report_data)
            
        return report_file

    def run_normalization(self, dry_run: bool = True):
        """Run the complete normalization process"""
        self.dry_run = dry_run
        print(f"🚀 Starting OG Product Normalization ({'DRY RUN' if dry_run else 'LIVE RUN'})")
        
        # Load current products
        current_products = self.load_current_products()
        self.stats['total_products'] = len(current_products)
        print(f"📦 Loaded {len(current_products)} existing products")
        
        # Generate missing products
        missing_products = self.generate_missing_products()
        self.stats['products_added'] = len(missing_products)
        print(f"➕ Generated {len(missing_products)} missing products")
        
        # Normalize existing products
        normalized_existing = self.normalize_existing_products(current_products)
        print(f"🔄 Normalized {len(normalized_existing)} existing products")
        
        # Combine all products
        all_products = normalized_existing + missing_products
        
        # Generate report
        report_file = self.generate_report(all_products)
        print(f"📊 Generated report: {report_file}")
        
        # Save normalized products
        if not dry_run:
            output_file = 'frontend/public/comprehensive_products_normalized.json'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(all_products, f, indent=2, ensure_ascii=False)
            print(f"💾 Saved normalized products to {output_file}")
        else:
            print("🔍 DRY RUN: No files modified")
            
        # Print statistics
        print("\n📈 NORMALIZATION STATISTICS:")
        print(f"  Total Products: {len(all_products)}")
        print(f"  Products Added: {self.stats['products_added']}")
        print(f"  Products Modified: {self.stats['products_modified']}")
        print(f"  Price Adjustments: {self.stats['price_adjustments']}")
        
        # Category breakdown
        categories = {}
        for product in all_products:
            cat = product.get('category', 'Unknown')
            categories[cat] = categories.get(cat, 0) + 1
            
        print("\n📂 CATEGORY BREAKDOWN:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count} products")
            
        return all_products, report_file

if __name__ == "__main__":
    normalizer = OGProductNormalizer()
    
    # Run dry run first
    print("=" * 60)
    print("🧪 RUNNING DRY RUN")
    print("=" * 60)
    normalizer.run_normalization(dry_run=True)
    
    # Ask for confirmation
    print("\n" + "=" * 60)
    response = input("🤔 Proceed with live normalization? (y/N): ")
    
    if response.lower() == 'y':
        print("\n" + "=" * 60)
        print("🔥 RUNNING LIVE NORMALIZATION")
        print("=" * 60)
        normalizer.run_normalization(dry_run=False)
        print("\n✅ Normalization complete!")
    else:
        print("\n❌ Normalization cancelled")