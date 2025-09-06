#!/usr/bin/env python3
"""
Publish products to Storefront API sales channel
"""
import os
import json
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

class StorefrontPublisher:
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

    def get_online_store_channel_id(self):
        """Get the Online Store sales channel ID"""
        try:
            response = requests.get(
                f"{self.base_url}/publications.json",
                headers=self.headers
            )
            
            if response.status_code == 200:
                publications = response.json().get('publications', [])
                
                # Look for Online Store channel
                for pub in publications:
                    if 'online' in pub.get('name', '').lower() or 'storefront' in pub.get('name', '').lower():
                        print(f"✅ Found Online Store channel: {pub['name']} (ID: {pub['id']})")
                        return pub['id']
                
                # If not found, return the first publication
                if publications:
                    first_pub = publications[0]
                    print(f"✅ Using first publication: {first_pub['name']} (ID: {first_pub['id']})")
                    return first_pub['id']
                    
                print("❌ No publications found")
                return None
            else:
                print(f"❌ Failed to get publications: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error getting publications: {str(e)}")
            return None

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

    def publish_product_to_storefront(self, product_id, publication_id):
        """Publish a single product to the storefront"""
        try:
            payload = {
                "product_publication": {
                    "product_id": product_id,
                    "publication_id": publication_id,
                    "published": True
                }
            }
            
            response = requests.post(
                f"{self.base_url}/products/{product_id}/product_publications.json",
                headers=self.headers,
                json=payload
            )
            
            if response.status_code in [200, 201]:
                return True
            else:
                # Product might already be published
                if "already exists" in response.text.lower():
                    return True
                print(f"❌ Failed to publish product {product_id}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error publishing product {product_id}: {str(e)}")
            return False

    def ensure_products_published_to_storefront(self):
        """Ensure all products are published to the storefront sales channel"""
        
        print("🔍 Getting sales channel information...")
        publication_id = self.get_online_store_channel_id()
        
        if not publication_id:
            print("❌ Could not find storefront sales channel")
            return False
            
        print(f"📊 Getting all products...")
        products = self.get_all_products()
        
        if not products:
            print("❌ No products found!")
            return False
            
        print(f"📋 Found {len(products)} products to publish to storefront")
        
        published_count = 0
        failed_count = 0
        
        for product in products:
            product_id = product['id']
            product_title = product['title']
            
            print(f"  📤 Publishing: {product_title}")
            
            if self.publish_product_to_storefront(product_id, publication_id):
                published_count += 1
                print(f"  ✅ Published: {product_title}")
            else:
                failed_count += 1
                print(f"  ❌ Failed: {product_title}")
                
            time.sleep(0.3)  # Rate limiting
            
        print(f"\n📊 SUMMARY:")
        print(f"✅ Successfully published: {published_count}")
        print(f"❌ Failed to publish: {failed_count}")
        print(f"📱 Products should now be visible on Storefront API")
        
        return published_count > 0

def main():
    print("🔄 PUBLISHING PRODUCTS TO STOREFRONT API 🔄")
    print("=" * 60)
    
    try:
        publisher = StorefrontPublisher()
        success = publisher.ensure_products_published_to_storefront()
        
        if success:
            print("\n🎯 STOREFRONT PUBLISHING COMPLETE! 🎯")
            print("Products should now be visible on the frontend!")
        else:
            print("\n💀 STOREFRONT PUBLISHING FAILED! 💀")
            return False
            
    except Exception as e:
        print(f"💥 FATAL ERROR: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    main()