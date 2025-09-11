#!/usr/bin/env python3
"""
Comprehensive Product Image Fixer
Maps physical product images from PRODUCTS folder to catalog entries
"""

import os
import json
import shutil
from pathlib import Path
import re

class ProductImageFixer:
    def __init__(self, base_dir):
        self.base_dir = Path(base_dir)
        self.products_dir = self.base_dir / "PRODUCTS"
        self.frontend_dir = self.base_dir / "frontend"
        self.public_dir = self.frontend_dir / "public"
        self.catalog_file = self.frontend_dir / "PREMIUM_CATALOG_REGENERATED.json"
        self.production_catalog = self.public_dir / "PRODUCTION_CATALOG.json"
        
        # Create images directory in public if it doesn't exist
        self.public_images_dir = self.public_dir / "images" / "products"
        self.public_images_dir.mkdir(parents=True, exist_ok=True)
        
    def scan_product_images(self):
        """Scan PRODUCTS folder and create image mapping"""
        image_mapping = {}
        
        for category_dir in self.products_dir.iterdir():
            if not category_dir.is_dir():
                continue
                
            category_name = category_dir.name.lower()
            image_mapping[category_name] = {}
            
            print(f"Scanning category: {category_name}")
            
            for product_dir in category_dir.iterdir():
                if not product_dir.is_dir():
                    # Handle direct image files (like in HeadBand, wallet)
                    if product_dir.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                        image_mapping[category_name]['direct'] = str(product_dir.relative_to(self.base_dir))
                    continue
                    
                product_name = product_dir.name
                image_mapping[category_name][product_name] = {}
                
                # Scan for images in product directory
                for item in product_dir.rglob('*'):
                    if item.is_file() and item.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                        # Determine view type (front, back, etc.)
                        view_type = 'main'
                        if 'front' in item.parent.name.lower():
                            view_type = 'front'
                        elif 'back' in item.parent.name.lower():
                            view_type = 'back'
                        elif item.parent.name.lower() in ['black', 'blue', 'red', 'grey']:
                            view_type = item.parent.name.lower()
                            
                        image_mapping[category_name][product_name][view_type] = str(item.relative_to(self.base_dir))
                        
        return image_mapping
    
    def copy_images_to_public(self, image_mapping):
        """Copy images to public/images/products with organized structure"""
        copied_images = {}
        
        for category, products in image_mapping.items():
            category_dir = self.public_images_dir / category
            category_dir.mkdir(exist_ok=True)
            copied_images[category] = {}
            
            for product, images in products.items():
                if isinstance(images, str):  # Direct image file
                    source_path = self.base_dir / images
                    if source_path.exists():
                        dest_path = category_dir / f"{product}{source_path.suffix}"
                        shutil.copy2(source_path, dest_path)
                        copied_images[category][product] = f"/images/products/{category}/{dest_path.name}"
                elif isinstance(images, dict):
                    product_dir = category_dir / product
                    product_dir.mkdir(exist_ok=True)
                    copied_images[category][product] = {}
                    
                    for view_type, image_path in images.items():
                        source_path = self.base_dir / image_path
                        if source_path.exists():
                            dest_path = product_dir / f"{view_type}{source_path.suffix}"
                            shutil.copy2(source_path, dest_path)
                            copied_images[category][product][view_type] = f"/images/products/{category}/{product}/{dest_path.name}"
                            
        return copied_images
    
    def normalize_category_name(self, category):
        """Normalize category names to match catalog"""
        category_mapping = {
            'teeshirt': 'tees',
            'full shirts': 'formal_shirts',
            'sweatshirts': 'sweatshirts',
            'headband': 'headband',
            'slippers': 'slides'
        }
        return category_mapping.get(category.lower(), category.lower())
    
    def update_catalog_with_images(self, copied_images):
        """Update the catalog files with correct image paths"""
        # Load current catalog
        if self.catalog_file.exists():
            with open(self.catalog_file, 'r', encoding='utf-8') as f:
                catalog = json.load(f)
        else:
            print(f"Catalog file not found: {self.catalog_file}")
            return
            
        updated_count = 0
        
        # Update hero section products
        if 'hero_section' in catalog and 'products' in catalog['hero_section']:
            for product in catalog['hero_section']['products']:
                updated_count += self._update_product_images(product, copied_images)
                
        # Update main products
        if 'products' in catalog:
            for product in catalog['products']:
                updated_count += self._update_product_images(product, copied_images)
                
        # Save updated catalog
        with open(self.catalog_file, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
            
        print(f"Updated {updated_count} products with image paths")
        
        # Also update production catalog if it exists
        self._update_production_catalog(copied_images)
        
    def _update_product_images(self, product, copied_images):
        """Update a single product's image paths"""
        updated = False
        category = product.get('category', '').lower()
        normalized_category = self.normalize_category_name(category)
        
        if normalized_category in copied_images:
            category_images = copied_images[normalized_category]
            
            # Try to match product by handle or title
            product_handle = product.get('handle', '').lower()
            product_title = product.get('title', '').lower()
            
            # Find matching images
            matched_images = None
            for product_key, images in category_images.items():
                if (product_key.lower() in product_handle or 
                    product_key.lower() in product_title or
                    any(word in product_key.lower() for word in product_handle.split('-'))):
                    matched_images = images
                    break
                    
            if matched_images:
                if isinstance(matched_images, str):
                    # Single image
                    product['image'] = matched_images
                    if 'images' not in product:
                        product['images'] = {}
                    product['images']['front'] = matched_images
                    updated = True
                elif isinstance(matched_images, dict):
                    # Multiple images
                    if 'images' not in product:
                        product['images'] = {}
                    
                    # Set main image
                    if 'front' in matched_images:
                        product['image'] = matched_images['front']
                        product['images']['front'] = matched_images['front']
                    elif 'main' in matched_images:
                        product['image'] = matched_images['main']
                        product['images']['front'] = matched_images['main']
                    else:
                        # Use first available image
                        first_image = list(matched_images.values())[0]
                        product['image'] = first_image
                        product['images']['front'] = first_image
                        
                    # Set other views
                    for view_type, image_path in matched_images.items():
                        product['images'][view_type] = image_path
                        
                    updated = True
                    
        return 1 if updated else 0
    
    def _update_production_catalog(self, copied_images):
        """Update production catalog with image paths"""
        if not self.production_catalog.exists():
            return
            
        with open(self.production_catalog, 'r', encoding='utf-8') as f:
            catalog = json.load(f)
            
        updated_count = 0
        
        if 'products' in catalog:
            for product in catalog['products']:
                updated_count += self._update_product_images(product, copied_images)
                
        with open(self.production_catalog, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
            
        print(f"Updated {updated_count} products in production catalog")
    
    def generate_image_report(self, image_mapping, copied_images):
        """Generate a report of image mapping results"""
        report = {
            'total_categories': len(image_mapping),
            'total_images_found': 0,
            'total_images_copied': 0,
            'categories': {}
        }
        
        for category, products in image_mapping.items():
            category_stats = {
                'products': len(products),
                'images_found': 0,
                'images_copied': 0
            }
            
            for product, images in products.items():
                if isinstance(images, str):
                    category_stats['images_found'] += 1
                elif isinstance(images, dict):
                    category_stats['images_found'] += len(images)
                    
            if category in copied_images:
                for product, images in copied_images[category].items():
                    if isinstance(images, str):
                        category_stats['images_copied'] += 1
                    elif isinstance(images, dict):
                        category_stats['images_copied'] += len(images)
                        
            report['categories'][category] = category_stats
            report['total_images_found'] += category_stats['images_found']
            report['total_images_copied'] += category_stats['images_copied']
            
        return report
    
    def run(self):
        """Execute the complete image fixing process"""
        print("🔧 Starting comprehensive product image fix...")
        
        # Step 1: Scan for images
        print("\n📁 Scanning PRODUCTS folder for images...")
        image_mapping = self.scan_product_images()
        
        # Step 2: Copy images to public directory
        print("\n📋 Copying images to public directory...")
        copied_images = self.copy_images_to_public(image_mapping)
        
        # Step 3: Update catalogs
        print("\n📝 Updating catalog files...")
        self.update_catalog_with_images(copied_images)
        
        # Step 4: Generate report
        print("\n📊 Generating report...")
        report = self.generate_image_report(image_mapping, copied_images)
        
        # Save report
        report_file = self.base_dir / "image_fix_report.json"
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2)
            
        print(f"\n✅ Image fix complete!")
        print(f"📊 Found {report['total_images_found']} images across {report['total_categories']} categories")
        print(f"📋 Copied {report['total_images_copied']} images to public directory")
        print(f"📄 Report saved to: {report_file}")
        
        return report

if __name__ == "__main__":
    # Get the base directory (where this script is located)
    base_dir = Path(__file__).parent
    
    # Initialize and run the fixer
    fixer = ProductImageFixer(base_dir)
    report = fixer.run()
    
    print("\n🎯 Next steps:")
    print("1. Check the debug page at /debug to verify images are loading")
    print("2. Test the main website to ensure product images display correctly")
    print("3. Update any remaining manual image mappings if needed")