#!/usr/bin/env python3
"""
Fix Duplicate Products in Comprehensive Products Catalog

This script identifies and removes duplicate products based on handle/id
to fix the repetition issue in FanArsenal and homepage sections.
"""

import json
import os
from collections import defaultdict

def load_products_catalog(file_path):
    """Load the comprehensive products catalog"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading catalog: {e}")
        return None

def find_duplicates(products):
    """Find duplicate products based on handle"""
    handle_count = defaultdict(list)
    
    for i, product in enumerate(products):
        handle = product.get('handle', '')
        if handle:
            handle_count[handle].append((i, product))
    
    duplicates = {}
    for handle, product_list in handle_count.items():
        if len(product_list) > 1:
            duplicates[handle] = product_list
    
    return duplicates

def remove_duplicates(products):
    """Remove duplicate products, keeping the first occurrence"""
    seen_handles = set()
    unique_products = []
    removed_count = 0
    
    for product in products:
        handle = product.get('handle', '')
        if handle and handle not in seen_handles:
            seen_handles.add(handle)
            unique_products.append(product)
        elif handle in seen_handles:
            removed_count += 1
            print(f"Removed duplicate: {product.get('title', 'Unknown')} (handle: {handle})")
        else:
            # Products without handles - keep them
            unique_products.append(product)
    
    return unique_products, removed_count

def update_metadata(catalog, original_count, new_count):
    """Update metadata with new product count"""
    if 'metadata' in catalog:
        catalog['metadata']['total_products'] = new_count
        catalog['metadata']['duplicates_removed'] = original_count - new_count
        catalog['metadata']['last_updated'] = "2025-01-11T00:00:00Z"
        catalog['metadata']['status'] = "DUPLICATES_CLEANED"
    
    if 'conversion_optimization' in catalog:
        # Recalculate bestsellers and trending counts
        bestsellers = sum(1 for p in catalog['products'] 
                         if p.get('conversion_data', {}).get('is_bestseller', False))
        trending = sum(1 for p in catalog['products'] 
                      if p.get('conversion_data', {}).get('is_trending', False))
        
        catalog['conversion_optimization']['bestsellers_count'] = bestsellers
        catalog['conversion_optimization']['trending_count'] = trending

def main():
    # File paths
    input_file = 'frontend/public/comprehensive_products.json'
    backup_file = 'frontend/public/comprehensive_products_backup_duplicates.json'
    
    print("🔍 Analyzing duplicate products in catalog...")
    
    # Load catalog
    catalog = load_products_catalog(input_file)
    if not catalog:
        return
    
    products = catalog.get('products', [])
    original_count = len(products)
    
    print(f"📊 Original product count: {original_count}")
    
    # Find duplicates
    duplicates = find_duplicates(products)
    
    if duplicates:
        print(f"\n🚨 Found {len(duplicates)} duplicate handles:")
        for handle, product_list in duplicates.items():
            print(f"  - {handle}: {len(product_list)} occurrences")
            for i, (index, product) in enumerate(product_list):
                print(f"    {i+1}. {product.get('title', 'Unknown')} (index: {index})")
    else:
        print("✅ No duplicates found!")
        return
    
    # Create backup
    print(f"\n💾 Creating backup: {backup_file}")
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    
    # Remove duplicates
    print("\n🧹 Removing duplicates...")
    unique_products, removed_count = remove_duplicates(products)
    
    # Update catalog
    catalog['products'] = unique_products
    update_metadata(catalog, original_count, len(unique_products))
    
    # Save cleaned catalog
    print(f"\n💾 Saving cleaned catalog...")
    with open(input_file, 'w', encoding='utf-8') as f:
        json.dump(catalog, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Cleanup complete!")
    print(f"   - Original products: {original_count}")
    print(f"   - Duplicates removed: {removed_count}")
    print(f"   - Final products: {len(unique_products)}")
    print(f"   - Backup saved: {backup_file}")
    
    # Verify no duplicates remain
    remaining_duplicates = find_duplicates(unique_products)
    if remaining_duplicates:
        print(f"\n⚠️  Warning: {len(remaining_duplicates)} duplicates still remain!")
    else:
        print("\n🎉 All duplicates successfully removed!")

if __name__ == "__main__":
    main()