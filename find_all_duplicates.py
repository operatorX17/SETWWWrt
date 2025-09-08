#!/usr/bin/env python3
"""
Comprehensive duplicate finder across all product JSON files
"""

import json
import os
from collections import defaultdict
from typing import List, Dict, Set

def load_json_file(filepath: str) -> List[Dict]:
    """Load JSON file and return products list"""
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
                else:
                    print(f"Warning: {filepath} does not contain a list")
                    return []
        else:
            print(f"File not found: {filepath}")
            return []
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def normalize_product_name(name: str) -> str:
    """Normalize product name for comparison"""
    if not name:
        return ""
    return name.lower().strip().replace(" ", "").replace("-", "").replace("_", "")

def find_duplicates_across_files():
    """Find duplicates across all product JSON files"""
    
    # All product files used by the application
    product_files = [
        'frontend/public/products.json',
        'frontend/public/comprehensive_products.json', 
        'frontend/public/new_premium_hoodies.json',
        'frontend/public/comprehensive_products_backup.json',
        'frontend/public/simple_products.json'
    ]
    
    all_products = []
    file_sources = {}
    
    # Load all products from all files
    for filepath in product_files:
        products = load_json_file(filepath)
        print(f"Loaded {len(products)} products from {filepath}")
        
        for product in products:
            # Add source file info
            product['_source_file'] = filepath
            all_products.append(product)
            file_sources[filepath] = len(products)
    
    print(f"\nTotal products loaded: {len(all_products)}")
    print("\nFile breakdown:")
    for file, count in file_sources.items():
        print(f"  {file}: {count} products")
    
    # Find duplicates by different criteria
    duplicates_by_id = defaultdict(list)
    duplicates_by_name = defaultdict(list)
    duplicates_by_handle = defaultdict(list)
    
    for i, product in enumerate(all_products):
        # Group by ID
        if 'id' in product and product['id']:
            duplicates_by_id[str(product['id'])].append((i, product))
        
        # Group by normalized name
        if 'name' in product and product['name']:
            norm_name = normalize_product_name(product['name'])
            duplicates_by_name[norm_name].append((i, product))
        elif 'title' in product and product['title']:
            norm_name = normalize_product_name(product['title'])
            duplicates_by_name[norm_name].append((i, product))
        
        # Group by handle
        if 'handle' in product and product['handle']:
            duplicates_by_handle[product['handle']].append((i, product))
    
    # Report duplicates
    print("\n" + "="*60)
    print("DUPLICATE ANALYSIS RESULTS")
    print("="*60)
    
    # ID duplicates
    id_duplicates = {k: v for k, v in duplicates_by_id.items() if len(v) > 1}
    print(f"\n🔍 DUPLICATES BY ID: {len(id_duplicates)} groups")
    for product_id, products in id_duplicates.items():
        print(f"\n  ID {product_id}: {len(products)} occurrences")
        for i, (idx, product) in enumerate(products):
            name = product.get('name') or product.get('title', 'Unknown')
            source = product.get('_source_file', 'Unknown')
            print(f"    {i+1}. {name} (from {source})")
    
    # Name duplicates
    name_duplicates = {k: v for k, v in duplicates_by_name.items() if len(v) > 1}
    print(f"\n🔍 DUPLICATES BY NAME: {len(name_duplicates)} groups")
    for norm_name, products in name_duplicates.items():
        if len(products) > 1:
            print(f"\n  Name '{norm_name}': {len(products)} occurrences")
            for i, (idx, product) in enumerate(products):
                actual_name = product.get('name') or product.get('title', 'Unknown')
                source = product.get('_source_file', 'Unknown')
                product_id = product.get('id', 'No ID')
                print(f"    {i+1}. '{actual_name}' (ID: {product_id}, from {source})")
    
    # Handle duplicates
    handle_duplicates = {k: v for k, v in duplicates_by_handle.items() if len(v) > 1}
    print(f"\n🔍 DUPLICATES BY HANDLE: {len(handle_duplicates)} groups")
    for handle, products in handle_duplicates.items():
        print(f"\n  Handle '{handle}': {len(products)} occurrences")
        for i, (idx, product) in enumerate(products):
            name = product.get('name') or product.get('title', 'Unknown')
            source = product.get('_source_file', 'Unknown')
            product_id = product.get('id', 'No ID')
            print(f"    {i+1}. {name} (ID: {product_id}, from {source})")
    
    # Summary
    total_duplicate_groups = len(id_duplicates) + len(name_duplicates) + len(handle_duplicates)
    print(f"\n" + "="*60)
    print(f"SUMMARY:")
    print(f"  Total products across all files: {len(all_products)}")
    print(f"  Duplicate groups by ID: {len(id_duplicates)}")
    print(f"  Duplicate groups by name: {len(name_duplicates)}")
    print(f"  Duplicate groups by handle: {len(handle_duplicates)}")
    print(f"  Total duplicate issues: {total_duplicate_groups}")
    
    if total_duplicate_groups > 0:
        print(f"\n⚠️  DUPLICATES FOUND! This explains why the user sees duplicate products.")
        print(f"   The useProducts hook loads from multiple files and combines them,")
        print(f"   causing the same products to appear multiple times.")
    else:
        print(f"\n✅ No duplicates found across files.")
    
    return {
        'id_duplicates': id_duplicates,
        'name_duplicates': name_duplicates, 
        'handle_duplicates': handle_duplicates,
        'total_products': len(all_products),
        'file_sources': file_sources
    }

if __name__ == "__main__":
    print("🔍 Analyzing duplicates across all product JSON files...")
    print("This will help identify why users see duplicate products.\n")
    
    results = find_duplicates_across_files()
    
    print(f"\n🎯 Analysis complete!")
    if results['id_duplicates'] or results['name_duplicates'] or results['handle_duplicates']:
        print(f"   Found duplicate issues that need to be resolved.")
    else:
        print(f"   No duplicates found - the issue might be elsewhere.")