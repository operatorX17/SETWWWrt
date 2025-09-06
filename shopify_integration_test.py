#!/usr/bin/env python3
"""
Shopify Integration Test
Tests the Shopify configuration and environment variables
"""

import os
import sys
from dotenv import load_dotenv
from pathlib import Path

def test_shopify_configuration():
    """Test Shopify environment variables and configuration"""
    print("🛍️  Testing Shopify Integration Configuration...")
    print("=" * 60)
    
    # Load backend environment variables
    backend_env_path = Path('/app/backend/.env')
    frontend_env_path = Path('/app/frontend/.env')
    
    print(f"📁 Loading backend .env from: {backend_env_path}")
    load_dotenv(backend_env_path)
    
    # Test backend Shopify environment variables
    backend_shopify_vars = {
        'SHOPIFY_STORE_DOMAIN': os.getenv('SHOPIFY_STORE_DOMAIN'),
        'SHOPIFY_STOREFRONT_API_TOKEN': os.getenv('SHOPIFY_STOREFRONT_API_TOKEN'),
        'SHOPIFY_STOREFRONT_API_VERSION': os.getenv('SHOPIFY_STOREFRONT_API_VERSION'),
        'SHOPIFY_WEBHOOK_SECRET': os.getenv('SHOPIFY_WEBHOOK_SECRET')
    }
    
    print("\n🔧 Backend Shopify Configuration:")
    all_backend_vars_present = True
    for var_name, var_value in backend_shopify_vars.items():
        if var_value:
            # Mask sensitive tokens for security
            if 'TOKEN' in var_name or 'SECRET' in var_name:
                masked_value = var_value[:8] + '*' * (len(var_value) - 8) if len(var_value) > 8 else '*' * len(var_value)
                print(f"  ✅ {var_name}: {masked_value}")
            else:
                print(f"  ✅ {var_name}: {var_value}")
        else:
            print(f"  ❌ {var_name}: NOT SET")
            all_backend_vars_present = False
    
    # Load frontend environment variables
    print(f"\n📁 Loading frontend .env from: {frontend_env_path}")
    load_dotenv(frontend_env_path)
    
    # Test frontend Shopify environment variables
    frontend_shopify_vars = {
        'REACT_APP_SHOPIFY_STORE_DOMAIN': os.getenv('REACT_APP_SHOPIFY_STORE_DOMAIN'),
        'REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN': os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN'),
        'REACT_APP_SHOPIFY_STOREFRONT_API_VERSION': os.getenv('REACT_APP_SHOPIFY_STOREFRONT_API_VERSION')
    }
    
    print("\n🎨 Frontend Shopify Configuration:")
    all_frontend_vars_present = True
    for var_name, var_value in frontend_shopify_vars.items():
        if var_value:
            # Mask sensitive tokens for security
            if 'TOKEN' in var_name:
                masked_value = var_value[:8] + '*' * (len(var_value) - 8) if len(var_value) > 8 else '*' * len(var_value)
                print(f"  ✅ {var_name}: {masked_value}")
            else:
                print(f"  ✅ {var_name}: {var_value}")
        else:
            print(f"  ❌ {var_name}: NOT SET")
            all_frontend_vars_present = False
    
    # Verify consistency between backend and frontend
    print("\n🔄 Configuration Consistency Check:")
    consistency_issues = []
    
    if backend_shopify_vars['SHOPIFY_STORE_DOMAIN'] != frontend_shopify_vars['REACT_APP_SHOPIFY_STORE_DOMAIN']:
        consistency_issues.append("Store domain mismatch between backend and frontend")
    else:
        print("  ✅ Store domain consistent between backend and frontend")
    
    if backend_shopify_vars['SHOPIFY_STOREFRONT_API_TOKEN'] != frontend_shopify_vars['REACT_APP_SHOPIFY_STOREFRONT_API_TOKEN']:
        consistency_issues.append("Storefront API token mismatch between backend and frontend")
    else:
        print("  ✅ Storefront API token consistent between backend and frontend")
    
    if backend_shopify_vars['SHOPIFY_STOREFRONT_API_VERSION'] != frontend_shopify_vars['REACT_APP_SHOPIFY_STOREFRONT_API_VERSION']:
        consistency_issues.append("Storefront API version mismatch between backend and frontend")
    else:
        print("  ✅ Storefront API version consistent between backend and frontend")
    
    # Validate specific values match the expected configuration
    print("\n🎯 Expected Configuration Validation:")
    expected_domain = "r1s7fa-eb.myshopify.com"
    expected_token = "c354b4e5fc2f5821176027fd2d8ba53b"
    expected_version = "2024-01"
    
    domain_match = backend_shopify_vars['SHOPIFY_STORE_DOMAIN'] == expected_domain
    token_match = backend_shopify_vars['SHOPIFY_STOREFRONT_API_TOKEN'] == expected_token
    version_match = backend_shopify_vars['SHOPIFY_STOREFRONT_API_VERSION'] == expected_version
    
    print(f"  {'✅' if domain_match else '❌'} Store domain matches expected: {expected_domain}")
    print(f"  {'✅' if token_match else '❌'} Storefront API token matches expected")
    print(f"  {'✅' if version_match else '❌'} API version matches expected: {expected_version}")
    
    # Overall assessment
    print("\n" + "=" * 60)
    print("🏁 SHOPIFY INTEGRATION ASSESSMENT")
    print("=" * 60)
    
    if all_backend_vars_present and all_frontend_vars_present and not consistency_issues and domain_match and token_match and version_match:
        print("🎉 ✅ SHOPIFY INTEGRATION FULLY CONFIGURED")
        print("   - All environment variables are set correctly")
        print("   - Backend and frontend configurations are consistent")
        print("   - Configuration matches expected Shopify store credentials")
        return True
    else:
        print("⚠️  ❌ SHOPIFY INTEGRATION ISSUES DETECTED")
        if not all_backend_vars_present:
            print("   - Missing backend environment variables")
        if not all_frontend_vars_present:
            print("   - Missing frontend environment variables")
        if consistency_issues:
            for issue in consistency_issues:
                print(f"   - {issue}")
        if not (domain_match and token_match and version_match):
            print("   - Configuration doesn't match expected values")
        return False

if __name__ == "__main__":
    success = test_shopify_configuration()
    sys.exit(0 if success else 1)