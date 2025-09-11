import json
import os

# Load the current products.json
with open('public/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Define the correct image paths based on the copied structure
image_mappings = {
    "city-skyline-tshirt": "/images/products/teeshirt/City Skyline/front/WhatsApp Image 2025-08-31 at 8.59.05 AM.jpeg",
    "og-hoodie-blood-drip-og": "/images/products/hoodies/product1/WhatsApp Image 2025-08-31 at 9.06.43 AM.jpeg",
    "og-sweatshirt-classic": "/images/products/Sweatshirts/product1/WhatsApp Image 2025-08-31 at 9.06.50 AM (1).jpeg",
    "og-cap-og-emblem": "/images/products/hats/product1/WhatsApp Image 2025-08-31 at 8.55.49 AM (2).jpeg",
    "og-wallet-leather-premium": "/images/products/wallet/product1/WhatsApp Image 2025-08-31 at 8.55.48 AM.jpeg",
    "og-slippers-comfort-series": "/images/products/slippers/product1/WhatsApp Image 2025-08-31 at 8.55.49 AM.jpeg",
    "premium-poster-collection-og-series": "/images/products/posters/product1/WhatsApp Image 2025-08-31 at 9.24.21 AM (4).jpeg",
    "rebellion-manifesto-poster": "/images/products/posters/product2/WhatsApp Image 2025-08-31 at 9.24.21 AM (2).jpeg",
    "beast-mode-artwork-poster": "/images/products/posters/product3/WhatsApp Image 2025-08-31 at 9.06.47 AM.jpeg"
}

# Update image paths for products
for product in products:
    product_id = product.get('id', '')
    if product_id in image_mappings:
        product['images'] = [image_mappings[product_id]]
        print(f"Updated image path for {product['name']}")

# Save the updated products.json
with open('public/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("\nImage paths updated successfully!")
print(f"Total products processed: {len(products)}")