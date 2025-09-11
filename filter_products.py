#!/usr/bin/env python3
import json
import os

def filter_products():
    """Remove unwanted products from comprehensive_products.json"""
    
    # Read the current products file
    products_file = '/app/frontend/public/comprehensive_products.json'
    
    with open(products_file, 'r') as f:
        data = json.load(f)
    
    # Filter out unwanted products
    original_count = len(data['products'])
    
    # Remove products with unwanted titles (only the hoodies, keep tees and posters)
    filtered_products = []
    removed_products = []
    
    for product in data['products']:
        title = product.get('title', '')
        category = product.get('category', '')
        
        # Remove ONLY the specific hoodies mentioned
        if (category == 'hoodie' and 
            ('Cinder Fade' in title or 'Smoke Trail' in title)):
            removed_products.append(title)
            print(f"🗑️ Removing: {title}")
        else:
            filtered_products.append(product)
    
    # Update the data
    data['products'] = filtered_products
    data['metadata']['total_products'] = len(filtered_products)
    data['metadata']['updated_at'] = '2025-09-11T22:05:00.000000'
    data['metadata']['filter_applied'] = 'removed_unwanted_hoodies'
    data['metadata']['removed_products'] = len(removed_products)
    
    # Write back to file
    with open(products_file, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Products filtered successfully!")
    print(f"📊 Original count: {original_count}")
    print(f"📊 New count: {len(filtered_products)}")
    print(f"🗑️ Removed: {len(removed_products)} unwanted hoodies")
    
    for removed in removed_products:
        print(f"   - {removed}")

if __name__ == "__main__":
    filter_products()