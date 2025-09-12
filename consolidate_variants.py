#!/usr/bin/env python3
import json
from collections import defaultdict

def consolidate_product_variants():
    """Consolidate products with same concept/design into single products with color variants"""
    
    products_file = '/app/frontend/public/comprehensive_products.json'
    
    with open(products_file, 'r') as f:
        data = json.load(f)
    
    # Group products by concept and category
    concept_groups = defaultdict(lambda: defaultdict(list))
    
    for product in data['products']:
        concept = product.get('concept', '')
        category = product.get('category', 'unknown')
        if concept:
            # Group by concept + category (so shirts, hoodies, tees are separate)
            key = f"{concept}_{category}"
            concept_groups[concept][category].append(product)
    
    consolidated_products = []
    removed_count = 0
    
    for concept, categories in concept_groups.items():
        for category, products in categories.items():
            if len(products) > 1:
                # Consolidate multiple variants into one product
                base_product = products[0].copy()  # Use first product as base
                
                # Create variants array
                variants = []
                images_by_color = {}
                
                for product in products:
                    colorway = product.get('colorway', 'Default')
                    variant = {
                        'color': colorway,
                        'price': int(product.get('price', 0)),
                        'compare_at_price': int(product.get('compare_at_price', 0)) if product.get('compare_at_price') else None,
                        'images': product.get('images', []),
                        'primaryImage': product.get('primaryImage', ''),
                        'scene_code': product.get('scene_code', ''),
                        'original_id': product.get('id', '')
                    }
                    variants.append(variant)
                    
                    # Store images by color for easy access
                    images_by_color[colorway] = {
                        'images': product.get('images', []),
                        'primaryImage': product.get('primaryImage', '')
                    }
                
                # Update base product with variants
                base_product['variants'] = variants
                base_product['images_by_color'] = images_by_color
                base_product['hasVariants'] = True
                base_product['defaultColor'] = variants[0]['color']
                
                # Use the lowest price as the starting price
                min_price = min(v['price'] for v in variants)
                max_price = max(v['price'] for v in variants)
                base_product['price'] = str(min_price)
                if min_price != max_price:
                    base_product['price_range'] = f"₹{min_price} - ₹{max_price}"
                
                # Update title to be more generic (remove scene codes for variants)
                base_title = base_product['title'].split('[')[0].strip()  # Remove scene code
                base_product['title'] = base_title
                base_product['variant_count'] = len(variants)
                
                # Use images from first variant as default
                base_product['images'] = variants[0]['images']
                base_product['primaryImage'] = variants[0]['primaryImage']
                
                consolidated_products.append(base_product)
                removed_count += len(products) - 1
                
                print(f"✅ Consolidated '{concept}' {category}: {len(products)} variants → 1 product")
                for i, variant in enumerate(variants):
                    print(f"   Color {i+1}: {variant['color']} (₹{variant['price']})")
                    
            else:
                # Single product, keep as is
                consolidated_products.append(products[0])
    
    # Add any products without concepts
    for product in data['products']:
        if not product.get('concept'):
            consolidated_products.append(product)
    
    # Update the data
    data['products'] = consolidated_products
    data['metadata']['total_products'] = len(consolidated_products)
    data['metadata']['variants_consolidated'] = True
    data['metadata']['products_before_consolidation'] = len(data['products']) + removed_count
    data['metadata']['products_removed'] = removed_count
    data['metadata']['updated_at'] = '2025-09-12T03:35:00.000000'
    
    # Write back to file
    with open(products_file, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n🎉 CONSOLIDATION COMPLETE!")
    print(f"📊 Original products: {len(consolidated_products) + removed_count}")
    print(f"📊 Consolidated products: {len(consolidated_products)}")
    print(f"🗑️ Removed duplicates: {removed_count}")
    print(f"💎 Products with variants: {sum(1 for p in consolidated_products if p.get('hasVariants'))}")

if __name__ == "__main__":
    consolidate_product_variants()