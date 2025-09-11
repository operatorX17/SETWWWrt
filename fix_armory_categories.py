#!/usr/bin/env python3
"""
Fix ARMORY categories by updating products.json with proper badges and collections
to match the frontend filtering logic.
"""

import json
import os
from pathlib import Path

def fix_armory_categories():
    """Update products.json with proper ARMORY category mappings"""
    
    # File paths
    frontend_dir = Path("frontend")
    products_file = frontend_dir / "public" / "products.json"
    
    if not products_file.exists():
        print(f"❌ Products file not found: {products_file}")
        return False
    
    # Load current products
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Loaded {len(products)} products")
    
    # Category mappings for ARMORY filters
    category_mappings = {
        # REBELLION CORE - Core products with REBELLION CORE badge
        'rebellion-core': {
            'categories': ['Teeshirt', 'Tee Shirts', 'Tee'],
            'badge': 'REBELLION CORE',
            'collection': 'REBELLION CORE'
        },
        # PREMIUM COLLECTION - Premium hoodies and high-end items
        'premium': {
            'categories': ['Hoodies', 'Hoodie', 'Sweatshirts'],
            'badge': 'PREMIUM COLLECTION',
            'collection': 'PREMIUM COLLECTION'
        },
        # TACTICAL TEES - All tee shirts
        'tees': {
            'categories': ['Teeshirt', 'Tee Shirts', 'Tee'],
            'badge': 'TACTICAL TEES',
            'collection': 'TACTICAL ARSENAL'
        },
        # BATTLE HOODIES - All hoodies
        'hoodies': {
            'categories': ['Hoodies', 'Hoodie', 'Sweatshirts'],
            'badge': 'BATTLE HOODIES',
            'collection': 'BATTLE GEAR'
        },
        # GEAR & ARSENAL - Accessories
        'accessories': {
            'categories': ['Accessories', 'Wallet', 'Cap', 'Caps', 'Slides', 'Bands'],
            'badge': 'GEAR & ARSENAL',
            'collection': 'GEAR ARSENAL'
        },
        # WAR POSTERS - Posters
        'posters': {
            'categories': ['Posters', 'Poster'],
            'badge': 'WAR POSTERS',
            'collection': 'WAR COLLECTION'
        },
        # VAULT EXCLUSIVE - Special vault items
        'vault': {
            'categories': ['Vault'],
            'badge': 'VAULT EXCLUSIVE',
            'collection': 'VAULT COLLECTION'
        }
    }
    
    updated_count = 0
    
    # Update each product
    for product in products:
        category = product.get('category', '').strip()
        original_badges = product.get('badges', [])
        
        # Ensure badges is a list
        if not isinstance(original_badges, list):
            original_badges = []
        
        # Find matching category mapping
        for filter_name, mapping in category_mappings.items():
            if category in mapping['categories']:
                # Add appropriate badge if not already present
                if mapping['badge'] not in original_badges:
                    original_badges.append(mapping['badge'])
                
                # Set collection
                product['collection'] = mapping['collection']
                
                # Special handling for VAULT products
                if filter_name == 'vault':
                    product['vault_locked'] = True
                    if 'VAULT' not in original_badges:
                        original_badges.append('VAULT')
                
                # Special handling for REBELLION CORE (first 10-15 tee products)
                if filter_name == 'rebellion-core' and category in ['Teeshirt', 'Tee Shirts', 'Tee']:
                    if updated_count < 12:  # Limit REBELLION CORE to first 12 tees
                        if 'REBELLION CORE' not in original_badges:
                            original_badges.append('REBELLION CORE')
                        product['collection'] = 'REBELLION CORE'
                
                # Special handling for PREMIUM COLLECTION (higher priced hoodies)
                if filter_name == 'premium' and category in ['Hoodies', 'Hoodie', 'Sweatshirts']:
                    price = product.get('price', 0)
                    if price > 1500:  # Premium items are higher priced
                        if 'PREMIUM COLLECTION' not in original_badges:
                            original_badges.append('PREMIUM COLLECTION')
                        product['collection'] = 'PREMIUM COLLECTION'
                
                updated_count += 1
                break
        
        # Update badges
        product['badges'] = original_badges
    
    # Save updated products
    with open(products_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Updated {updated_count} products with ARMORY categories")
    print(f"💾 Saved to {products_file}")
    
    # Show category distribution
    category_counts = {}
    collection_counts = {}
    badge_counts = {}
    
    for product in products:
        category = product.get('category', 'Unknown')
        collection = product.get('collection', 'No Collection')
        badges = product.get('badges', [])
        
        category_counts[category] = category_counts.get(category, 0) + 1
        collection_counts[collection] = collection_counts.get(collection, 0) + 1
        
        for badge in badges:
            badge_counts[badge] = badge_counts.get(badge, 0) + 1
    
    print("\n📊 Category Distribution:")
    for category, count in sorted(category_counts.items()):
        print(f"  {category}: {count}")
    
    print("\n🏷️ Collection Distribution:")
    for collection, count in sorted(collection_counts.items()):
        print(f"  {collection}: {count}")
    
    print("\n🎖️ Badge Distribution:")
    for badge, count in sorted(badge_counts.items()):
        print(f"  {badge}: {count}")
    
    return True

if __name__ == "__main__":
    print("🔧 Fixing ARMORY categories...")
    success = fix_armory_categories()
    if success:
        print("\n🎯 ARMORY categories fixed successfully!")
        print("\n📋 ARMORY filters now supported:")
        print("  • ALL ARSENAL (all products)")
        print("  • 🔒 VAULT EXCLUSIVE (vault_locked=true + VAULT badge)")
        print("  • REBELLION CORE (first 12 tees with REBELLION CORE badge)")
        print("  • PREMIUM COLLECTION (high-priced hoodies with PREMIUM badge)")
        print("  • TACTICAL TEES (all tees with TACTICAL TEES badge)")
        print("  • BATTLE HOODIES (all hoodies with BATTLE HOODIES badge)")
        print("  • GEAR & ARSENAL (accessories with GEAR & ARSENAL badge)")
        print("  • WAR POSTERS (posters with WAR POSTERS badge)")
    else:
        print("❌ Failed to fix ARMORY categories")