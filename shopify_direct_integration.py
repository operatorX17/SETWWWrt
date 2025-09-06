#!/usr/bin/env python3
"""
Direct Shopify Integration for Frontend
Creates a simple endpoint to serve our OG products directly
"""
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

class ShopifyDirectAPI:
    def __init__(self):
        self.shopify_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
        self.admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')
        
        self.base_url = f"https://{self.shopify_domain}/admin/api/2023-10"
        self.headers = {
            'X-Shopify-Access-Token': self.admin_api_key,
            'Content-Type': 'application/json'
        }

    def get_all_products_formatted(self):
        """Get all products formatted for frontend consumption"""
        try:
            response = requests.get(
                f"{self.base_url}/products.json?limit=250",
                headers=self.headers
            )
            
            if response.status_code == 200:
                shopify_products = response.json().get('products', [])
                
                # Transform to frontend format
                formatted_products = []
                for product in shopify_products:
                    if product.get('status') == 'active':
                        formatted_product = self.transform_product(product)
                        formatted_products.append(formatted_product)
                
                return formatted_products
            else:
                print(f"❌ Failed to get products: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting products: {str(e)}")
            return []

    def transform_product(self, shopify_product):
        """Transform Shopify product to frontend format"""
        # Get first variant for pricing
        first_variant = shopify_product.get('variants', [{}])[0]
        
        # Generate badges based on tags and title
        badges = []
        tags = [tag.lower() for tag in shopify_product.get('tags', '').split(', ') if tag]
        title = shopify_product.get('title', '').lower()
        
        if 'og' in tags or 'og' in title:
            badges.extend(['NEW', 'REBEL DROP'])
        if 'premium' in tags or 'limited' in tags:
            badges.append('FAN ARSENAL')
        if 'hoodie' in title:
            badges.append('PREMIUM')
        
        # Ensure at least NEW badge for OG products
        if not badges and ('og' in title or any('og' in tag for tag in tags)):
            badges.append('NEW')
        
        return {
            "id": shopify_product['id'],
            "name": shopify_product['title'],
            "handle": shopify_product['handle'],
            "category": shopify_product.get('product_type', 'General'),
            "price": float(first_variant.get('price', '0')),
            "originalPrice": None,
            "badges": badges,
            "images": [img['src'] for img in shopify_product.get('images', [])],
            "description": shopify_product.get('body_html', '').replace('<p>', '').replace('</p>', ''),
            "tags": shopify_product.get('tags', '').split(', ') if shopify_product.get('tags') else [],
            "vendor": shopify_product.get('vendor', 'DVV Entertainment'),
            "variants": [
                {
                    "id": variant['id'],
                    "title": variant['title'],
                    "price": float(variant['price']),
                    "available": variant.get('inventory_quantity', 0) > 0
                }
                for variant in shopify_product.get('variants', [])
            ]
        }

    def generate_products_json(self):
        """Generate products.json file for frontend"""
        products = self.get_all_products_formatted()
        
        # Write to frontend public directory
        output_path = '/app/frontend/public/products.json'
        
        with open(output_path, 'w') as f:
            json.dump(products, f, indent=2)
        
        print(f"✅ Generated {output_path} with {len(products)} products")
        return products

def main():
    print("🔄 GENERATING DIRECT SHOPIFY INTEGRATION 🔄")
    print("=" * 60)
    
    try:
        api = ShopifyDirectAPI()
        products = api.generate_products_json()
        
        print(f"\n🎯 SUCCESS! Generated direct product integration")
        print(f"📊 Total products: {len(products)}")
        print(f"📁 File: /app/frontend/public/products.json")
        
        # Show sample products
        print("\n📋 Sample Products:")
        for product in products[:5]:
            print(f"  • {product['name']} - ₹{product['price']} - {product['badges']}")
        
        return True
        
    except Exception as e:
        print(f"💥 FATAL ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    main()