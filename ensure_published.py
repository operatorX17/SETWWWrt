#!/usr/bin/env python3
"""
Ensure all products are published and available for storefront
"""
import os
import json
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

class ProductPublisher:
    def __init__(self):
        self.shopify_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
        self.admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')
        
        if not all([self.shopify_domain, self.admin_api_key]):
            raise ValueError("Missing Shopify credentials in environment")
            
        self.base_url = f"https://{self.shopify_domain}/admin/api/2023-10"
        self.headers = {
            'X-Shopify-Access-Token': self.admin_api_key,
            'Content-Type': 'application/json'
        }

    def get_all_products(self):
        """Get all products from the store"""
        try:
            response = requests.get(
                f"{self.base_url}/products.json?limit=250",
                headers=self.headers
            )
            
            if response.status_code == 200:
                return response.json().get('products', [])
            else:
                print(f"❌ Failed to get products: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting products: {str(e)}")
            return []

    def update_product_publication_status(self, product_id, product_title):
        """Update product to ensure it's published"""
        try:
            # Update the product to ensure it's published with all required fields
            payload = {
                "product": {
                    "id": product_id,
                    "published": True,
                    "status": "active",
                    "published_scope": "global"  # Make sure it's globally published
                }
            }
            
            response = requests.put(
                f"{self.base_url}/products/{product_id}.json",
                headers=self.headers,
                json=payload
            )
            
            if response.status_code == 200:
                print(f"  ✅ Updated: {product_title}")
                return True
            else:
                print(f"  ❌ Failed to update {product_title}: {response.text}")
                return False
                
        except Exception as e:
            print(f"  ❌ Error updating {product_title}: {str(e)}")
            return False

    def ensure_all_products_published(self):
        """Ensure all products are properly published"""
        
        print("📊 Getting all products...")
        products = self.get_all_products()
        
        if not products:
            print("❌ No products found!")
            return False
            
        print(f"📋 Found {len(products)} products to ensure published")
        
        updated_count = 0
        failed_count = 0
        
        for product in products:
            product_id = product['id']
            product_title = product['title']
            current_status = product.get('status', 'unknown')
            published = product.get('published', False)
            
            print(f"  🔍 Checking: {product_title} (Status: {current_status}, Published: {published})")
            
            # Always update to ensure proper publication
            if self.update_product_publication_status(product_id, product_title):
                updated_count += 1
            else:
                failed_count += 1
                
            time.sleep(0.5)  # Rate limiting
            
        print(f"\n📊 SUMMARY:")
        print(f"✅ Successfully updated: {updated_count}")
        print(f"❌ Failed to update: {failed_count}")
        
        return updated_count > 0

def main():
    print("🔄 ENSURING ALL PRODUCTS ARE PUBLISHED 🔄")
    print("=" * 60)
    
    try:
        publisher = ProductPublisher()
        success = publisher.ensure_all_products_published()
        
        if success:
            print("\n🎯 PRODUCT PUBLISHING COMPLETE! 🎯")
            print("Products should now be visible on storefront!")
        else:
            print("\n💀 PRODUCT PUBLISHING FAILED! 💀")
            return False
            
    except Exception as e:
        print(f"💥 FATAL ERROR: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    main()