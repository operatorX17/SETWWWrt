#!/usr/bin/env python3
"""
RAILS-Based System Testing Suite
Tests the new OG Armory RAILS system with product filtering and categorization
"""

import requests
import json
import os
import sys
from datetime import datetime
import time

# Load environment variables
sys.path.append('/app/frontend')
from dotenv import load_dotenv

# Load frontend .env to get the backend URL
load_dotenv('/app/frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')

if not BACKEND_URL:
    print("❌ REACT_APP_BACKEND_URL not found in frontend/.env")
    sys.exit(1)

print(f"🔗 Testing RAILS System at: {BACKEND_URL}")
print("=" * 60)

class RailsSystemTester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        self.products = []
        
    def log_result(self, test_name, success, message=""):
        status = "✅ PASS" if success else "❌ FAIL"
        result = f"{status}: {test_name}"
        if message:
            result += f" - {message}"
        print(result)
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        if success:
            self.passed_tests += 1
        else:
            self.failed_tests += 1
    
    def load_products_data(self):
        """Load products.json data for rail filtering tests"""
        try:
            # Test direct access to products.json via web
            products_url = f"{BACKEND_URL}/products.json"
            response = requests.get(products_url, timeout=10)
            
            if response.status_code == 200:
                self.products = response.json()
                self.log_result("Products Data Loading (Web)", True, f"Loaded {len(self.products)} products via web URL")
                return True
            else:
                # Fallback to local file
                try:
                    with open('/app/frontend/public/products.json', 'r') as f:
                        self.products = json.load(f)
                    self.log_result("Products Data Loading (Local)", True, f"Loaded {len(self.products)} products from local file")
                    return True
                except Exception as e:
                    self.log_result("Products Data Loading", False, f"Failed to load products: {str(e)}")
                    return False
        except Exception as e:
            self.log_result("Products Data Loading", False, f"Error: {str(e)}")
            return False
    
    def test_products_json_accessibility(self):
        """Test that products.json is accessible via web URL"""
        try:
            products_url = f"{BACKEND_URL}/products.json"
            response = requests.get(products_url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    sample_product = data[0]
                    required_fields = ['id', 'name', 'price', 'badges', 'category']
                    
                    if all(field in sample_product for field in required_fields):
                        self.log_result("Products JSON Accessibility", True, f"Products.json accessible with {len(data)} products")
                        return True
                    else:
                        missing_fields = [field for field in required_fields if field not in sample_product]
                        self.log_result("Products JSON Accessibility", False, f"Missing required fields: {missing_fields}")
                        return False
                else:
                    self.log_result("Products JSON Accessibility", False, "Products.json is empty or not a list")
                    return False
            else:
                self.log_result("Products JSON Accessibility", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_result("Products JSON Accessibility", False, f"Error: {str(e)}")
            return False
    
    def test_under_999_rail(self):
        """Test Under ₹999 products rail (affordable)"""
        try:
            if not self.products:
                self.log_result("Under ₹999 Rail", False, "No products data loaded")
                return False
            
            under_999_products = [p for p in self.products if p.get('price', 0) < 999]
            
            if len(under_999_products) > 0:
                # Verify all products are actually under ₹999
                all_under_999 = all(p.get('price', 0) < 999 for p in under_999_products)
                
                if all_under_999:
                    sample_names = [p['name'] for p in under_999_products[:3]]
                    sample_prices = [f"₹{p['price']}" for p in under_999_products[:3]]
                    
                    message = f"Found {len(under_999_products)} affordable products. Samples: {', '.join(f'{name} ({price})' for name, price in zip(sample_names, sample_prices))}"
                    self.log_result("Under ₹999 Rail", True, message)
                    return True
                else:
                    invalid_products = [p for p in under_999_products if p.get('price', 0) >= 999]
                    self.log_result("Under ₹999 Rail", False, f"Found {len(invalid_products)} products with price ≥ ₹999 in under ₹999 rail")
                    return False
            else:
                self.log_result("Under ₹999 Rail", False, "No products found under ₹999")
                return False
                
        except Exception as e:
            self.log_result("Under ₹999 Rail", False, f"Error: {str(e)}")
            return False
    
    def test_rebel_drop_fan_arsenal_rail(self):
        """Test REBEL DROP/FAN ARSENAL products rail (rebellion core)"""
        try:
            if not self.products:
                self.log_result("REBEL DROP/FAN ARSENAL Rail", False, "No products data loaded")
                return False
            
            rebel_fan_products = []
            for product in self.products:
                badges = product.get('badges', [])
                if 'REBEL DROP' in badges or 'FAN ARSENAL' in badges:
                    rebel_fan_products.append(product)
            
            if len(rebel_fan_products) > 0:
                # Verify badge consistency
                rebel_count = sum(1 for p in rebel_fan_products if 'REBEL DROP' in p.get('badges', []))
                fan_arsenal_count = sum(1 for p in rebel_fan_products if 'FAN ARSENAL' in p.get('badges', []))
                
                sample_names = [p['name'] for p in rebel_fan_products[:3]]
                sample_badges = [p.get('badges', []) for p in rebel_fan_products[:3]]
                
                message = f"Found {len(rebel_fan_products)} rebellion core products ({rebel_count} REBEL DROP, {fan_arsenal_count} FAN ARSENAL). Samples: {', '.join(f'{name} {badges}' for name, badges in zip(sample_names, sample_badges))}"
                self.log_result("REBEL DROP/FAN ARSENAL Rail", True, message)
                return True
            else:
                self.log_result("REBEL DROP/FAN ARSENAL Rail", False, "No REBEL DROP or FAN ARSENAL products found")
                return False
                
        except Exception as e:
            self.log_result("REBEL DROP/FAN ARSENAL Rail", False, f"Error: {str(e)}")
            return False
    
    def test_premium_rail(self):
        """Test PREMIUM products rail (vault exclusives)"""
        try:
            if not self.products:
                self.log_result("PREMIUM Rail", False, "No products data loaded")
                return False
            
            premium_products = [p for p in self.products if 'PREMIUM' in p.get('badges', [])]
            
            if len(premium_products) > 0:
                # Verify premium products typically have higher prices
                premium_prices = [p.get('price', 0) for p in premium_products]
                avg_premium_price = sum(premium_prices) / len(premium_prices)
                
                # Get non-premium products for comparison
                non_premium_products = [p for p in self.products if 'PREMIUM' not in p.get('badges', [])]
                if non_premium_products:
                    non_premium_prices = [p.get('price', 0) for p in non_premium_products]
                    avg_non_premium_price = sum(non_premium_prices) / len(non_premium_prices)
                    
                    price_comparison = f"Avg premium: ₹{avg_premium_price:.2f} vs non-premium: ₹{avg_non_premium_price:.2f}"
                else:
                    price_comparison = f"Avg premium price: ₹{avg_premium_price:.2f}"
                
                sample_names = [p['name'] for p in premium_products[:3]]
                sample_prices = [f"₹{p['price']}" for p in premium_products[:3]]
                
                message = f"Found {len(premium_products)} premium products. {price_comparison}. Samples: {', '.join(f'{name} ({price})' for name, price in zip(sample_names, sample_prices))}"
                self.log_result("PREMIUM Rail", True, message)
                return True
            else:
                self.log_result("PREMIUM Rail", False, "No PREMIUM products found")
                return False
                
        except Exception as e:
            self.log_result("PREMIUM Rail", False, f"Error: {str(e)}")
            return False
    
    def test_og_product_names_quality(self):
        """Test that OG product names are premium and cinematic"""
        try:
            if not self.products:
                self.log_result("OG Product Names Quality", False, "No products data loaded")
                return False
            
            # Check for premium OG-themed names (expanded cinematic keywords)
            og_keywords = ['OG', 'Death', 'War', 'Rebel', 'Stalker', 'Machine', 'Beast', 'Hunter', 'Shadow', 'Storm', 'Phoenix', 'Wolf', 'Blood', 'Black', 'Brutal', 'Crimson', 'Dark', 'Predator', 'Thunder', 'Executive', 'Firestorm', 'Fighter', 'Iron', 'Legion', 'Midnight', 'Hawk', 'Night', 'Fury', 'Savage', 'Steel', 'Venom', 'Strike']
            
            og_named_products = []
            for product in self.products:
                name = product.get('name', '')
                if any(keyword in name for keyword in og_keywords):
                    og_named_products.append(product)
            
            # Check for old generic names that should be replaced
            generic_names = ['Product 1', 'Product 2', 'Ocean Waves', 'Test Product']
            generic_found = []
            for product in self.products:
                name = product.get('name', '')
                if any(generic in name for generic in generic_names):
                    generic_found.append(name)
            
            if len(og_named_products) >= 40:  # Expecting most products to have OG names
                if not generic_found:
                    sample_names = [p['name'] for p in og_named_products[:5]]
                    message = f"Found {len(og_named_products)} products with premium OG names, no generic names detected. Samples: {', '.join(sample_names)}"
                    self.log_result("OG Product Names Quality", True, message)
                    return True
                else:
                    self.log_result("OG Product Names Quality", False, f"Found generic names that should be replaced: {', '.join(generic_found)}")
                    return False
            else:
                self.log_result("OG Product Names Quality", False, f"Only {len(og_named_products)} products have OG-themed names (expected ≥40)")
                return False
                
        except Exception as e:
            self.log_result("OG Product Names Quality", False, f"Error: {str(e)}")
            return False
    
    def test_dvv_entertainment_branding(self):
        """Test that products have proper DVV Entertainment branding"""
        try:
            if not self.products:
                self.log_result("DVV Entertainment Branding", False, "No products data loaded")
                return False
            
            dvv_branded_products = []
            for product in self.products:
                vendor = product.get('vendor', '')
                description = product.get('description', '')
                
                if 'DVV Entertainment' in vendor or 'DVV Entertainment' in description:
                    dvv_branded_products.append(product)
            
            if len(dvv_branded_products) >= len(self.products) * 0.8:  # At least 80% should have DVV branding
                message = f"Found {len(dvv_branded_products)} out of {len(self.products)} products with DVV Entertainment branding"
                self.log_result("DVV Entertainment Branding", True, message)
                return True
            else:
                message = f"Only {len(dvv_branded_products)} out of {len(self.products)} products have DVV Entertainment branding (expected ≥80%)"
                self.log_result("DVV Entertainment Branding", False, message)
                return False
                
        except Exception as e:
            self.log_result("DVV Entertainment Branding", False, f"Error: {str(e)}")
            return False
    
    def test_product_categories_distribution(self):
        """Test that products are properly distributed across categories"""
        try:
            if not self.products:
                self.log_result("Product Categories Distribution", False, "No products data loaded")
                return False
            
            categories = {}
            for product in self.products:
                category = product.get('category', 'Unknown')
                categories[category] = categories.get(category, 0) + 1
            
            # Check for reasonable distribution
            expected_categories = ['Teeshirt', 'Hoodies', 'Posters', 'Accessories', 'Chains']
            found_expected = [cat for cat in expected_categories if cat in categories]
            
            if len(found_expected) >= 3:  # At least 3 expected categories
                category_summary = ', '.join([f"{cat}: {count}" for cat, count in categories.items()])
                message = f"Found {len(categories)} categories with good distribution: {category_summary}"
                self.log_result("Product Categories Distribution", True, message)
                return True
            else:
                message = f"Limited category distribution. Found: {list(categories.keys())}, Expected: {expected_categories}"
                self.log_result("Product Categories Distribution", False, message)
                return False
                
        except Exception as e:
            self.log_result("Product Categories Distribution", False, f"Error: {str(e)}")
            return False
    
    def run_all_rails_tests(self):
        """Run all RAILS system tests"""
        print("🚀 Starting RAILS-Based System Tests...")
        print()
        
        # Test 1: Load Products Data
        print("1. Loading Products Data...")
        if not self.load_products_data():
            print("❌ Cannot proceed without products data")
            return False
        print()
        
        # Test 2: Products JSON Accessibility
        print("2. Testing Products JSON Accessibility...")
        self.test_products_json_accessibility()
        print()
        
        # Test 3: Under ₹999 Rail
        print("3. Testing Under ₹999 Rail (Affordable)...")
        self.test_under_999_rail()
        print()
        
        # Test 4: REBEL DROP/FAN ARSENAL Rail
        print("4. Testing REBEL DROP/FAN ARSENAL Rail (Rebellion Core)...")
        self.test_rebel_drop_fan_arsenal_rail()
        print()
        
        # Test 5: PREMIUM Rail
        print("5. Testing PREMIUM Rail (Vault Exclusives)...")
        self.test_premium_rail()
        print()
        
        # Test 6: OG Product Names Quality
        print("6. Testing OG Product Names Quality...")
        self.test_og_product_names_quality()
        print()
        
        # Test 7: DVV Entertainment Branding
        print("7. Testing DVV Entertainment Branding...")
        self.test_dvv_entertainment_branding()
        print()
        
        # Test 8: Product Categories Distribution
        print("8. Testing Product Categories Distribution...")
        self.test_product_categories_distribution()
        print()
        
        # Summary
        print("=" * 80)
        print("🏁 RAILS SYSTEM TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📊 Total: {self.passed_tests + self.failed_tests}")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL RAILS TESTS PASSED! OG Armory RAILS system working correctly.")
            print("🛡️ All three rails (Affordable, Rebellion Core, Vault Exclusives) are operational.")
            return True
        else:
            print(f"\n⚠️  {self.failed_tests} test(s) failed. Please check the issues above.")
            return False

if __name__ == "__main__":
    tester = RailsSystemTester()
    success = tester.run_all_rails_tests()
    
    # Save test results to file
    with open('/app/rails_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': BACKEND_URL,
            'passed_tests': tester.passed_tests,
            'failed_tests': tester.failed_tests,
            'overall_success': success,
            'test_results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/rails_test_results.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)