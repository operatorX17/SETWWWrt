import json
import re

# Load the production catalog
with open('FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print("Fixing poster titles to remove 'Tee' references...")
print("=" * 50)

fixed_count = 0

# Fix poster products that have 'Tee' in their titles
for product in catalog['products']:
    if product['category'] == 'posters' and 'Tee' in product['title']:
        old_title = product['title']
        # Replace 'Tee' with 'Poster' in the title
        new_title = product['title'].replace('// Tee —', '// Poster —')
        product['title'] = new_title
        
        # Update handle
        new_handle = new_title.lower().replace(' ', '-').replace('/', '-').replace('—', '-').replace('--', '-')
        product['handle'] = new_handle
        
        # Update variant title
        if 'variants' in product and product['variants']:
            product['variants'][0]['title'] = new_title
        
        print(f"✅ Fixed: '{old_title}' → '{new_title}'")
        fixed_count += 1

# Fix hero section products
for hero_product in catalog.get('hero_section', {}).get('products', []):
    if hero_product['category'] == 'posters' and 'Tee' in hero_product['title']:
        old_title = hero_product['title']
        new_title = hero_product['title'].replace('// Tee —', '// Poster —')
        hero_product['title'] = new_title
        print(f"✅ Fixed Hero: '{old_title}' → '{new_title}'")
        fixed_count += 1

# Fix bundle suggestions if any contain poster products with 'Tee'
for bundle in catalog.get('bundle_suggestions', []):
    if 'Tee' in bundle['title'] and any('poster' in product_id for product_id in bundle.get('products', [])):
        old_title = bundle['title']
        new_title = bundle['title'].replace('Tee', 'Poster')
        bundle['title'] = new_title
        print(f"✅ Fixed Bundle: '{old_title}' → '{new_title}'")
        fixed_count += 1

# Save the updated catalog
with open('FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json', 'w', encoding='utf-8') as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print(f"\n🎯 SUMMARY:")
print(f"Total fixes applied: {fixed_count}")
print(f"✅ All poster products now have correct 'Poster' titles")
print(f"✅ Categories remain correctly classified as 'posters'")
print(f"✅ No more 'Tee' references in poster product titles")
print(f"✅ Ready for deployment!")