import json
import os
import glob
import random

# Load the current products.json
with open('public/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Function to get all available images by category
def get_available_images():
    base_path = "public/images/products"
    available_images = {
        'teeshirt': [],
        'hoodies': [],
        'posters': [],
        'hats': [],
        'wallet': [],
        'slippers': [],
        'Sweatshirts': []
    }
    
    # Helper function to process front/back structure
    def process_front_back_structure(category_path, category_name):
        dirs = glob.glob(f"{category_path}/*/")
        for dir_path in dirs:
            front_images = glob.glob(f"{dir_path}front/*.jpeg") + glob.glob(f"{dir_path}front/*.jpg")
            back_images = glob.glob(f"{dir_path}back/*.jpeg") + glob.glob(f"{dir_path}back/*.jpg")
            
            if front_images or back_images:
                image_set = {
                    'front': front_images[0].replace('public', '') if front_images else None,
                    'back': back_images[0].replace('public', '') if back_images else None
                }
                available_images[category_name].append(image_set)
    
    # T-shirts with front/back structure
    process_front_back_structure(f"{base_path}/teeshirt", 'teeshirt')
    
    # Hoodies with front/back structure
    process_front_back_structure(f"{base_path}/hoodies", 'hoodies')
    
    # Hats with front/back structure
    process_front_back_structure(f"{base_path}/hats", 'hats')
    
    # Slippers with front/back structure
    process_front_back_structure(f"{base_path}/slippers", 'slippers')
    
    # Sweatshirts with front/back structure
    process_front_back_structure(f"{base_path}/Sweatshirts", 'Sweatshirts')
    
    # Posters (single images)
    poster_dirs = glob.glob(f"{base_path}/posters/*/")
    for dir_path in poster_dirs:
        images_found = glob.glob(f"{dir_path}*.jpeg") + glob.glob(f"{dir_path}*.jpg")
        if images_found:
            available_images['posters'].append(images_found[0].replace('public', ''))
    
    # Wallets (single images)
    wallet_dirs = glob.glob(f"{base_path}/wallet/*/")
    for dir_path in wallet_dirs:
        images_found = glob.glob(f"{dir_path}*.jpeg") + glob.glob(f"{dir_path}*.jpg")
        if images_found:
            available_images['wallet'].append(images_found[0].replace('public', ''))
    
    return available_images

# Get all available images
available_images = get_available_images()

print("Available images by category:")
for category, images in available_images.items():
    print(f"{category}: {len(images)} image sets")

# Update products with available images
updated_count = 0
image_counters = {category: 0 for category in available_images.keys()}

for i, product in enumerate(products):
    category = product.get('category', '')
    product_name = product.get('name', '')
    
    # Map category names
    if category == 'tees':
        category = 'teeshirt'
    elif category == 'accessories' and 'cap' in product_name.lower():
        category = 'hats'
    elif category == 'accessories' and 'wallet' in product_name.lower():
        category = 'wallet'
    elif category == 'accessories' and 'slipper' in product_name.lower():
        category = 'slippers'
    elif category == 'hoodies' and 'sweatshirt' in product_name.lower():
        category = 'Sweatshirts'
    
    if category in available_images and available_images[category]:
        # Get next available image for this category
        if image_counters[category] < len(available_images[category]):
            image_data = available_images[category][image_counters[category]]
            image_counters[category] += 1
            
            if isinstance(image_data, dict):  # Front/back structure
                # For t-shirts, hoodies, and sweatshirts, prioritize back image as default
                if image_data['back'] and category in ['teeshirt', 'hoodies', 'Sweatshirts']:
                    product['images'] = [image_data['back']]
                    if image_data['front']:
                        product['images'].append(image_data['front'])
                    product['primary_image_type'] = 'back'
                elif image_data['front']:
                    product['images'] = [image_data['front']]
                    if image_data['back']:
                        product['images'].append(image_data['back'])
                    product['primary_image_type'] = 'front'
                elif image_data['back']:
                    product['images'] = [image_data['back']]
                    product['primary_image_type'] = 'back'
            else:  # Single image
                product['images'] = [image_data]
                product['primary_image_type'] = 'front'
            
            print(f"Updated {product['name']} with {len(product['images'])} image(s) from {category}")
            updated_count += 1
        else:
            print(f"No more images available for {product['name']} (category: {category})")
    else:
        print(f"No images found for category: {category} (product: {product['name']})")

# Save the updated products.json
with open('public/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f"\nImage update completed!")
print(f"Total products updated: {updated_count}/{len(products)}")
print(f"Products with back images as default: {len([p for p in products if p.get('primary_image_type') == 'back'])}")

# Show final image distribution
print("\nFinal image distribution:")
for category, count in image_counters.items():
    if count > 0:
        print(f"{category}: {count} images assigned")

# Show products that still need images
products_without_images = [p for p in products if not p.get('images')]
if products_without_images:
    print(f"\nProducts still without images: {len(products_without_images)}")
    for p in products_without_images:
        print(f"  - {p['name']} (category: {p.get('category', 'unknown')})")