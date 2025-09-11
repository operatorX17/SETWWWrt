#!/usr/bin/env python3
"""
Optimized Product Display Algorithm for PSPK Fan Store

This script creates an optimized product ordering algorithm that:
1. Prioritizes high-conversion products (firestorm, gazes, vintage designs)
2. Reduces duplicates and distractions
3. Leverages fan psychology for maximum conversions
4. Creates hero sections for top performers
"""

import json
import re
from typing import List, Dict, Any
from datetime import datetime

class ProductDisplayOptimizer:
    def __init__(self):
        # High-conversion keywords based on fan psychology
        self.hero_keywords = {
            'firestorm': 10,  # Ultimate fan favorite
            'gaze': 9,        # Intense character moments
            'crimson': 8,     # Blood/action themes
            'fury': 8,        # Action intensity
            'veta': 7,        # Telugu fan connection
            'cheetah': 7,     # Character reference
            'katana': 6,      # Weapon/action appeal
            'storm': 6,       # Drama/intensity
            'blade': 6,       # Action appeal
            'og': 5           # Character identity
        }
        
        # Category priority for display
        self.category_priority = {
            'Hoodie': 10,     # Premium items first
            'Tee': 8,         # Core merchandise
            'Cap': 6          # Accessories
        }
        
        # Badge priority (exclusivity drives sales)
        self.badge_priority = {
            'Vault Exclusive': 10,
            'Rebel Drop': 8,
            'Limited Edition': 9,
            'Fan Favorite': 7
        }

    def calculate_conversion_score(self, product: Dict[str, Any]) -> float:
        """
        Calculate conversion probability score based on multiple factors
        """
        score = 0.0
        
        # Base visual coolness score (0.8-1.0 range)
        visual_score = product.get('visual_coolness_score', 0.5)
        score += visual_score * 30  # 30% weight
        
        # Hero card readiness (conversion-optimized)
        if product.get('hero_card_ready', False):
            score += 15
        
        # Concept name appeal (fan psychology)
        concept_name = product.get('concept_name', '').lower()
        for keyword, weight in self.hero_keywords.items():
            if keyword in concept_name:
                score += weight * 2  # High weight for concept appeal
        
        # Category priority
        category = product.get('category', '')
        score += self.category_priority.get(category, 0)
        
        # Badge exclusivity
        badge = product.get('badge', '')
        score += self.badge_priority.get(badge, 0)
        
        # Multiple views bonus (complete product showcase)
        total_views = product.get('total_views', 1)
        if total_views > 1:
            score += 5 * (total_views - 1)
        
        # Color psychology (red/blood themes perform well)
        palette = product.get('palette', [])
        for color in palette:
            color_name = color.get('name', '').lower()
            if any(keyword in color_name for keyword in ['blood', 'red', 'crimson']):
                score += 8
            elif any(keyword in color_name for keyword in ['gold', 'brass']):
                score += 6
        
        # Description intensity (emotional connection)
        description = product.get('description', '').lower()
        intensity_words = ['veta', 'raktham', 'fury', 'storm', 'fire', 'blade', 'hunt']
        for word in intensity_words:
            if word in description:
                score += 3
        
        return min(score, 100)  # Cap at 100

    def create_hero_section(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Create hero section with top 6 conversion products
        """
        # Sort by conversion score
        sorted_products = sorted(products, 
                               key=lambda p: self.calculate_conversion_score(p), 
                               reverse=True)
        
        # Select top performers with diversity
        hero_products = []
        used_concepts = set()
        used_categories = {}
        
        for product in sorted_products:
            concept = product.get('concept_name', '')
            category = product.get('category', '')
            
            # Avoid exact duplicates
            if concept in used_concepts:
                continue
            
            # Limit per category for diversity
            if used_categories.get(category, 0) >= 3:
                continue
            
            # Must be high quality
            if product.get('visual_coolness_score', 0) < 0.8:
                continue
            
            hero_products.append(product)
            used_concepts.add(concept)
            used_categories[category] = used_categories.get(category, 0) + 1
            
            if len(hero_products) >= 6:
                break
        
        return hero_products

    def organize_by_categories(self, products: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """
        Organize remaining products by category with smart sorting
        """
        categories = {}
        
        for product in products:
            category = product.get('category', 'Other')
            if category not in categories:
                categories[category] = []
            categories[category].append(product)
        
        # Sort each category by conversion score
        for category in categories:
            categories[category].sort(
                key=lambda p: self.calculate_conversion_score(p), 
                reverse=True
            )
        
        return categories

    def remove_low_performers(self, products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Filter out products that may distract from conversions
        """
        filtered = []
        
        for product in products:
            # Remove if visual score too low
            if product.get('visual_coolness_score', 0) < 0.75:
                continue
            
            # Remove if not hero card ready and low appeal
            if not product.get('hero_card_ready', False):
                concept_score = 0
                concept_name = product.get('concept_name', '').lower()
                for keyword in self.hero_keywords:
                    if keyword in concept_name:
                        concept_score += self.hero_keywords[keyword]
                
                if concept_score < 5:
                    continue
            
            filtered.append(product)
        
        return filtered

    def optimize_display_order(self, products_file: str) -> Dict[str, Any]:
        """
        Main optimization function
        """
        # Load products
        with open(products_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        products = data.get('products', [])
        
        print(f"Starting optimization with {len(products)} products...")
        
        # Remove low performers
        filtered_products = self.remove_low_performers(products)
        print(f"After filtering: {len(filtered_products)} products")
        
        # Create hero section
        hero_products = self.create_hero_section(filtered_products)
        print(f"Hero section: {len(hero_products)} products")
        
        # Remove hero products from main list
        hero_concepts = {p.get('concept_name') for p in hero_products}
        remaining_products = [p for p in filtered_products 
                            if p.get('concept_name') not in hero_concepts]
        
        # Organize remaining by category
        categorized = self.organize_by_categories(remaining_products)
        
        # Calculate statistics
        total_conversion_score = sum(self.calculate_conversion_score(p) for p in filtered_products)
        avg_conversion_score = total_conversion_score / len(filtered_products) if filtered_products else 0
        
        # Create optimized structure
        optimized_data = {
            'optimization_metadata': {
                'generated_at': datetime.now().isoformat(),
                'algorithm_version': '1.0',
                'optimization_focus': 'fan_psychology_conversion',
                'original_products': len(products),
                'optimized_products': len(filtered_products),
                'hero_products': len(hero_products),
                'avg_conversion_score': round(avg_conversion_score, 2)
            },
            'hero_section': {
                'title': 'Fan Favorites - Ultimate Collection',
                'description': 'The most intense designs that true fans crave',
                'products': hero_products
            },
            'categories': {}
        }
        
        # Add categorized products in priority order
        category_order = ['Hoodie', 'Tee', 'Cap']
        for category in category_order:
            if category in categorized:
                optimized_data['categories'][category] = {
                    'title': f'{category} Collection',
                    'products': categorized[category][:12]  # Limit per category
                }
        
        return optimized_data

def main():
    optimizer = ProductDisplayOptimizer()
    
    # Optimize the grouped products
    input_file = 'out/grouped_products.json'
    output_file = 'out/optimized_display.json'
    
    try:
        optimized_data = optimizer.optimize_display_order(input_file)
        
        # Save optimized display
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(optimized_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Optimization complete!")
        print(f"📁 Saved to: {output_file}")
        
        # Print summary
        meta = optimized_data['optimization_metadata']
        print(f"\n📊 OPTIMIZATION SUMMARY:")
        print(f"   Original products: {meta['original_products']}")
        print(f"   Optimized products: {meta['optimized_products']}")
        print(f"   Hero products: {meta['hero_products']}")
        print(f"   Avg conversion score: {meta['avg_conversion_score']}")
        
        print(f"\n🔥 HERO SECTION (Top Converters):")
        for i, product in enumerate(optimized_data['hero_section']['products'], 1):
            score = optimizer.calculate_conversion_score(product)
            print(f"   {i}. {product['concept_name']} ({product['category']}) - Score: {score:.1f}")
        
        print(f"\n📈 CONVERSION OPTIMIZATION TIPS FOR WEB DEV:")
        print(f"   1. Place hero section at top of homepage")
        print(f"   2. Use larger images for hero products")
        print(f"   3. Add 'Limited Edition' badges to create urgency")
        print(f"   4. Implement 'Recently Viewed' for returning visitors")
        print(f"   5. Use red/crimson color themes in CTAs")
        print(f"   6. Add Telugu phrases in product descriptions")
        print(f"   7. Create bundles with firestorm + gaze themes")
        
    except Exception as e:
        print(f"❌ Error during optimization: {e}")

# Fix product classification for posters and tees
def fix_product_classification(product):
    if product['category'] == 'Tee' and 'poster' in product['tags']:
        product['category'] = 'Poster'
    return product

# Link front and back images
def link_images(product, front_folder, back_folder):
    product_id = product['handle_fragment']
    front_image = os.path.join(front_folder, f"{product_id}.jpeg")
    back_image = os.path.join(back_folder, f"{product_id}.jpeg")
    if os.path.exists(front_image):
        product['images'].append({'view': 'front', 'path': front_image})
    if os.path.exists(back_image):
        product['images'].append({'view': 'back', 'path': back_image})
    return product

# Generate new product catalog
def generate_new_catalog(products, front_folder, back_folder):
    new_catalog = []
    for product in products:
        product = fix_product_classification(product)
        product = link_images(product, front_folder, back_folder)
        new_catalog.append(product)
    return new_catalog

# Main execution
if __name__ == "__main__":
    import os
    import json

    # Load existing products
    with open("c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\ai_products.ndjson", "r") as f:
        products = [json.loads(line) for line in f]

    # Define folders
    front_folder = "c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\front_view_designs"
    back_folder = "c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\back_view_designs"

    # Generate new catalog
    new_catalog = generate_new_catalog(products, front_folder, back_folder)

    # Save new catalog
    with open("c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\new_product_catalog.json", "w") as f:
        json.dump(new_catalog, f, indent=4)

    print("New product catalog generated successfully.")

if __name__ == '__main__':
    main()