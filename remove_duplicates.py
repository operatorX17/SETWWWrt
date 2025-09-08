#!/usr/bin/env python3
"""
Duplicate Product Removal Script
Removes duplicate products from comprehensive_products.json based on name and handle
"""

import json
import os
from collections import defaultdict
from pathlib import Path

def load_products(file_path):
    """Load products from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error in {file_path}: {e}")
        return []

def find_duplicates(products):
    """Find duplicate products based on name and handle"""
    duplicates = {
        'by_name': defaultdict(list),
        'by_handle': defaultdict(list),
        'by_id': defaultdict(list)
    }
    
    for i, product in enumerate(products):
        name = product.get('name', '').strip().upper()
        handle = product.get('handle', '').strip().lower()
        product_id = str(product.get('id', '')).strip()
        
        if name:
            duplicates['by_name'][name].append((i, product))
        if handle:
            duplicates['by_handle'][handle].append((i, product))
        if product_id:
            duplicates['by_id'][product_id].append((i, product))
    
    return duplicates

def remove_duplicates(products):
    """Remove duplicate products, keeping the first occurrence"""
    seen_names = set()
    seen_handles = set()
    seen_ids = set()
    unique_products = []
    removed_count = 0
    
    for product in products:
        name = product.get('name', '').strip().upper()
        handle = product.get('handle', '').strip().lower()
        product_id = str(product.get('id', '')).strip()
        
        # Check for duplicates
        is_duplicate = False
        
        if name and name in seen_names:
            is_duplicate = True
            print(f"🔄 Removing duplicate by name: {product.get('name')}")
        elif handle and handle in seen_handles:
            is_duplicate = True
            print(f"🔄 Removing duplicate by handle: {product.get('handle')}")
        elif product_id and product_id in seen_ids:
            is_duplicate = True
            print(f"🔄 Removing duplicate by ID: {product.get('id')}")
        
        if not is_duplicate:
            unique_products.append(product)
            if name:
                seen_names.add(name)
            if handle:
                seen_handles.add(handle)
            if product_id:
                seen_ids.add(product_id)
        else:
            removed_count += 1
    
    return unique_products, removed_count

def analyze_duplicates(products):
    """Analyze and report duplicate products"""
    duplicates = find_duplicates(products)
    
    print("\n📊 DUPLICATE ANALYSIS:")
    
    # Name duplicates
    name_dups = {k: v for k, v in duplicates['by_name'].items() if len(v) > 1}
    if name_dups:
        print(f"\n🔄 Duplicate Names ({len(name_dups)} groups):")
        for name, items in name_dups.items():
            print(f"  '{name}': {len(items)} occurrences")
            for i, (idx, product) in enumerate(items[:3]):  # Show first 3
                print(f"    {i+1}. ID: {product.get('id')}, Handle: {product.get('handle')}")
            if len(items) > 3:
                print(f"    ... and {len(items) - 3} more")
    
    # Handle duplicates
    handle_dups = {k: v for k, v in duplicates['by_handle'].items() if len(v) > 1}
    if handle_dups:
        print(f"\n🔗 Duplicate Handles ({len(handle_dups)} groups):")
        for handle, items in handle_dups.items():
            print(f"  '{handle}': {len(items)} occurrences")
    
    # ID duplicates
    id_dups = {k: v for k, v in duplicates['by_id'].items() if len(v) > 1}
    if id_dups:
        print(f"\n🆔 Duplicate IDs ({len(id_dups)} groups):")
        for product_id, items in id_dups.items():
            print(f"  '{product_id}': {len(items)} occurrences")
    
    return len(name_dups) + len(handle_dups) + len(id_dups)

def main():
    """Main function to remove duplicates"""
    print("🔍 DUPLICATE PRODUCT REMOVAL TOOL")
    print("=" * 50)
    
    # File paths
    products_file = "frontend/public/products.json"
    backup_file = "frontend/public/products_backup_dedup.json"
    
    # Load products
    print(f"📂 Loading products from: {products_file}")
    products = load_products(products_file)
    
    if not products:
        print("❌ No products loaded. Exiting.")
        return
    
    print(f"📊 Total products loaded: {len(products)}")
    
    # Analyze duplicates
    duplicate_groups = analyze_duplicates(products)
    
    if duplicate_groups == 0:
        print("\n✅ No duplicates found!")
        return
    
    # Create backup
    print(f"\n💾 Creating backup: {backup_file}")
    with open(backup_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    # Remove duplicates
    print("\n🧹 Removing duplicates...")
    unique_products, removed_count = remove_duplicates(products)
    
    # Save cleaned products
    print(f"\n💾 Saving cleaned products to: {products_file}")
    with open(products_file, 'w', encoding='utf-8') as f:
        json.dump(unique_products, f, indent=2, ensure_ascii=False)
    
    # Summary
    print("\n📈 CLEANUP SUMMARY:")
    print(f"  Original products: {len(products)}")
    print(f"  Duplicates removed: {removed_count}")
    print(f"  Unique products: {len(unique_products)}")
    print(f"  Reduction: {removed_count / len(products) * 100:.1f}%")
    
    # Category breakdown
    categories = defaultdict(int)
    for product in unique_products:
        categories[product.get('category', 'Unknown')] += 1
    
    print("\n📂 CATEGORY BREAKDOWN:")
    for category, count in sorted(categories.items()):
        print(f"  {category}: {count} products")
    
    print(f"\n✅ Duplicate removal completed!")
    print(f"💾 Backup saved to: {backup_file}")

if __name__ == "__main__":
    main()