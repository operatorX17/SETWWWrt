#!/usr/bin/env python3
"""
Debug Shopify Admin API to check products
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load backend .env
load_dotenv('/app/backend/.env')

store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')

print(f"Store Domain: {store_domain}")
print(f"Admin API Key: {admin_api_key[:15]}...{admin_api_key[-4:] if admin_api_key else 'None'}")
print()

if not all([store_domain, admin_api_key]):
    print("❌ Missing Shopify Admin API credentials")
    exit(1)

# Test Admin API - Get products
print("=== Admin API: Get Products ===")
admin_url = f"https://{store_domain}/admin/api/2024-01/products.json"

headers = {
    'X-Shopify-Access-Token': admin_api_key,
    'Content-Type': 'application/json'
}

try:
    response = requests.get(admin_url, headers=headers, timeout=15)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        products = data.get('products', [])
        print(f"Found {len(products)} products via Admin API")
        
        og_products = []
        for product in products[:10]:  # Show first 10
            title = product.get('title', 'Unknown')
            status = product.get('status', 'unknown')
            published_scope = product.get('published_scope', 'unknown')
            
            print(f"  - {title} (status: {status}, scope: {published_scope})")
            
            # Check if it's an OG product
            if any(keyword in title for keyword in ['OG', 'Death', 'War', 'Rebel', 'Stalker', 'Machine']):
                og_products.append(title)
        
        print(f"\nOG Products found: {len(og_products)}")
        for og_title in og_products[:5]:
            print(f"  - {og_title}")
            
    else:
        print(f"Error Response: {response.text}")
    
except Exception as e:
    print(f"Error: {str(e)}")

print()

# Test Admin API - Get products count
print("=== Admin API: Get Products Count ===")
count_url = f"https://{store_domain}/admin/api/2024-01/products/count.json"

try:
    response = requests.get(count_url, headers=headers, timeout=15)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        count = data.get('count', 0)
        print(f"Total products in store: {count}")
    else:
        print(f"Error Response: {response.text}")
    
except Exception as e:
    print(f"Error: {str(e)}")