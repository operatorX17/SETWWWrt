#!/usr/bin/env python3
"""
Product Grouping Script
Groups AI-generated products by concept_name and category to link front/back views
and handle duplicate products properly.
"""

import json
import os
from collections import defaultdict
from datetime import datetime

def load_ai_products(file_path):
    """Load AI products from NDJSON file"""
    products = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                products.append(json.loads(line))
    return products

def group_products_by_concept(products):
    """Group products by category + concept_name combination"""
    groups = defaultdict(list)
    
    for product in products:
        # Create a unique key for grouping
        group_key = f"{product['category']}_{product['concept_name']}"
        groups[group_key].append(product)
    
    return groups

def create_unified_products(grouped_products):
    """Create unified product entries with proper front/back linking"""
    unified_products = []
    
    for group_key, products in grouped_products.items():
        if len(products) == 1:
            # Single product - keep as is but add product_id
            product = products[0]
            product['product_id'] = f"prod_{len(unified_products) + 1:03d}"
            product['images'] = [{
                'image_id': product['image_id'],
                'view': product['view'],
                'is_primary': True
            }]
            unified_products.append(product)
            
        else:
            # Multiple products with same concept - group them
            # Find the best representative (front view preferred, highest coolness score)
            primary_product = None
            front_views = [p for p in products if p['view'] == 'front']
            back_views = [p for p in products if p['view'] == 'back']
            
            if front_views:
                # Use front view with highest coolness score as primary
                primary_product = max(front_views, key=lambda x: x['visual_coolness_score'])
            else:
                # No front view, use back view with highest coolness score
                primary_product = max(products, key=lambda x: x['visual_coolness_score'])
            
            # Create unified product
            unified_product = primary_product.copy()
            unified_product['product_id'] = f"prod_{len(unified_products) + 1:03d}"
            
            # Create images array with all views
            images = []
            for product in products:
                images.append({
                    'image_id': product['image_id'],
                    'view': product['view'],
                    'is_primary': product['image_id'] == primary_product['image_id'],
                    'visual_coolness_score': product['visual_coolness_score'],
                    'hero_card_ready': product['hero_card_ready']
                })
            
            unified_product['images'] = images
            unified_product['total_views'] = len(images)
            unified_product['has_front_view'] = len(front_views) > 0
            unified_product['has_back_view'] = len(back_views) > 0
            
            # Use the best description and highest coolness score
            unified_product['visual_coolness_score'] = max(p['visual_coolness_score'] for p in products)
            unified_product['hero_card_ready'] = any(p['hero_card_ready'] for p in products)
            
            # Combine unique tags
            all_tags = set()
            for product in products:
                all_tags.update(product['tags'])
            unified_product['tags'] = sorted(list(all_tags))
            
            # Combine color palettes
            all_colors = {}
            for product in products:
                for color in product['palette']:
                    all_colors[color['name']] = color['hex']
            unified_product['palette'] = [{'name': name, 'hex': hex_val} for name, hex_val in all_colors.items()]
            
            unified_products.append(unified_product)
    
    return unified_products

def generate_product_stats(unified_products):
    """Generate statistics about the grouped products"""
    stats = {
        'total_products': len(unified_products),
        'products_with_multiple_views': 0,
        'products_with_front_and_back': 0,
        'products_with_front_only': 0,
        'products_with_back_only': 0,
        'categories': defaultdict(int),
        'avg_coolness_score': 0,
        'hero_card_ready_count': 0
    }
    
    total_coolness = 0
    
    for product in unified_products:
        # Count categories
        stats['categories'][product['category']] += 1
        
        # Count views
        if product.get('total_views', 1) > 1:
            stats['products_with_multiple_views'] += 1
            
        if product.get('has_front_view') and product.get('has_back_view'):
            stats['products_with_front_and_back'] += 1
        elif product.get('has_front_view'):
            stats['products_with_front_only'] += 1
        elif product.get('has_back_view'):
            stats['products_with_back_only'] += 1
            
        # Coolness and hero card stats
        total_coolness += product['visual_coolness_score']
        if product['hero_card_ready']:
            stats['hero_card_ready_count'] += 1
    
    stats['avg_coolness_score'] = total_coolness / len(unified_products) if unified_products else 0
    stats['categories'] = dict(stats['categories'])
    
    return stats

def main():
    # File paths
    input_file = 'out/ai_products.ndjson'
    output_file = 'out/grouped_products.json'
    stats_file = 'out/product_grouping_stats.json'
    
    print("🔄 Loading AI products...")
    products = load_ai_products(input_file)
    print(f"📊 Loaded {len(products)} individual product entries")
    
    print("🔗 Grouping products by concept...")
    grouped = group_products_by_concept(products)
    print(f"📦 Found {len(grouped)} unique product concepts")
    
    print("🎯 Creating unified product entries...")
    unified_products = create_unified_products(grouped)
    print(f"✅ Created {len(unified_products)} unified products")
    
    print("📈 Generating statistics...")
    stats = generate_product_stats(unified_products)
    
    # Add metadata
    output_data = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'total_original_entries': len(products),
            'total_unified_products': len(unified_products),
            'grouping_method': 'category_concept_name'
        },
        'statistics': stats,
        'products': unified_products
    }
    
    # Save unified products
    print(f"💾 Saving unified products to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    # Save stats separately
    print(f"📊 Saving statistics to {stats_file}...")
    with open(stats_file, 'w', encoding='utf-8') as f:
        json.dump({
            'metadata': output_data['metadata'],
            'statistics': stats
        }, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("\n" + "="*50)
    print("📋 PRODUCT GROUPING SUMMARY")
    print("="*50)
    print(f"Original entries: {len(products)}")
    print(f"Unified products: {len(unified_products)}")
    print(f"Products with multiple views: {stats['products_with_multiple_views']}")
    print(f"Products with front & back: {stats['products_with_front_and_back']}")
    print(f"Average coolness score: {stats['avg_coolness_score']:.2f}")
    print(f"Hero card ready: {stats['hero_card_ready_count']}")
    print("\nCategories:")
    for category, count in stats['categories'].items():
        print(f"  {category}: {count}")
    print("\n✅ Product grouping completed successfully!")

if __name__ == '__main__':
    main()