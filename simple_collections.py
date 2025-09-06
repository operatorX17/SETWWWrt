#!/usr/bin/env python3
"""
Simple Collections Creator - Create basic manual collections
"""
import os
import requests
import time
from dotenv import load_dotenv

load_dotenv('/app/backend/.env')

class SimpleCollections:
    def __init__(self):
        self.shopify_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
        self.admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')
        
        self.base_url = f"https://{self.shopify_domain}/admin/api/2023-10"
        self.headers = {
            'X-Shopify-Access-Token': self.admin_api_key,
            'Content-Type': 'application/json'
        }

    def create_simple_collections(self):
        """Create simple manual collections"""
        collections = [
            {
                "title": "OG Tees Arsenal",
                "handle": "og-tees-arsenal",
                "description": "Premium OG T-shirts for true warriors"
            },
            {
                "title": "OG Hoodie Legion", 
                "handle": "og-hoodie-legion",
                "description": "Elite OG hoodies for fierce fans"
            },
            {
                "title": "OG Poster Command",
                "handle": "og-poster-command", 
                "description": "Cinematic OG posters for your space"
            },
            {
                "title": "Rebel Drops",
                "handle": "rebel-drops",
                "description": "Limited OG drops - act fast!"
            }
        ]
        
        for collection_data in collections:
            payload = {
                "collection": {
                    "title": collection_data["title"],
                    "handle": collection_data["handle"], 
                    "body_html": f"<p>{collection_data['description']}</p>",
                    "published": True
                }
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/collections.json",
                    headers=self.headers,
                    json=payload
                )
                
                if response.status_code == 201:
                    print(f"✅ Created: {collection_data['title']}")
                else:
                    print(f"❌ Failed: {collection_data['title']} - {response.text}")
                    
            except Exception as e:
                print(f"❌ Error: {collection_data['title']} - {str(e)}")
                
            time.sleep(0.5)

def main():
    creator = SimpleCollections()
    creator.create_simple_collections()

if __name__ == "__main__":
    main()