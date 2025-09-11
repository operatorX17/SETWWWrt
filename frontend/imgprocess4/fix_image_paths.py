import json
import os

# Load the production catalog
with open('FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print("Fixing image paths for web deployment...")

# Fix image paths to be relative
for product in catalog['products']:
    if 'images' in product:
        # Convert absolute paths to relative paths
        if 'front' in product['images'] and product['images']['front']:
            front_path = product['images']['front']
            if 'PRODUCTS' in front_path:
                # Extract relative path starting from PRODUCTS
                relative_path = front_path.split('PRODUCTS')[1].lstrip('\\').lstrip('/')
                product['images']['front'] = f"PRODUCTS/{relative_path.replace(chr(92), '/')}"
        
        if 'back' in product['images'] and product['images']['back']:
            back_path = product['images']['back']
            if 'PRODUCTS' in back_path:
                # Extract relative path starting from PRODUCTS
                relative_path = back_path.split('PRODUCTS')[1].lstrip('\\').lstrip('/')
                product['images']['back'] = f"PRODUCTS/{relative_path.replace(chr(92), '/')}"

# Update hero section products
for hero_product in catalog.get('hero_section', []):
    if 'image_path' in hero_product and hero_product['image_path']:
        image_path = hero_product['image_path']
        if 'PRODUCTS' in image_path:
            relative_path = image_path.split('PRODUCTS')[1].lstrip('\\').lstrip('/')
            hero_product['image_path'] = f"PRODUCTS/{relative_path.replace(chr(92), '/')}"

# Save the updated catalog
with open('FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print("✅ Image paths fixed for web deployment!")
print("✅ All paths are now relative to the deployment folder")
print("✅ Ready for web development integration")

# Show sample of fixed paths
print("\nSample fixed image paths:")
for i, product in enumerate(catalog['products'][:3]):
    print(f"{i+1}. {product['title']}")
    print(f"   Front: {product['images']['front']}")
    print(f"   Back: {product['images']['back']}")
    print()