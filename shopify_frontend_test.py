#!/usr/bin/env python3
"""
Shopify Frontend Integration Test
Tests the Shopify Storefront API connectivity from frontend configuration
"""

import requests
import json
import os
import sys
from dotenv import load_dotenv

def test_shopify_storefront_api():
    """Test direct connection to Shopify Storefront API"""
    print("🛍️  Testing Shopify Storefront API Connectivity...")
    print("=" * 60)
    
    # Load frontend environment variables
    load_dotenv('/app/frontend/.env')
    
    domain = os.getenv('REACT_APP_SHOPIFY_STORE_DOMAIN')
    token = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN')
    version = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_VERSION')
    
    if not all([domain, token, version]):
        print("❌ Missing Shopify configuration in frontend/.env")
        return False
    
    # Construct Shopify GraphQL endpoint
    shopify_endpoint = f"https://{domain}/api/{version}/graphql.json"
    
    print(f"🔗 Shopify Store: {domain}")
    print(f"🔗 API Endpoint: {shopify_endpoint}")
    print(f"🔗 API Version: {version}")
    
    # Simple GraphQL query to test connectivity
    query = """
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
        'X-Shopify-Storefront-Access-Token': token
    }
    
    try:
        print("\n🔍 Testing Shopify API connectivity...")
        response = requests.post(
            shopify_endpoint,
            json={'query': query},
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if 'errors' in data:
                print(f"❌ Shopify API returned errors: {data['errors']}")
                return False
            
            if 'data' in data and 'shop' in data['data']:
                shop_info = data['data']['shop']
                print(f"✅ Successfully connected to Shopify store!")
                print(f"   Store Name: {shop_info.get('name', 'N/A')}")
                print(f"   Description: {shop_info.get('description', 'N/A')}")
                print(f"   Domain: {shop_info.get('primaryDomain', {}).get('url', 'N/A')}")
                return True
            else:
                print(f"❌ Unexpected response structure: {data}")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {str(e)}")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_shopify_products_query():
    """Test fetching products from Shopify"""
    print("\n📦 Testing Shopify Products Query...")
    print("-" * 40)
    
    # Load frontend environment variables
    load_dotenv('/app/frontend/.env')
    
    domain = os.getenv('REACT_APP_SHOPIFY_STORE_DOMAIN')
    token = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN')
    version = os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_VERSION')
    
    shopify_endpoint = f"https://{domain}/api/{version}/graphql.json"
    
    # Products query (similar to what the frontend uses)
    query = """
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
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
                  altText
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
        'X-Shopify-Storefront-Access-Token': token
    }
    
    try:
        response = requests.post(
            shopify_endpoint,
            json={
                'query': query,
                'variables': {'first': 5}
            },
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if 'errors' in data:
                print(f"❌ Products query returned errors: {data['errors']}")
                return False
            
            if 'data' in data and 'products' in data['data']:
                products = data['data']['products']['edges']
                print(f"✅ Successfully fetched {len(products)} products from Shopify")
                
                for i, product_edge in enumerate(products[:3]):  # Show first 3 products
                    product = product_edge['node']
                    price = product['priceRange']['minVariantPrice']
                    print(f"   {i+1}. {product['title']} - {price['amount']} {price['currencyCode']}")
                
                return True
            else:
                print(f"❌ Unexpected products response: {data}")
                return False
        else:
            print(f"❌ Products query HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Products query error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Shopify Frontend Integration Tests...")
    print()
    
    # Test 1: Basic API connectivity
    api_test = test_shopify_storefront_api()
    
    # Test 2: Products query (only if basic connectivity works)
    products_test = False
    if api_test:
        products_test = test_shopify_products_query()
    
    # Summary
    print("\n" + "=" * 60)
    print("🏁 SHOPIFY FRONTEND INTEGRATION TEST SUMMARY")
    print("=" * 60)
    
    if api_test and products_test:
        print("🎉 ✅ SHOPIFY INTEGRATION FULLY FUNCTIONAL")
        print("   - API connectivity working")
        print("   - Products can be fetched successfully")
        print("   - Frontend configuration is correct")
        success = True
    elif api_test:
        print("⚠️  🟡 SHOPIFY INTEGRATION PARTIALLY WORKING")
        print("   - API connectivity working")
        print("   - Products query failed")
        success = False
    else:
        print("❌ 🔴 SHOPIFY INTEGRATION NOT WORKING")
        print("   - API connectivity failed")
        success = False
    
    sys.exit(0 if success else 1)