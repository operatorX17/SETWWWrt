#!/usr/bin/env python3
"""
Test Shopify Storefront API to see if products are accessible
"""
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

def test_storefront_api():
    """Test if we can fetch products via Storefront API"""
    
    store_domain = os.getenv('REACT_APP_SHOPIFY_STORE_DOMAIN')
    access_token = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN')
    api_version = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_VERSION')
    
    print(f"🔧 Testing Storefront API...")
    print(f"📍 Store: {store_domain}")
    print(f"🔑 Token: {access_token[:8]}...{access_token[-4:]}")
    print(f"📅 Version: {api_version}")
    
    graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"
    
    # Simple products query
    query = """
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            publishedAt
            tags
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
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
            json={'query': query},
            headers=headers,
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if 'errors' in data:
                print(f"❌ GraphQL Errors: {data['errors']}")
                return False
            
            products = data.get('data', {}).get('products', {}).get('edges', [])
            print(f"✅ Found {len(products)} products via Storefront API")
            
            # Show first few products
            for i, edge in enumerate(products[:5]):
                product = edge['node']
                print(f"  {i+1}. {product['title']} (Handle: {product['handle']})")
                print(f"     Status: Published" if product.get('publishedAt') else "     Status: Draft/Unpublished")
                print(f"     Price: {product['priceRange']['minVariantPrice']['amount']} {product['priceRange']['minVariantPrice']['currencyCode']}")
                
            if len(products) == 0:
                print("⚠️ No products found! This might be why the frontend shows 'No products found'")
                return False
            else:
                print("🎯 Products are accessible via Storefront API!")
                return True
                
        else:
            print(f"❌ HTTP Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_storefront_api()
    if success:
        print("\n✅ Storefront API is working - check frontend implementation")
    else:
        print("\n❌ Storefront API issue detected - products may not be visible to customers")