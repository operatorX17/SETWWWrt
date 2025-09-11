#!/usr/bin/env python3
"""
Comprehensive Product Classification and Metadata Fix
Fixes misclassification issues and creates proper sections:
- Under 999: Products under ₹999
- Vault: Products ₹999-₹1499  
- Premium: Products ₹1500-₹2499
- Armory: Products ₹2500+
"""

import json
import os
import re
from collections import defaultdict
from typing import Dict, List, Any

def load_catalog(file_path: str) -> Dict[str, Any]:
    """Load the production catalog"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_product_price(product: Dict[str, Any]) -> float:
    """Extract the base price from product variants"""
    if 'variants' in product and product['variants']:
        # Get the minimum price from variants
        prices = []
        for variant in product['variants']:
            if 'price' in variant:
                try:
                    price = float(variant['price'])
                    prices.append(price)
                except (ValueError, TypeError):
                    continue
        return min(prices) if prices else 0.0
    return 0.0

def fix_product_classification(product: Dict[str, Any]) -> Dict[str, Any]:
    """Fix product classification based on title and actual category"""
    title = product.get('title', '').lower()
    
    # Determine correct category based on title patterns
    if 'poster' in title:
        correct_category = 'posters'
        correct_tags = ['wall-art', 'home-decor', 'print', 'artwork', 'interior-design', 'CAT_POSTER', 'CAT_Poster']
    elif 'tee' in title or 't-shirt' in title:
        correct_category = 'teeshirt'
        correct_tags = ['tee', 'shirt', 'casual', 'cotton', 'CAT_TEE', 'CAT_Tee']
    elif 'hoodie' in title:
        correct_category = 'hoodies'
        correct_tags = ['hoodie', 'sweatshirt', 'warm', 'casual', 'streetwear', 'CAT_HOODIE', 'CAT_Hoodie']
    elif 'cap' in title or 'hat' in title:
        correct_category = 'hats'
        correct_tags = ['hat', 'cap', 'headwear', 'accessory', 'style', 'CAT_CAP', 'CAT_Cap']
    elif 'sweatshirt' in title:
        correct_category = 'Sweatshirts'
        correct_tags = ['sweatshirt', 'casual', 'warm', 'cotton', 'CAT_SWEATSHIRT', 'CAT_Sweatshirt']
    elif 'wallet' in title:
        correct_category = 'wallet'
        correct_tags = ['wallet', 'accessory', 'leather', 'money', 'CAT_WALLET', 'CAT_Wallet']
    elif 'slipper' in title:
        correct_category = 'slippers'
        correct_tags = ['slippers', 'footwear', 'comfort', 'casual', 'CAT_SLIPPER', 'CAT_Slipper']
    else:
        # Default to current category if no clear pattern
        correct_category = product.get('category', 'teeshirt')
        correct_tags = product.get('tags', [])
    
    # Update product classification
    product['category'] = correct_category
    product['product_type'] = correct_category
    
    # Fix tags - remove incorrect CAT_ tags and add correct ones
    current_tags = product.get('tags', [])
    # Remove all CAT_ tags
    filtered_tags = [tag for tag in current_tags if not tag.startswith('CAT_')]
    # Add correct CAT_ tags
    filtered_tags.extend([tag for tag in correct_tags if tag.startswith('CAT_')])
    # Add other category-specific tags
    filtered_tags.extend([tag for tag in correct_tags if not tag.startswith('CAT_')])
    
    product['tags'] = list(set(filtered_tags))  # Remove duplicates
    
    return product

def assign_price_section(price: float) -> str:
    """Assign product to price-based section"""
    if price < 999:
        return 'under_999'
    elif price < 1500:
        return 'vault'
    elif price < 2500:
        return 'premium'
    else:
        return 'armory'

def create_sections(products: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """Create price-based sections"""
    sections = {
        'under_999': [],
        'vault': [],
        'premium': [],
        'armory': []
    }
    
    for product in products:
        price = get_product_price(product)
        section = assign_price_section(price)
        sections[section].append(product)
    
    return sections

def remove_duplicates(products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Remove duplicate products based on handle"""
    seen_handles = set()
    unique_products = []
    
    for product in products:
        handle = product.get('handle', '')
        if handle and handle not in seen_handles:
            seen_handles.add(handle)
            unique_products.append(product)
        elif not handle:
            # Generate handle if missing
            title = product.get('title', 'unknown')
            handle = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
            if handle not in seen_handles:
                product['handle'] = handle
                seen_handles.add(handle)
                unique_products.append(product)
    
    return unique_products

def create_final_catalog(catalog: Dict[str, Any]) -> Dict[str, Any]:
    """Create the final corrected catalog"""
    products = catalog.get('products', [])
    
    print(f"Processing {len(products)} products...")
    
    # Fix classification for each product
    fixed_products = []
    for i, product in enumerate(products):
        try:
            fixed_product = fix_product_classification(product.copy())
            fixed_products.append(fixed_product)
            if (i + 1) % 10 == 0:
                print(f"Processed {i + 1}/{len(products)} products")
        except Exception as e:
            print(f"Error processing product {i}: {e}")
            continue
    
    # Remove duplicates
    print("Removing duplicates...")
    unique_products = remove_duplicates(fixed_products)
    print(f"Removed {len(fixed_products) - len(unique_products)} duplicates")
    
    # Create sections
    print("Creating price-based sections...")
    sections = create_sections(unique_products)
    
    # Update categories list
    categories = list(set(product.get('category', '') for product in unique_products))
    categories = [cat for cat in categories if cat]  # Remove empty strings
    
    # Create final catalog structure
    final_catalog = {
        'metadata': {
            'total_products': len(unique_products),
            'categories': sorted(categories),
            'generated_at': '2025-01-10',
            'version': '2.0.0',
            'ready_for_production': True,
            'classification_fixed': True,
            'sections': {
                'under_999': len(sections['under_999']),
                'vault': len(sections['vault']),
                'premium': len(sections['premium']),
                'armory': len(sections['armory'])
            }
        },
        'sections': sections,
        'products': unique_products,
        'hero_section': catalog.get('hero_section', {}),
        'bundles': catalog.get('bundles', [])
    }
    
    return final_catalog

def main():
    """Main function to fix classification and create final catalog"""
    input_file = 'FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json'
    output_file = 'CORRECTED_FINAL_CATALOG.json'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found")
        return
    
    print("Loading catalog...")
    catalog = load_catalog(input_file)
    
    print("Creating corrected catalog...")
    final_catalog = create_final_catalog(catalog)
    
    print("Saving corrected catalog...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_catalog, f, indent=2, ensure_ascii=False)
    
    # Print summary
    sections = final_catalog['sections']
    print("\n=== CLASSIFICATION SUMMARY ===")
    print(f"Total Products: {final_catalog['metadata']['total_products']}")
    print(f"Under 999 (₹0-₹998): {len(sections['under_999'])} products")
    print(f"Vault (₹999-₹1499): {len(sections['vault'])} products")
    print(f"Premium (₹1500-₹2499): {len(sections['premium'])} products")
    print(f"Armory (₹2500+): {len(sections['armory'])} products")
    print(f"\nCategories: {', '.join(final_catalog['metadata']['categories'])}")
    print(f"\nCorrected catalog saved to: {output_file}")

if __name__ == '__main__':
    main()