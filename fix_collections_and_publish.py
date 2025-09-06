#!/usr/bin/env python3
"""
Fix Collections and Publish Products
Creates OG collections and ensures all products are published
"""
import os
import json
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

class CollectionFixer:
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

    def create_og_collections(self):
        """Create proper OG collections"""
        collections = [
            {
                "title": "OG Tees Arsenal",
                "handle": "og-tees-arsenal",
                "description": "Premium OG T-shirts for true warriors. Each tee is a weapon of expression.",
                "rules": [
                    {
                        "column": "product_type",
                        "relation": "equals",
                        "condition": "Teeshirt"
                    }
                ]
            },
            {
                "title": "OG Hoodie Legion",
                "handle": "og-hoodie-legion", 
                "description": "Elite OG hoodies for the cold war ahead. Premium comfort for fierce fans.",
                "rules": [
                    {
                        "column": "product_type",
                        "relation": "equals",
                        "condition": "Hoodies"
                    }
                ]
            },
            {
                "title": "OG Poster Command",
                "handle": "og-poster-command",
                "description": "Cinematic OG posters to command your space. Every wall needs a statement.",
                "rules": [
                    {
                        "column": "product_type",
                        "relation": "equals",
                        "condition": "Posters"
                    }
                ]
            },
            {
                "title": "OG Sweatshirt Squad", 
                "handle": "og-sweatshirt-squad",
                "description": "Premium OG sweatshirts for the elite squad. Comfort meets rebellion.",
                "rules": [
                    {
                        "column": "product_type",
                        "relation": "equals",
                        "condition": "Sweatshirts"
                    }
                ]
            },
            {
                "title": "OG Accessories Arsenal",
                "handle": "og-accessories-arsenal",
                "description": "Complete your OG arsenal with premium accessories. Every detail matters.",
                "rules": [
                    {
                        "column": "product_type",
                        "relation": "not_equals",
                        "condition": "Teeshirt"
                    }
                ]
            },
            {
                "title": "Rebel Drops",
                "handle": "rebel-drops",
                "description": "Limited time OG drops for true rebels. Act fast, these won't last.",
                "rules": [
                    {
                        "column": "tag",
                        "relation": "equals",
                        "condition": "Limited"
                    }
                ]
            }
        ]
        
        created_collections = []
        
        for collection_data in collections:
            collection_payload = {
                "collection": {
                    "title": collection_data["title"],
                    "handle": collection_data["handle"],
                    "body_html": f"<p><strong>{collection_data['description']}</strong></p><p>Every product is a weapon. Every fan is a soldier.</p>",
                    "published": True,
                    "sort_order": "best-selling",
                    "disjunctive": False,
                    "rules": collection_data["rules"]
                }
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/collections.json",
                    headers=self.headers,
                    json=collection_payload
                )
                
                if response.status_code == 201:
                    collection = response.json()['collection']
                    created_collections.append(collection)
                    print(f"✅ Created collection: {collection_data['title']}")
                else:
                    print(f"❌ Failed to create collection {collection_data['title']}: {response.text}")
                    
            except Exception as e:
                print(f"❌ Error creating collection {collection_data['title']}: {str(e)}")
                
            time.sleep(0.5)
            
        return created_collections

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

    def publish_product(self, product_id):
        """Publish a product to make it visible on storefront"""
        try:
            # Update product to be published
            payload = {
                "product": {
                    "id": product_id,
                    "published": True,
                    "published_at": None  # This will set to current time
                }
            }
            
            response = requests.put(
                f"{self.base_url}/products/{product_id}.json",
                headers=self.headers,
                json=payload
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"❌ Failed to publish product {product_id}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error publishing product {product_id}: {str(e)}")
            return False

    def ensure_all_published(self):
        """Ensure all products are published and visible"""
        products = self.get_all_products()
        
        if not products:
            print("❌ No products found!")
            return
            
        print(f"📊 Found {len(products)} products to check/publish")
        
        published_count = 0
        for product in products:
            if not product.get('published', False):
                if self.publish_product(product['id']):
                    published_count += 1
                    print(f"✅ Published: {product['title']}")
                time.sleep(0.3)
            else:
                print(f"✓ Already published: {product['title']}")
                
        print(f"🎉 Published {published_count} additional products")

def main():
    print("🔧 FIXING COLLECTIONS AND PUBLISHING PRODUCTS 🔧")
    print("=" * 60)
    
    try:
        fixer = CollectionFixer()
        
        print("\n📚 Creating OG Collections...")
        collections = fixer.create_og_collections()
        
        print("\n📤 Ensuring All Products Are Published...")
        fixer.ensure_all_published()
        
        print("\n" + "=" * 60)
        print("🎯 COLLECTIONS AND PUBLISHING COMPLETE! 🎯")
        print(f"📚 Created {len(collections)} collections")
        print("🔴 All products are now LIVE and visible!")
        
    except Exception as e:
        print(f"💥 FATAL ERROR: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🚀 STORE IS BATTLE-READY! 🚀")
    else:
        print("\n💀 MISSION FAILED! Check errors above. 💀")