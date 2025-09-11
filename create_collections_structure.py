#!/usr/bin/env python3
"""
Collections Structure Creator
Organizes products into meaningful collections and updates catalog
"""

import os
import json
from pathlib import Path
from datetime import datetime

class CollectionsCreator:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.frontend_dir = self.base_dir / "frontend"
        self.catalog_file = self.frontend_dir / "PREMIUM_CATALOG_REGENERATED.json"
        self.production_catalog = self.frontend_dir / "public" / "PRODUCTION_CATALOG.json"
        
        # Define collection structure
        self.collections_structure = {
            "firestorm": {
                "name": "Firestorm Collection",
                "description": "Bold and intense designs that make a statement",
                "theme": "aggressive",
                "target_categories": ["teeshirt", "hoodies", "full shirts"],
                "keywords": ["fire", "storm", "blade", "blood", "dripping", "mark"],
                "premium_tiers": ["Vault Collection", "Armory Collection"],
                "color_scheme": ["red", "black", "orange"],
                "featured": True
            },
            "essential": {
                "name": "Essential Collection",
                "description": "Everyday essentials with the OG touch",
                "theme": "casual",
                "target_categories": ["teeshirt", "hats", "slippers"],
                "keywords": ["og", "mark", "classic", "essential"],
                "premium_tiers": ["Essential Collection"],
                "color_scheme": ["black", "white", "grey"],
                "featured": True
            },
            "premium": {
                "name": "Premium Collection",
                "description": "Luxury items and exclusive designs",
                "theme": "luxury",
                "target_categories": ["wallet", "hoodies", "sweatshirts"],
                "keywords": ["premium", "luxury", "exclusive", "wallet"],
                "premium_tiers": ["Premium Collection"],
                "color_scheme": ["gold", "black", "brown"],
                "featured": True
            },
            "vault": {
                "name": "Vault Collection",
                "description": "Limited edition and high-value pieces",
                "theme": "exclusive",
                "target_categories": ["hoodies", "full shirts", "posters"],
                "keywords": ["vault", "limited", "exclusive", "rare"],
                "premium_tiers": ["Vault Collection"],
                "color_scheme": ["black", "gold", "silver"],
                "featured": True
            },
            "armory": {
                "name": "Armory Collection",
                "description": "Tactical and military-inspired designs",
                "theme": "tactical",
                "target_categories": ["posters", "teeshirt", "hats"],
                "keywords": ["armory", "tactical", "military", "blade", "weapon"],
                "premium_tiers": ["Armory Collection"],
                "color_scheme": ["green", "black", "brown"],
                "featured": True
            },
            "streetwear": {
                "name": "Streetwear Collection",
                "description": "Urban fashion and street culture",
                "theme": "urban",
                "target_categories": ["teeshirt", "hoodies", "hats"],
                "keywords": ["street", "urban", "culture", "og"],
                "premium_tiers": ["Essential Collection", "Premium Collection"],
                "color_scheme": ["black", "white", "red"],
                "featured": False
            },
            "accessories": {
                "name": "Accessories Collection",
                "description": "Complete your look with OG accessories",
                "theme": "accessories",
                "target_categories": ["hats", "wallet", "slippers"],
                "keywords": ["accessory", "cap", "wallet", "slides"],
                "premium_tiers": ["Essential Collection", "Premium Collection"],
                "color_scheme": ["black", "brown", "grey"],
                "featured": False
            }
        }
    
    def load_catalog(self):
        """Load the current catalog"""
        if self.catalog_file.exists():
            with open(self.catalog_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            print(f"Catalog file not found: {self.catalog_file}")
            return None
    
    def assign_products_to_collections(self, catalog):
        """Assign products to collections based on criteria"""
        collections_data = {}
        
        # Initialize collections
        for collection_id, collection_info in self.collections_structure.items():
            collections_data[collection_id] = {
                "id": collection_id,
                "name": collection_info["name"],
                "description": collection_info["description"],
                "theme": collection_info["theme"],
                "color_scheme": collection_info["color_scheme"],
                "featured": collection_info["featured"],
                "products": [],
                "total_products": 0,
                "price_range": {"min": float('inf'), "max": 0},
                "categories": set()
            }
        
        # Process all products
        all_products = []
        
        # Add hero section products
        if 'hero_section' in catalog and 'products' in catalog['hero_section']:
            all_products.extend(catalog['hero_section']['products'])
        
        # Add main products
        if 'products' in catalog:
            all_products.extend(catalog['products'])
        
        # Assign products to collections
        for product in all_products:
            product_collections = self._determine_product_collections(product)
            
            for collection_id in product_collections:
                if collection_id in collections_data:
                    collections_data[collection_id]['products'].append(product)
                    collections_data[collection_id]['total_products'] += 1
                    collections_data[collection_id]['categories'].add(product.get('category', ''))
                    
                    # Update price range
                    price = float(product.get('price', 0))
                    if price > 0:
                        collections_data[collection_id]['price_range']['min'] = min(
                            collections_data[collection_id]['price_range']['min'], price
                        )
                        collections_data[collection_id]['price_range']['max'] = max(
                            collections_data[collection_id]['price_range']['max'], price
                        )
        
        # Convert sets to lists and clean up
        for collection_id, collection_data in collections_data.items():
            collection_data['categories'] = list(collection_data['categories'])
            if collection_data['price_range']['min'] == float('inf'):
                collection_data['price_range']['min'] = 0
        
        return collections_data
    
    def _determine_product_collections(self, product):
        """Determine which collections a product belongs to"""
        product_collections = []
        
        title = product.get('title', '').lower()
        category = product.get('category', '').lower()
        premium_tier = product.get('premium_tier', '')
        
        for collection_id, collection_info in self.collections_structure.items():
            score = 0
            
            # Check premium tier match
            if premium_tier in collection_info['premium_tiers']:
                score += 3
            
            # Check category match
            if category in collection_info['target_categories']:
                score += 2
            
            # Check keyword match
            for keyword in collection_info['keywords']:
                if keyword.lower() in title:
                    score += 1
            
            # Assign to collection if score is high enough
            if score >= 2:  # Minimum score threshold
                product_collections.append(collection_id)
        
        # Ensure every product is in at least one collection
        if not product_collections:
            # Default assignment based on category
            if category in ['wallet', 'hats', 'slippers']:
                product_collections.append('accessories')
            elif category in ['teeshirt', 'hoodies']:
                product_collections.append('streetwear')
            else:
                product_collections.append('essential')
        
        return product_collections
    
    def create_collections_page_data(self, collections_data):
        """Create data structure for collections page"""
        collections_page = {
            "metadata": {
                "total_collections": len(collections_data),
                "featured_collections": len([c for c in collections_data.values() if c['featured']]),
                "generated_at": datetime.now().isoformat(),
                "version": "1.0.0"
            },
            "featured_collections": [],
            "all_collections": [],
            "collection_stats": {
                "total_products_in_collections": sum(c['total_products'] for c in collections_data.values()),
                "average_products_per_collection": 0,
                "price_ranges": {}
            }
        }
        
        # Sort collections by featured status and product count
        sorted_collections = sorted(
            collections_data.values(),
            key=lambda x: (x['featured'], x['total_products']),
            reverse=True
        )
        
        for collection in sorted_collections:
            collection_summary = {
                "id": collection['id'],
                "name": collection['name'],
                "description": collection['description'],
                "theme": collection['theme'],
                "total_products": collection['total_products'],
                "categories": collection['categories'],
                "price_range": collection['price_range'],
                "featured": collection['featured'],
                "preview_products": collection['products'][:4]  # First 4 products for preview
            }
            
            collections_page['all_collections'].append(collection_summary)
            
            if collection['featured']:
                collections_page['featured_collections'].append(collection_summary)
        
        # Calculate stats
        if collections_data:
            collections_page['collection_stats']['average_products_per_collection'] = round(
                collections_page['collection_stats']['total_products_in_collections'] / len(collections_data), 2
            )
        
        return collections_page
    
    def update_catalog_with_collections(self, catalog, collections_data):
        """Update catalog with collection information"""
        # Add collections metadata to catalog
        if 'metadata' not in catalog:
            catalog['metadata'] = {}
        
        catalog['metadata']['collections_enabled'] = True
        catalog['metadata']['total_collections'] = len(collections_data)
        catalog['metadata']['collections_updated_at'] = datetime.now().isoformat()
        
        # Add collection info to each product
        all_products = []
        
        # Process hero section products
        if 'hero_section' in catalog and 'products' in catalog['hero_section']:
            for product in catalog['hero_section']['products']:
                self._add_collection_info_to_product(product, collections_data)
            all_products.extend(catalog['hero_section']['products'])
        
        # Process main products
        if 'products' in catalog:
            for product in catalog['products']:
                self._add_collection_info_to_product(product, collections_data)
            all_products.extend(catalog['products'])
        
        return catalog
    
    def _add_collection_info_to_product(self, product, collections_data):
        """Add collection information to a product"""
        product_collections = []
        
        for collection_id, collection_data in collections_data.items():
            if any(p.get('id') == product.get('id') for p in collection_data['products']):
                product_collections.append({
                    "id": collection_id,
                    "name": collection_data['name'],
                    "theme": collection_data['theme']
                })
        
        product['collections'] = product_collections
        product['primary_collection'] = product_collections[0] if product_collections else None
    
    def save_collections_data(self, collections_page, collections_data):
        """Save collections data to files"""
        # Save collections page data
        collections_file = self.frontend_dir / "public" / "collections.json"
        with open(collections_file, 'w', encoding='utf-8') as f:
            json.dump(collections_page, f, indent=2, ensure_ascii=False)
        
        # Save detailed collections data
        detailed_collections_file = self.frontend_dir / "collections_detailed.json"
        with open(detailed_collections_file, 'w', encoding='utf-8') as f:
            json.dump(collections_data, f, indent=2, ensure_ascii=False, default=str)
        
        return collections_file, detailed_collections_file
    
    def run(self):
        """Execute the complete collections creation process"""
        print("🏗️ Starting collections structure creation...")
        
        # Step 1: Load catalog
        print("\n📖 Loading catalog...")
        catalog = self.load_catalog()
        if not catalog:
            return
        
        # Step 2: Assign products to collections
        print("\n🎯 Assigning products to collections...")
        collections_data = self.assign_products_to_collections(catalog)
        
        # Step 3: Create collections page data
        print("\n📄 Creating collections page data...")
        collections_page = self.create_collections_page_data(collections_data)
        
        # Step 4: Update catalog with collection info
        print("\n📝 Updating catalog with collection information...")
        updated_catalog = self.update_catalog_with_collections(catalog, collections_data)
        
        # Step 5: Save updated catalog
        with open(self.catalog_file, 'w', encoding='utf-8') as f:
            json.dump(updated_catalog, f, indent=2, ensure_ascii=False)
        
        # Step 6: Save collections data
        print("\n💾 Saving collections data...")
        collections_file, detailed_file = self.save_collections_data(collections_page, collections_data)
        
        # Step 7: Generate report
        print("\n📊 Generating collections report...")
        report = {
            "total_collections": len(collections_data),
            "featured_collections": len([c for c in collections_data.values() if c['featured']]),
            "collections_summary": {
                collection_id: {
                    "name": data['name'],
                    "total_products": data['total_products'],
                    "categories": data['categories'],
                    "featured": data['featured']
                }
                for collection_id, data in collections_data.items()
            },
            "files_created": [
                str(collections_file),
                str(detailed_file)
            ]
        }
        
        # Save report
        report_file = self.base_dir / "collections_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n✅ Collections structure created successfully!")
        print(f"📊 Created {report['total_collections']} collections with {report['featured_collections']} featured")
        print(f"📄 Collections data saved to: {collections_file}")
        print(f"📄 Detailed data saved to: {detailed_file}")
        print(f"📄 Report saved to: {report_file}")
        
        # Print collection summary
        print("\n📋 Collections Summary:")
        for collection_id, summary in report['collections_summary'].items():
            status = "⭐ Featured" if summary['featured'] else "📦 Standard"
            print(f"  {status} {summary['name']}: {summary['total_products']} products ({', '.join(summary['categories'])})")
        
        return report

if __name__ == "__main__":
    # Get the base directory
    base_dir = Path(__file__).parent
    
    # Initialize and run the collections creator
    creator = CollectionsCreator(base_dir)
    report = creator.run()
    
    print("\n🎯 Next steps:")
    print("1. Check the debug page to verify collections are working")
    print("2. Create a collections page in the frontend")
    print("3. Update navigation to include collections")
    print("4. Test collection filtering and display")