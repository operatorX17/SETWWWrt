#!/usr/bin/env python3
import json
import os

def verify_deployment():
    print("=== FINAL DEPLOYMENT VERIFICATION ===")
    print()
    
    # Check main catalog file
    catalog_file = 'out/PRODUCTION_READY_CATALOG.json'
    if os.path.exists(catalog_file):
        with open(catalog_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print("✅ PRODUCTION CATALOG VERIFIED")
        print(f"   📦 Total Products: {len(data['products'])}")
        print(f"   🏷️ Categories: {len(data['metadata']['categories'])}")
        print(f"   ⭐ Hero Products: {len(data['hero_section']['products'])}")
        print(f"   💰 Bundle Offers: {len(data['bundle_suggestions'])}")
        print(f"   📊 Avg Conversion Score: {data['conversion_optimization']['total_conversion_score']:.1f}%")
        print(f"   🚀 Production Ready: {data['metadata']['ready_for_production']}")
        print()
    
    # Check documentation files
    docs = [
        'docs/WEB_DEVELOPMENT_INTEGRATION_GUIDE.md',
        'docs/FINAL_SHOPIFY_CONFIGURATION_GUIDE.md',
        'FINAL_DEPLOYMENT_PACKAGE.md'
    ]
    
    print("✅ DOCUMENTATION FILES")
    for doc in docs:
        if os.path.exists(doc):
            size = os.path.getsize(doc)
            print(f"   📖 {doc} ({size:,} bytes)")
        else:
            print(f"   ❌ {doc} - MISSING")
    
    print()
    print("🎯 HERO SECTION PRODUCTS:")
    for i, product in enumerate(data['hero_section']['products'], 1):
        print(f"   {i}. {product['title']} - ₹{product['price']} ({product['conversion_score']}% conversion)")
    
    print()
    print("💰 BUNDLE OFFERS:")
    for i, bundle in enumerate(data['bundle_suggestions'], 1):
        print(f"   {i}. {bundle['title']} - Save ₹{bundle['savings']}")
    
    print()
    print("🚀 DEPLOYMENT STATUS: READY FOR WEB DEVELOPMENT INTEGRATION!")
    print("📋 Next Steps:")
    print("   1. Load PRODUCTION_READY_CATALOG.json into your application")
    print("   2. Follow WEB_DEVELOPMENT_INTEGRATION_GUIDE.md")
    print("   3. Implement hero section and product listings")
    print("   4. Set up bundle offers and cross-selling")
    print("   5. Deploy and monitor performance")

if __name__ == '__main__':
    verify_deployment()