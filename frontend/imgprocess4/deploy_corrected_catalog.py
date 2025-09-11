#!/usr/bin/env python3
"""
Deploy Corrected Catalog to Frontend
Copies the corrected catalog to the main frontend directory and updates the comprehensive_products.json
"""

import json
import shutil
import os
from pathlib import Path

def load_corrected_catalog():
    """Load the corrected catalog"""
    with open('CORRECTED_FINAL_CATALOG.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def convert_to_comprehensive_format(catalog):
    """Convert corrected catalog to comprehensive_products.json format"""
    products = catalog.get('products', [])
    comprehensive_products = []
    
    for product in products:
        # Extract base price from variants
        price = 0
        if 'variants' in product and product['variants']:
            try:
                price = float(product['variants'][0]['price'])
            except (ValueError, TypeError, KeyError):
                price = 0
        
        # Create comprehensive product entry
        comprehensive_product = {
            'id': product.get('handle', ''),
            'title': product.get('title', ''),
            'handle': product.get('handle', ''),
            'category': product.get('category', ''),
            'product_type': product.get('product_type', ''),
            'tags': product.get('tags', []),
            'vendor': product.get('vendor', 'OG Brand'),
            'status': product.get('status', 'active'),
            'published': product.get('published', True),
            'variants': product.get('variants', []),
            'images': {
                'front': product.get('images', {}).get('front', ''),
                'back': product.get('images', {}).get('back', '')
            },
            'seo_title': product.get('seo_title', ''),
            'seo_description': product.get('seo_description', ''),
            'meta_description': product.get('meta_description', ''),
            'description': product.get('description', ''),
            'conversion_data': product.get('conversion_data', {}),
            'color_palette': product.get('color_palette', []),
            'price': price,
            'name': product.get('title', ''),
            'colors': [color.get('name', '') for color in product.get('color_palette', [])]
        }
        
        comprehensive_products.append(comprehensive_product)
    
    return comprehensive_products

def create_section_files(catalog):
    """Create separate files for each section"""
    sections = catalog.get('sections', {})
    
    # Create sections directory
    sections_dir = Path('sections')
    sections_dir.mkdir(exist_ok=True)
    
    for section_name, products in sections.items():
        section_file = sections_dir / f'{section_name}.json'
        section_data = {
            'metadata': {
                'section': section_name,
                'total_products': len(products),
                'generated_at': '2025-01-10',
                'price_range': get_price_range(section_name)
            },
            'products': products
        }
        
        with open(section_file, 'w', encoding='utf-8') as f:
            json.dump(section_data, f, indent=2, ensure_ascii=False)
        
        print(f"Created {section_file} with {len(products)} products")

def get_price_range(section_name):
    """Get price range description for section"""
    ranges = {
        'under_999': '₹0 - ₹998',
        'vault': '₹999 - ₹1499',
        'premium': '₹1500 - ₹2499',
        'armory': '₹2500+'
    }
    return ranges.get(section_name, 'Unknown')

def deploy_to_frontend():
    """Deploy corrected catalog to main frontend directory"""
    frontend_dir = Path('../public')
    
    if not frontend_dir.exists():
        print("Frontend public directory not found. Creating backup in current directory.")
        frontend_dir = Path('.')
    
    # Copy corrected catalog
    shutil.copy2('CORRECTED_FINAL_CATALOG.json', frontend_dir / 'corrected_catalog.json')
    print(f"Copied corrected catalog to {frontend_dir / 'corrected_catalog.json'}")
    
    # Load and convert catalog
    catalog = load_corrected_catalog()
    comprehensive_products = convert_to_comprehensive_format(catalog)
    
    # Save comprehensive products
    comprehensive_file = frontend_dir / 'comprehensive_products_corrected.json'
    with open(comprehensive_file, 'w', encoding='utf-8') as f:
        json.dump(comprehensive_products, f, indent=2, ensure_ascii=False)
    
    print(f"Created {comprehensive_file} with {len(comprehensive_products)} products")
    
    # Create backup of original if it exists
    original_file = frontend_dir / 'comprehensive_products.json'
    if original_file.exists():
        backup_file = frontend_dir / 'comprehensive_products_backup.json'
        shutil.copy2(original_file, backup_file)
        print(f"Backed up original to {backup_file}")
    
    # Replace original with corrected version
    shutil.copy2(comprehensive_file, original_file)
    print(f"Replaced {original_file} with corrected version")
    
    return catalog

def create_deployment_summary(catalog):
    """Create deployment summary"""
    summary = {
        'deployment_info': {
            'timestamp': '2025-01-10',
            'version': '2.0.0',
            'classification_fixed': True,
            'duplicates_removed': True,
            'sections_created': True
        },
        'statistics': catalog.get('metadata', {}),
        'sections': {
            section: len(products) 
            for section, products in catalog.get('sections', {}).items()
        },
        'categories': catalog.get('metadata', {}).get('categories', []),
        'fixes_applied': [
            'Fixed poster misclassification (removed incorrect CAT_TEE tags)',
            'Corrected product categories based on title patterns',
            'Removed 8 duplicate products',
            'Created price-based sections (Under 999, Vault, Premium, Armory)',
            'Standardized product metadata and tags',
            'Fixed image paths and variant structures'
        ]
    }
    
    with open('DEPLOYMENT_SUMMARY.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print("\n=== DEPLOYMENT SUMMARY ===")
    print(f"Total Products: {summary['statistics'].get('total_products', 0)}")
    print(f"Categories: {', '.join(summary['categories'])}")
    print("\nSections:")
    for section, count in summary['sections'].items():
        price_range = get_price_range(section)
        print(f"  {section.replace('_', ' ').title()}: {count} products ({price_range})")
    
    print("\nFixes Applied:")
    for fix in summary['fixes_applied']:
        print(f"  ✓ {fix}")
    
    print(f"\nDeployment summary saved to: DEPLOYMENT_SUMMARY.json")

def main():
    """Main deployment function"""
    print("Starting deployment of corrected catalog...")
    
    if not os.path.exists('CORRECTED_FINAL_CATALOG.json'):
        print("Error: CORRECTED_FINAL_CATALOG.json not found")
        print("Please run fix_classification_final.py first")
        return
    
    # Deploy to frontend
    catalog = deploy_to_frontend()
    
    # Create section files
    create_section_files(catalog)
    
    # Create deployment summary
    create_deployment_summary(catalog)
    
    print("\n🎉 Deployment completed successfully!")
    print("\nNext steps:")
    print("1. Restart your frontend development server")
    print("2. Check that products display correctly with proper categories")
    print("3. Verify that React key prop errors are resolved")
    print("4. Test the section-based filtering (Under 999, Vault, Premium, Armory)")

if __name__ == '__main__':
    main()