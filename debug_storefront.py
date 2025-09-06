#!/usr/bin/env python3
"""
Debug Shopify Storefront API access
"""
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

def test_basic_storefront_access():
    """Test basic Storefront API access"""
    
    store_domain = os.getenv('REACT_APP_SHOPIFY_STORE_DOMAIN')
    access_token = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN')
    api_version = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_VERSION')
    
    print(f"🔧 Testing Storefront API Access...")
    print(f"📍 Store: {store_domain}")
    print(f"🔑 Token: {access_token[:8]}...{access_token[-4:]}")
    print(f"📅 Version: {api_version}")
    
    graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"
    
    # Test 1: Shop query (basic access test)
    print("\n🧪 Test 1: Shop Information")
    shop_query = """
    {
      shop {
        name
        description
        primaryDomain {
          url
        }
      }
    }
    """
    
    headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': access_token
    }
    
    try:
        response = requests.post(graphql_url, json={'query': shop_query}, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if 'errors' in data:
                print(f"❌ Shop Query Errors: {data['errors']}")
            else:
                shop = data.get('data', {}).get('shop', {})
                print(f"✅ Shop Name: {shop.get('name', 'Unknown')}")
                print(f"✅ Shop URL: {shop.get('primaryDomain', {}).get('url', 'Unknown')}")
        else:
            print(f"❌ Shop Query Failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Shop Query Error: {str(e)}")
        return False
    
    # Test 2: Simple products query
    print("\n🧪 Test 2: Products Query (Simple)")
    simple_products_query = """
    {
      products(first: 5) {
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
        response = requests.post(graphql_url, json={'query': simple_products_query}, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if 'errors' in data:
                print(f"❌ Products Query Errors: {data['errors']}")
                return False
            else:
                products = data.get('data', {}).get('products', {}).get('edges', [])
                print(f"✅ Found {len(products)} products")
                for edge in products:
                    product = edge['node']
                    print(f"   • {product['title']} (ID: {product['id']})")
                
                if len(products) == 0:
                    print("⚠️ No products returned by Storefront API")
                    return False
                else:
                    return True
        else:
            print(f"❌ Products Query Failed: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Products Query Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_basic_storefront_access()
    if success:
        print("\n✅ Storefront API is accessible and working!")
    else:
        print("\n❌ Storefront API access issue detected!")
        print("This explains why the frontend shows 'No products found'")
        print("\nPossible solutions:")
        print("1. Check Storefront API token permissions")
        print("2. Verify products are published to 'Online Store' sales channel")
        print("3. Check if store is password protected")
        print("4. Wait for product sync (can take a few minutes)")