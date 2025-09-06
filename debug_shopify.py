#!/usr/bin/env python3
"""
Debug Shopify API connectivity
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load backend .env
load_dotenv('/app/backend/.env')

store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
access_token = os.getenv('SHOPIFY_STOREFRONT_API_TOKEN')
api_version = os.getenv('SHOPIFY_STOREFRONT_API_VERSION')

print(f"Store Domain: {store_domain}")
print(f"API Version: {api_version}")
print(f"Access Token: {access_token[:10]}...{access_token[-4:] if access_token else 'None'}")
print()

if not all([store_domain, access_token, api_version]):
    print("❌ Missing Shopify credentials")
    exit(1)

# Test 1: Simple shop query
print("=== Test 1: Simple Shop Query ===")
graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"

simple_query = """
{
    shop {
        name
        description
    }
}
"""

headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': access_token
}

try:
    response = requests.post(
        graphql_url,
        json={'query': simple_query},
        headers=headers,
        timeout=15
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()
    
    if response.status_code == 200:
        data = response.json()
        if 'errors' in data:
            print(f"GraphQL Errors: {data['errors']}")
        else:
            shop_data = data.get('data', {}).get('shop', {})
            print(f"Shop Name: {shop_data.get('name', 'Unknown')}")
            print(f"Shop Description: {shop_data.get('description', 'No description')}")
    
except Exception as e:
    print(f"Error: {str(e)}")

print()

# Test 2: Simple products query
print("=== Test 2: Simple Products Query ===")

products_query = """
{
    products(first: 10) {
        edges {
            node {
                id
                title
                handle
            }
        }
    }
}
"""

try:
    response = requests.post(
        graphql_url,
        json={'query': products_query},
        headers=headers,
        timeout=15
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    print()
    
    if response.status_code == 200:
        data = response.json()
        if 'errors' in data:
            print(f"GraphQL Errors: {data['errors']}")
        else:
            products = data.get('data', {}).get('products', {}).get('edges', [])
            print(f"Found {len(products)} products")
            for i, product_edge in enumerate(products[:5]):
                product = product_edge['node']
                print(f"  {i+1}. {product.get('title', 'Unknown')} (handle: {product.get('handle', 'unknown')})")
    
except Exception as e:
    print(f"Error: {str(e)}")

print()

# Test 3: Check if store is accessible via web
print("=== Test 3: Store Web Accessibility ===")
try:
    web_response = requests.get(f"https://{store_domain}", timeout=10)
    print(f"Web Status Code: {web_response.status_code}")
    if web_response.status_code == 200:
        print("✅ Store is accessible via web")
    else:
        print("❌ Store not accessible via web")
except Exception as e:
    print(f"Web access error: {str(e)}")