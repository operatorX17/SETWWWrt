#!/usr/bin/env python3
"""
Rebuild Product Catalog from PRODUCTS Folder Structure
Respects original folder organization and generates proper metadata
"""

import os
import json
import glob
from pathlib import Path

def get_category_from_path(product_path):
    """Extract category from folder structure"""
    parts = Path(product_path).parts
    # Find PRODUCTS folder index
    try:
        products_idx = parts.index('PRODUCTS')
        if products_idx + 1 < len(parts):
            return parts[products_idx + 1]
    except ValueError:
        pass
    return 'unknown'

def generate_product_title(category, product_folder):
    """Generate proper product title based on category and folder"""
    # Clean up product folder name
    clean_name = product_folder.replace('product', 'Product ').replace('Product ', 'Product ')
    
    category_titles = {
        'posters': f'{clean_name} Poster',
        'teeshirt': f'{clean_name} T-Shirt',
        'hoodies': f'{clean_name} Hoodie',
        'full shirts': f'{clean_name} Full Shirt',
        'Sweatshirts': f'{clean_name} Sweatshirt',
        'hats': f'{clean_name} Hat',
        'HeadBand': f'{clean_name} Headband',
        'slippers': f'{clean_name} Slippers',
        'wallet': f'{clean_name} Wallet'
    }
    
    return category_titles.get(category, f'{clean_name} {category.title()}')

def generate_handle(title):
    """Generate URL handle from title"""
    return title.lower().replace(' ', '-').replace('_', '-')

def find_images(product_path):
    """Find front and back images for product"""
    front_image = None
    back_image = None
    
    # Look for images in front and back subfolders
    front_folder = os.path.join(product_path, 'front')
    back_folder = os.path.join(product_path, 'back')
    
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.webp']
    
    # Find front image
    if os.path.exists(front_folder):
        for ext in image_extensions:
            front_images = glob.glob(os.path.join(front_folder, ext))
            if front_images:
                front_image = front_images[0]  # Take first image found
                break
    
    # Find back image
    if os.path.exists(back_folder):
        for ext in image_extensions:
            back_images = glob.glob(os.path.join(back_folder, ext))
            if back_images:
                back_image = back_images[0]  # Take first image found
                break
    
    # Fallback: look for images directly in product folder
    if not front_image and not back_image:
        for ext in image_extensions:
            images = glob.glob(os.path.join(product_path, ext))
            for img in images:
                img_name = os.path.basename(img).lower()
                if 'front' in img_name or 'f.' in img_name:
                    front_image = img
                elif 'back' in img_name or 'b.' in img_name:
                    back_image = img
                elif not front_image:  # First image as front if no specific naming
                    front_image = img
                elif not back_image:   # Second image as back
                    back_image = img
    
    return front_image, back_image

def scan_products_directory(products_dir):
    """Scan PRODUCTS directory and build catalog"""
    catalog = []
    
    # Walk through all category folders
    for category_folder in os.listdir(products_dir):
        category_path = os.path.join(products_dir, category_folder)
        
        if not os.path.isdir(category_path):
            continue
            
        print(f"Processing category: {category_folder}")
        
        # Handle different folder structures
        if category_folder == 'teeshirt':
            # teeshirt has subcategories
            for subcategory in os.listdir(category_path):
                subcategory_path = os.path.join(category_path, subcategory)
                if os.path.isdir(subcategory_path):
                    front_img, back_img = find_images(subcategory_path)
                    if front_img:
                        product = create_product_entry(
                            category='teeshirt',
                            product_name=subcategory,
                            front_image=front_img,
                            back_image=back_img
                        )
                        catalog.append(product)
        else:
            # Other categories have direct product folders
            for product_folder in os.listdir(category_path):
                product_path = os.path.join(category_path, product_folder)
                if os.path.isdir(product_path):
                    front_img, back_img = find_images(product_path)
                    if front_img:
                        product = create_product_entry(
                            category=category_folder,
                            product_name=product_folder,
                            front_image=front_img,
                            back_image=back_img
                        )
                        catalog.append(product)
    
    return catalog

def create_product_entry(category, product_name, front_image, back_image):
    """Create standardized product entry"""
    title = generate_product_title(category, product_name)
    handle = generate_handle(title)
    
    # Generate tags based on category
    category_tags = {
        'posters': ['poster', 'wall-art', 'print', 'decor'],
        'teeshirt': ['t-shirt', 'tee', 'casual', 'cotton'],
        'hoodies': ['hoodie', 'sweatshirt', 'warm', 'casual'],
        'full shirts': ['shirt', 'formal', 'cotton', 'long-sleeve'],
        'Sweatshirts': ['sweatshirt', 'casual', 'warm', 'cotton'],
        'hats': ['hat', 'cap', 'headwear', 'accessory'],
        'HeadBand': ['headband', 'accessory', 'sport', 'fitness'],
        'slippers': ['slippers', 'footwear', 'comfort', 'home'],
        'wallet': ['wallet', 'accessory', 'leather', 'money']
    }
    
    tags = category_tags.get(category, [category.lower()])
    
    product = {
        'title': title,
        'handle': handle,
        'category': category,
        'product_type': category,
        'tags': tags,
        'vendor': 'OG Brand',
        'status': 'active',
        'published': True,
        'images': {
            'front': os.path.abspath(front_image) if front_image else None,
            'back': os.path.abspath(back_image) if back_image else None
        },
        'variants': [{
            'title': 'Default',
            'price': '999.00',
            'sku': f'{handle}-default',
            'inventory_quantity': 100,
            'weight': 0.5,
            'requires_shipping': True
        }],
        'seo_title': title,
        'seo_description': f'High-quality {category} - {title}. Premium design and comfort.',
        'meta_description': f'Shop {title} - Premium {category} with unique design.'
    }
    
    return product

def main():
    """Main execution function"""
    products_dir = r'c:\Users\KARTHIK GOWDA M P\Downloads\imgprocess4\PRODUCTS'
    output_file = r'c:\Users\KARTHIK GOWDA M P\Downloads\imgprocess4\out\final_corrected_catalog.json'
    
    print(f"Scanning products directory: {products_dir}")
    
    if not os.path.exists(products_dir):
        print(f"ERROR: Products directory not found: {products_dir}")
        return
    
    # Scan and build catalog
    catalog = scan_products_directory(products_dir)
    
    print(f"\nGenerated {len(catalog)} products:")
    
    # Count by category
    from collections import Counter
    category_counts = Counter([p['category'] for p in catalog])
    for category, count in category_counts.items():
        print(f"  {category}: {count} products")
    
    # Save catalog
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    
    print(f"\nCatalog saved to: {output_file}")
    print("\nSample products:")
    for i, product in enumerate(catalog[:5]):
        print(f"  {i+1}. {product['title']} ({product['category']})")

if __name__ == '__main__':
    main()