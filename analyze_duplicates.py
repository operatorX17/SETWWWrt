#!/usr/bin/env python3
"""
Duplicate Product Analysis and Cleanup Script
Analyzes all product files to identify and remove duplicates across sections
"""

import json
import os
from collections import defaultdict
from pathlib import Path

def load_json_file(filepath):
    """Load JSON file safely"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return []

def analyze_duplicates():
    """Analyze all product files for duplicates"""
    
    # Define file paths
    base_path = Path('frontend/public')
    product_files = {
        'main_products': base_path / 'products.json',
        'simple_products': base_path / 'simple_products.json', 
        'comprehensive_products': base_path / 'comprehensive_products.json'
    }
    
    # Load all products
    all_products = {}
    product_names = defaultdict(list)
    
    for file_type, filepath in product_files.items():
        if filepath.exists():
            products = load_json_file(filepath)
            all_products[file_type] = products
            
            # Track product names and their sources
            for product in products:
                name = product.get('name', '').strip().lower()
                if name:
                    product_names[name].append({
                        'file': file_type,
                        'id': product.get('id'),
                        'original_name': product.get('name'),
                        'category': product.get('category'),
                        'badges': product.get('badges', []),
                        'price': product.get('price')
                    })
    
    # Find duplicates
    duplicates = {}
    for name, instances in product_names.items():
        if len(instances) > 1:
            duplicates[name] = instances
    
    # Print analysis
    print("\n=== DUPLICATE PRODUCT ANALYSIS ===")
    print(f"Total unique product names: {len(product_names)}")
    print(f"Duplicate product names: {len(duplicates)}")
    
    if duplicates:
        print("\n=== DUPLICATES FOUND ===")
        for name, instances in duplicates.items():
            print(f"\n📦 Product: {instances[0]['original_name']}")
            for instance in instances:
                badges_str = ', '.join(instance['badges']) if instance['badges'] else 'No badges'
                print(f"  📁 {instance['file']}: ID={instance['id']}, Category={instance['category']}, Price=₹{instance['price']}, Badges=[{badges_str}]")
    
    return duplicates, all_products

def create_deduplication_strategy(duplicates, all_products):
    """Create strategy for removing duplicates"""
    
    strategy = {
        'keep_in_main': [],  # Products to keep in main products.json
        'keep_in_vault': [], # Products to keep in vault (comprehensive)
        'keep_in_simple': [], # Products to keep in simple
        'remove_completely': [] # Products to remove entirely
    }
    
    print("\n=== DEDUPLICATION STRATEGY ===")
    
    for name, instances in duplicates.items():
        # Strategy: 
        # 1. If product has VAULT badges -> keep in comprehensive_products only
        # 2. If product has PREMIUM badges -> keep in main products only  
        # 3. If product has REBEL/NEW badges -> keep in main products only
        # 4. Simple products should only contain basic items under ₹999
        
        vault_instance = None
        premium_instance = None
        rebel_instance = None
        simple_instance = None
        
        for instance in instances:
            badges = instance.get('badges', [])
            if any('VAULT' in str(badge).upper() for badge in badges):
                vault_instance = instance
            elif any('PREMIUM' in str(badge).upper() for badge in badges):
                premium_instance = instance
            elif any(badge in ['REBEL DROP', 'NEW', 'FAN ARSENAL'] for badge in badges):
                rebel_instance = instance
            elif instance['file'] == 'simple_products':
                simple_instance = instance
        
        # Decision logic
        if vault_instance:
            strategy['keep_in_vault'].append(vault_instance)
            print(f"✅ {instances[0]['original_name']} -> VAULT ONLY (has vault badges)")
        elif premium_instance:
            strategy['keep_in_main'].append(premium_instance)
            print(f"✅ {instances[0]['original_name']} -> MAIN ONLY (premium item)")
        elif rebel_instance:
            strategy['keep_in_main'].append(rebel_instance)
            print(f"✅ {instances[0]['original_name']} -> MAIN ONLY (rebel drop)")
        elif simple_instance and simple_instance['price'] <= 999:
            strategy['keep_in_simple'].append(simple_instance)
            print(f"✅ {instances[0]['original_name']} -> SIMPLE ONLY (under ₹999)")
        else:
            # Keep the first instance in main by default
            strategy['keep_in_main'].append(instances[0])
            print(f"✅ {instances[0]['original_name']} -> MAIN ONLY (default)")
    
    return strategy

def main():
    """Main execution"""
    print("🔍 Starting duplicate analysis...")
    
    duplicates, all_products = analyze_duplicates()
    
    if not duplicates:
        print("\n✅ No duplicates found! All products are unique.")
        return
    
    strategy = create_deduplication_strategy(duplicates, all_products)
    
    print(f"\n📊 SUMMARY:")
    print(f"  - Keep in MAIN: {len(strategy['keep_in_main'])} products")
    print(f"  - Keep in VAULT: {len(strategy['keep_in_vault'])} products") 
    print(f"  - Keep in SIMPLE: {len(strategy['keep_in_simple'])} products")
    print(f"  - Remove completely: {len(strategy['remove_completely'])} products")
    
    print("\n⚠️  Run cleanup script to apply changes.")
    
    return strategy

if __name__ == "__main__":
    main()