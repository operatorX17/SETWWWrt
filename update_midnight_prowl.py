#!/usr/bin/env python3
import json

def update_midnight_prowl_image():
    """Update Midnight Prowl hoodie to show front image by default"""
    
    products_file = '/app/frontend/public/comprehensive_products.json'
    
    with open(products_file, 'r') as f:
        data = json.load(f)
    
    # Find and update the Midnight Prowl hoodie
    updated = False
    for product in data['products']:
        if product.get('id') == 'og-hoodie-midnight-prowl-scene-044':
            print(f"🎯 Found: {product['title']}")
            
            # Update to front image
            old_image = product.get('primaryImage', '')
            front_image = "/PRODUCTS/hoodies/product6/front/WhatsApp%20Image%202025-08-31%20at%209.06.50%20AM%20(1).jpeg"
            
            product['primaryImage'] = front_image
            product['showFrontFirst'] = True  # Add flag for front image priority
            
            # Also update the images array if it exists
            if 'images' in product:
                # Make sure front image is first in the array
                if isinstance(product['images'], list):
                    # Remove front image if it exists in the list
                    product['images'] = [img for img in product['images'] if 'front' not in img]
                    # Add front image at the beginning
                    product['images'].insert(0, front_image)
                elif isinstance(product['images'], dict):
                    product['images']['front'] = front_image
            else:
                # Create images array with front first
                product['images'] = [
                    front_image,
                    "/PRODUCTS/hoodies/product6/back/WhatsApp%20Image%202025-08-31%20at%209.06.49%20AM.jpeg"
                ]
            
            print(f"✅ Updated primaryImage:")
            print(f"   Old: {old_image}")
            print(f"   New: {front_image}")
            print(f"✅ Added showFrontFirst: True")
            
            updated = True
            break
    
    if updated:
        # Update metadata
        data['metadata']['updated_at'] = '2025-09-12T03:10:00.000000'
        data['metadata']['midnight_prowl_updated'] = True
        
        # Write back to file
        with open(products_file, 'w') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print("🎉 Midnight Prowl hoodie updated successfully!")
        print("   - Primary image now shows FRONT view")
        print("   - Added showFrontFirst flag for component logic")
    else:
        print("❌ Midnight Prowl hoodie not found")

if __name__ == "__main__":
    update_midnight_prowl_image()