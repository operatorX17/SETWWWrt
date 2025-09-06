#!/usr/bin/env python3
"""
Cleanup Duplicate Products Script
Removes the duplicate Night Hunter Hoodie from comprehensive_products.json
"""

import json
import os
from pathlib import Path

def cleanup_duplicates():
    """Remove duplicate products based on analysis"""
    
    # Load comprehensive_products.json
    comp_file = Path('frontend/public/comprehensive_products.json')
    
    if not comp_file.exists():
        print("❌ comprehensive_products.json not found")
        return
    
    with open(comp_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Original comprehensive_products.json: {len(products)} products")
    
    # Remove Night Hunter Hoodie (ID: og-hoodie-001)
    original_count = len(products)
    products = [p for p in products if p.get('id') != 'og-hoodie-001']
    
    removed_count = original_count - len(products)
    
    if removed_count > 0:
        # Save cleaned file
        with open(comp_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Removed {removed_count} duplicate product(s)")
        print(f"📦 Updated comprehensive_products.json: {len(products)} products")
        print("\n🎯 DUPLICATE CLEANUP COMPLETE!")
        print("   - Night Hunter Hoodie kept in main products.json only")
        print("   - Removed duplicate from comprehensive_products.json")
    else:
        print("ℹ️  No duplicates found to remove")

def main():
    """Main execution"""
    print("🧹 Starting duplicate cleanup...")
    cleanup_duplicates()

if __name__ == "__main__":
    main()