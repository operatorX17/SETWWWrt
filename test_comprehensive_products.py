#!/usr/bin/env python3
"""
Test comprehensive_products.json accessibility and structure
"""

import requests
import json

def test_comprehensive_products():
    """Test that comprehensive_products.json is accessible and has 57 products"""
    try:
        # Test access via frontend URL
        frontend_url = "http://localhost:3000"
        products_url = f"{frontend_url}/comprehensive_products.json"
        
        response = requests.get(products_url, timeout=10)
        
        if response.status_code == 200:
            products_data = response.json()
            
            if isinstance(products_data, list):
                product_count = len(products_data)
                
                print(f"✅ Comprehensive products JSON accessible: {product_count} products found")
                
                if product_count == 57:
                    print(f"✅ Expected 57 products confirmed")
                    
                    # Check a few sample products
                    sample_products = products_data[:3]
                    for product in sample_products:
                        name = product.get('name', 'Unknown')
                        category = product.get('category', 'Unknown')
                        product_id = product.get('id', 'Unknown')
                        print(f"  📦 Sample: {name} (ID: {product_id}, Category: {category})")
                    
                    return True
                else:
                    print(f"❌ Expected 57 products, found {product_count}")
                    return False
            else:
                print("❌ Products data is not a list")
                return False
        else:
            print(f"❌ HTTP {response.status_code}: Cannot access comprehensive_products.json")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 Testing comprehensive_products.json accessibility...")
    success = test_comprehensive_products()
    
    if success:
        print("\n🎉 Comprehensive products JSON test PASSED!")
    else:
        print("\n❌ Comprehensive products JSON test FAILED!")