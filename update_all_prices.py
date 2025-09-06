#!/usr/bin/env python3
import json
import os

def update_product_prices(file_path):
    """Update all products to have original prices (showing discounts)"""
    
    if not os.path.exists(file_path):
        print(f"File {file_path} not found")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    updated_count = 0
    
    for product in products:
        current_price = product.get('price', 0)
        original_price = product.get('originalPrice')
        
        # Only update if originalPrice is null or not set
        if original_price is None:
            # Calculate attractive original price based on current price
            if current_price <= 999:
                # For items under ₹999, add 40-60% markup
                new_original = int(current_price * 1.5)
            elif current_price <= 2499:
                # For items ₹999-2499, add 30-50% markup  
                new_original = int(current_price * 1.4)
            elif current_price <= 4999:
                # For premium items ₹2499-4999, add 25-40% markup
                new_original = int(current_price * 1.3)
            else:
                # For vault/ultra premium items, add 20-30% markup
                new_original = int(current_price * 1.25)
            
            # Round to nearest 99 for attractive pricing
            new_original = ((new_original // 100) * 100) + 99
            
            product['originalPrice'] = float(new_original)
            updated_count += 1
            print(f"Updated {product.get('name', 'Unknown')}: ₹{current_price} (was ₹{new_original})")
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Updated {updated_count} products in {file_path}")
    return updated_count

if __name__ == "__main__":
    print("🔥 UPDATING ALL PRODUCT PRICES WITH DISCOUNTS")
    print("=" * 50)
    
    # Update both product files
    files_to_update = [
        "/app/frontend/public/products.json",
        "/app/frontend/public/comprehensive_products.json"
    ]
    
    total_updated = 0
    for file_path in files_to_update:
        print(f"\n📁 Processing: {file_path}")
        count = update_product_prices(file_path)
        total_updated += count
    
    print(f"\n🎉 COMPLETE! Updated {total_updated} total products with discount pricing!")
    print("All products now show attractive original prices (crossed out) with current prices as discounts!")