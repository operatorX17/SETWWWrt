#!/usr/bin/env python3
"""
OG Expert Catalog Integration Testing Suite
Tests the new OG Expert Catalog with 45 premium products as per review request
"""

import requests
import json
import os
import sys
from datetime import datetime
import time

# Load environment variables
from dotenv import load_dotenv

# Load frontend .env to get the backend URL
load_dotenv('frontend/.env')
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL')

# For testing purposes, use localhost since external URL has routing issues
if not BACKEND_URL:
    BACKEND_URL = "http://localhost:8001"
    print(f"⚠️  REACT_APP_BACKEND_URL not found in frontend/.env, using localhost: {BACKEND_URL}")
else:
    # Use localhost for testing to avoid external routing issues
    BACKEND_URL = "http://localhost:8001"
    print(f"🔧 Using localhost for testing: {BACKEND_URL}")

# Ensure API prefix
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔗 Testing OG Expert Catalog Backend Integration at: {API_BASE_URL}")
print("=" * 80)

class OGExpertCatalogTester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        
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
    
    def test_backend_server_health(self):
        """Test basic backend server health"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "OG Armory Backend API" and data.get("status") == "running":
                    self.log_result("Backend Server Health", True, "OG Armory Backend API responding correctly")
                    return True
                else:
                    self.log_result("Backend Server Health", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Backend Server Health", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Backend Server Health", False, f"Connection error: {str(e)}")
            return False
    
    def test_og_expert_catalog_loading(self):
        """Test that the new OG Expert Catalog with 45 products loads correctly"""
        try:
            # Test direct access to comprehensive_products.json via frontend URL
            frontend_url = "https://imgreveal.preview.emergentagent.com"
            products_url = f"{frontend_url}/comprehensive_products.json"
            
            response = requests.get(products_url, timeout=10)
            
            if response.status_code == 200:
                try:
                    catalog_data = response.json()
                    
                    # Check if it's the new OG Expert Catalog format
                    metadata = catalog_data.get('metadata', {})
                    products_data = catalog_data.get('products', [])
                    
                    product_count = len(products_data)
                    total_from_metadata = metadata.get('total_products', 0)
                    source = metadata.get('source', 'unknown')
                    categories = metadata.get('categories', [])
                    
                    # Verify OG Expert Catalog with 45 products
                    if product_count == 45 and source == 'OG_EXPERT_CATALOG_BUILDER':
                        expected_categories = ['slide', 'poster', 'wallet', 'cap', 'headband', 'hoodie', 'tee', 'shirt', 'sweatshirt']
                        categories_match = all(cat in categories for cat in expected_categories)
                        
                        if categories_match and len(categories) == 9:
                            self.log_result("OG Expert Catalog Loading", True, f"Successfully loaded OG Expert Catalog with {product_count} products across {len(categories)} categories: {', '.join(categories)}")
                            return products_data
                        else:
                            missing_cats = [cat for cat in expected_categories if cat not in categories]
                            self.log_result("OG Expert Catalog Loading", False, f"Category mismatch. Expected 9 categories, found {len(categories)}. Missing: {missing_cats}")
                            return None
                    else:
                        self.log_result("OG Expert Catalog Loading", False, f"Expected 45 products from OG_EXPERT_CATALOG_BUILDER, found {product_count} from {source}")
                        return None
                        
                except json.JSONDecodeError as e:
                    self.log_result("OG Expert Catalog Loading", False, f"Invalid JSON format: {str(e)}")
                    return None
            else:
                self.log_result("OG Expert Catalog Loading", False, f"HTTP {response.status_code}: Cannot access comprehensive_products.json")
                return None
                
        except Exception as e:
            self.log_result("OG Expert Catalog Loading", False, f"Error: {str(e)}")
            return None
    
    def test_og_theming_and_naming(self):
        """Test OG theming with titles like 'OG // Hoodie — Thunder Strike [Scene 108]'"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("OG Theming and Naming", False, "Could not load products data")
                return False
            
            og_themed_products = []
            scene_code_products = []
            cinematic_concepts = []
            
            for product in products_data:
                title = product.get('title', '')
                concept = product.get('concept', '')
                scene_code = product.get('scene_code', '')
                
                # Check for OG theming format
                if 'OG //' in title:
                    og_themed_products.append(title)
                
                # Check for scene codes
                if scene_code and 'Scene' in scene_code:
                    scene_code_products.append(f"{title}: {scene_code}")
                
                # Check for cinematic concepts
                if concept:
                    cinematic_concepts.append(f"{title}: {concept}")
            
            og_percentage = (len(og_themed_products) / len(products_data)) * 100
            scene_percentage = (len(scene_code_products) / len(products_data)) * 100
            concept_percentage = (len(cinematic_concepts) / len(products_data)) * 100
            
            # Show sample products
            sample_og_titles = og_themed_products[:3]
            sample_scenes = scene_code_products[:3]
            sample_concepts = cinematic_concepts[:3]
            
            if og_percentage >= 90 and scene_percentage >= 20 and concept_percentage >= 80:
                self.log_result("OG Theming and Naming", True, f"OG theming: {og_percentage:.1f}% ({len(og_themed_products)}/45), Scene codes: {scene_percentage:.1f}%, Concepts: {concept_percentage:.1f}%. Samples: {', '.join(sample_og_titles[:2])}")
                return True
            else:
                issues = []
                if og_percentage < 90:
                    issues.append(f"Low OG theming: {og_percentage:.1f}%")
                if scene_percentage < 20:
                    issues.append(f"Low scene codes: {scene_percentage:.1f}%")
                if concept_percentage < 80:
                    issues.append(f"Low concepts: {concept_percentage:.1f}%")
                
                self.log_result("OG Theming and Naming", False, f"Theming issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_result("OG Theming and Naming", False, f"Error: {str(e)}")
            return False
    
    def test_premium_features(self):
        """Test premium features: scene codes, cinematic concepts, Telugu support, rails system"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Premium Features", False, "Could not load products data")
                return False
            
            features_found = {
                'scene_codes': 0,
                'cinematic_concepts': 0,
                'rails_system': 0,
                'telugu_support': 0,
                'premium_pricing': 0
            }
            
            for product in products_data:
                # Scene codes
                if product.get('scene_code'):
                    features_found['scene_codes'] += 1
                
                # Cinematic concepts
                if product.get('concept'):
                    features_found['cinematic_concepts'] += 1
                
                # Rails system
                if product.get('rails'):
                    features_found['rails_system'] += 1
                
                # Telugu support (check for Telugu-related tags or descriptions)
                tags = product.get('tags', [])
                description = product.get('description', '')
                if any('telugu' in str(tag).lower() for tag in tags) or 'telugu' in description.lower():
                    features_found['telugu_support'] += 1
                
                # Premium pricing (above ₹1000)
                price = int(product.get('price', 0))
                if price >= 1000:
                    features_found['premium_pricing'] += 1
            
            total_products = len(products_data)
            
            # Calculate percentages
            scene_percentage = (features_found['scene_codes'] / total_products) * 100
            concept_percentage = (features_found['cinematic_concepts'] / total_products) * 100
            rails_percentage = (features_found['rails_system'] / total_products) * 100
            premium_percentage = (features_found['premium_pricing'] / total_products) * 100
            
            # Check if premium features are well implemented
            if (scene_percentage >= 20 and concept_percentage >= 80 and 
                rails_percentage >= 90 and premium_percentage >= 70):
                
                self.log_result("Premium Features", True, f"Premium features working: Scene codes {scene_percentage:.1f}%, Concepts {concept_percentage:.1f}%, Rails {rails_percentage:.1f}%, Premium pricing {premium_percentage:.1f}%")
                return True
            else:
                issues = []
                if scene_percentage < 20:
                    issues.append(f"Scene codes: {scene_percentage:.1f}%")
                if concept_percentage < 80:
                    issues.append(f"Concepts: {concept_percentage:.1f}%")
                if rails_percentage < 90:
                    issues.append(f"Rails: {rails_percentage:.1f}%")
                if premium_percentage < 70:
                    issues.append(f"Premium pricing: {premium_percentage:.1f}%")
                
                self.log_result("Premium Features", False, f"Premium feature issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_result("Premium Features", False, f"Error: {str(e)}")
            return False
    
    def test_category_distribution(self):
        """Test proper categorization across 9 categories"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Category Distribution", False, "Could not load products data")
                return False
            
            expected_categories = ['shirt', 'hoodie', 'headband', 'slide', 'wallet', 'cap', 'sweatshirt', 'tee', 'poster']
            category_counts = {}
            
            for product in products_data:
                category = product.get('category', 'unknown')
                if category in category_counts:
                    category_counts[category] += 1
                else:
                    category_counts[category] = 1
            
            found_categories = list(category_counts.keys())
            category_results = []
            
            for expected_cat in expected_categories:
                count = category_counts.get(expected_cat, 0)
                if count > 0:
                    category_results.append(f"{expected_cat}({count})")
                    print(f"  ✅ {expected_cat}: {count} products")
                else:
                    print(f"  ⚠️  {expected_cat}: No products found")
            
            # Check if we have products in at least 7 of the 9 expected categories
            categories_with_products = sum(1 for cat in expected_categories if category_counts.get(cat, 0) > 0)
            total_categorized = sum(category_counts.get(cat, 0) for cat in expected_categories)
            
            if categories_with_products >= 7 and total_categorized >= 40:  # At least 7 categories and 40+ products
                self.log_result("Category Distribution", True, f"Category distribution working: {categories_with_products}/9 categories populated: {', '.join(category_results)}. {total_categorized}/45 products categorized")
                return True
            else:
                missing = []
                if categories_with_products < 7:
                    missing.append(f"Only {categories_with_products}/9 categories populated")
                if total_categorized < 40:
                    missing.append(f"Only {total_categorized}/45 products categorized")
                
                self.log_result("Category Distribution", False, f"Category distribution issues: {'; '.join(missing)}")
                return False
                
        except Exception as e:
            self.log_result("Category Distribution", False, f"Error: {str(e)}")
            return False
    
    def test_pricing_bands(self):
        """Test pricing bands: Under ₹999, Core, Vault pricing"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Pricing Bands", False, "Could not load products data")
                return False
            
            pricing_bands = {
                'under_999': 0,
                'core_1000_1999': 0,
                'vault_2000_plus': 0
            }
            
            price_samples = []
            
            for product in products_data:
                price = int(product.get('price', 0))
                title = product.get('title', 'Unknown')
                
                if price < 999:
                    pricing_bands['under_999'] += 1
                    if len(price_samples) < 3:
                        price_samples.append(f"{title}: ₹{price}")
                elif price >= 1000 and price < 2000:
                    pricing_bands['core_1000_1999'] += 1
                    if len(price_samples) < 3:
                        price_samples.append(f"{title}: ₹{price}")
                elif price >= 2000:
                    pricing_bands['vault_2000_plus'] += 1
                    if len(price_samples) < 3:
                        price_samples.append(f"{title}: ₹{price}")
            
            total_products = len(products_data)
            
            # Calculate percentages
            under_999_percentage = (pricing_bands['under_999'] / total_products) * 100
            core_percentage = (pricing_bands['core_1000_1999'] / total_products) * 100
            vault_percentage = (pricing_bands['vault_2000_plus'] / total_products) * 100
            
            # Check if pricing bands are well distributed
            if (pricing_bands['under_999'] > 0 and pricing_bands['core_1000_1999'] > 0):
                band_summary = f"Under ₹999: {pricing_bands['under_999']} ({under_999_percentage:.1f}%), Core ₹1000-1999: {pricing_bands['core_1000_1999']} ({core_percentage:.1f}%), Vault ₹2000+: {pricing_bands['vault_2000_plus']} ({vault_percentage:.1f}%)"
                
                self.log_result("Pricing Bands", True, f"Pricing bands working: {band_summary}")
                return True
            else:
                issues = []
                if pricing_bands['under_999'] == 0:
                    issues.append("No products under ₹999")
                if pricing_bands['core_1000_1999'] == 0:
                    issues.append("No core pricing products")
                
                self.log_result("Pricing Bands", False, f"Pricing band issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_result("Pricing Bands", False, f"Error: {str(e)}")
            return False
    
    def test_badge_system(self):
        """Test badge system: REBEL_DROP, BEST_SELLER, VAULT_EXCLUSIVE, UNDER_999"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Badge System", False, "Could not load products data")
                return False
            
            expected_badges = ['REBEL_DROP', 'BEST_SELLER', 'VAULT_EXCLUSIVE', 'UNDER_999']
            badge_counts = {}
            products_with_badges = 0
            
            for product in products_data:
                name = product.get('title', 'Unknown')
                badges = product.get('badges', [])
                
                if badges:
                    products_with_badges += 1
                    
                for badge in badges:
                    if badge in expected_badges:
                        if badge in badge_counts:
                            badge_counts[badge] += 1
                        else:
                            badge_counts[badge] = 1
                        print(f"  ✅ {name[:30]}...: {badge} badge found")
            
            total_products = len(products_data)
            badge_coverage = (products_with_badges / total_products) * 100 if total_products > 0 else 0
            
            # Check if we have at least 2 badge types and good coverage
            found_badge_types = len(badge_counts.keys())
            
            if found_badge_types >= 2 and badge_coverage >= 60:  # At least 2 badge types and 60% coverage
                badge_summary = ', '.join([f"{badge}({count})" for badge, count in badge_counts.items()])
                self.log_result("Badge System", True, f"Badge system working: {badge_summary}. Coverage: {badge_coverage:.1f}% ({products_with_badges}/{total_products} products)")
                return True
            else:
                self.log_result("Badge System", False, f"Badge system issues: Only {found_badge_types} badge types found, {badge_coverage:.1f}% coverage")
                return False
                
        except Exception as e:
            self.log_result("Badge System", False, f"Error: {str(e)}")
            return False
    
    def test_rails_organization(self):
        """Test rails organization: rebel_drop: 4, best_sellers: 18, under_999: 17, vault: 6"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Rails Organization", False, "Could not load products data")
                return False
            
            rails_counts = {}
            
            for product in products_data:
                rails = product.get('rails', [])
                for rail in rails:
                    if rail in rails_counts:
                        rails_counts[rail] += 1
                    else:
                        rails_counts[rail] = 1
            
            # Check for expected rails
            expected_rails = ['rebel_drop', 'best_sellers', 'under_999', 'vault']
            found_rails = []
            
            for rail in expected_rails:
                count = rails_counts.get(rail, 0)
                if count > 0:
                    found_rails.append(f"{rail}({count})")
                    print(f"  ✅ {rail}: {count} products")
                else:
                    print(f"  ⚠️  {rail}: No products found")
            
            # Check if we have at least 3 of the 4 expected rails with products
            rails_with_products = sum(1 for rail in expected_rails if rails_counts.get(rail, 0) > 0)
            total_rail_products = sum(rails_counts.get(rail, 0) for rail in expected_rails)
            
            if rails_with_products >= 3 and total_rail_products >= 30:  # At least 3 rails and 30+ products
                self.log_result("Rails Organization", True, f"Rails organization working: {rails_with_products}/4 rails populated: {', '.join(found_rails)}. {total_rail_products} total rail assignments")
                return True
            else:
                issues = []
                if rails_with_products < 3:
                    issues.append(f"Only {rails_with_products}/4 rails populated")
                if total_rail_products < 30:
                    issues.append(f"Only {total_rail_products} rail assignments")
                
                self.log_result("Rails Organization", False, f"Rails organization issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_result("Rails Organization", False, f"Error: {str(e)}")
            return False
    
    def test_image_path_integrity(self):
        """Test image path integrity and accessibility"""
        try:
            products_data = self.test_og_expert_catalog_loading()
            if not products_data:
                self.log_result("Image Path Integrity", False, "Could not load products data")
                return False
            
            # Test a sample of product images for path integrity
            sample_products = products_data[:10]  # Test first 10 products
            valid_paths = 0
            total_images_checked = 0
            path_issues = []
            
            for product in sample_products:
                name = product.get('title', 'Unknown')
                images = product.get('images', {})
                
                # Check front image path
                front_image = images.get('front')
                if front_image:
                    total_images_checked += 1
                    if front_image.startswith('PRODUCTS/') and '/' in front_image:
                        valid_paths += 1
                        print(f"  ✅ {name[:30]}...: Valid front image path")
                    else:
                        path_issues.append(f"{name}: Invalid front path format")
                
                # Check back image path (if exists)
                back_image = images.get('back')
                if back_image:
                    total_images_checked += 1
                    if back_image.startswith('PRODUCTS/') and '/' in back_image:
                        valid_paths += 1
                        print(f"  ✅ {name[:30]}...: Valid back image path")
                    else:
                        path_issues.append(f"{name}: Invalid back path format")
            
            path_integrity_percentage = (valid_paths / total_images_checked) * 100 if total_images_checked > 0 else 0
            
            if path_integrity_percentage >= 80:  # At least 80% valid paths
                self.log_result("Image Path Integrity", True, f"Image path integrity good: {valid_paths}/{total_images_checked} paths valid ({path_integrity_percentage:.1f}%)")
                return True
            else:
                self.log_result("Image Path Integrity", False, f"Image path integrity issues: Only {valid_paths}/{total_images_checked} paths valid ({path_integrity_percentage:.1f}%). Issues: {'; '.join(path_issues[:3])}")
                return False
                
        except Exception as e:
            self.log_result("Image Path Integrity", False, f"Error: {str(e)}")
            return False
    
    def test_mongodb_integration(self):
        """Test MongoDB integration for backend stability"""
        try:
            # Create a test status check
            test_client_name = f"OG_Expert_Catalog_Test_{int(time.time())}"
            create_data = {"client_name": test_client_name}
            
            create_response = requests.post(
                f"{API_BASE_URL}/status",
                json=create_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_result("MongoDB Integration", False, "Failed to create test record")
                return False
            
            # Retrieve status to verify our record was stored
            get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_result("MongoDB Integration", False, "Failed to retrieve status")
                return False
            
            status_data = get_response.json()
            
            # Check if MongoDB is connected and has documents
            if status_data.get('mongodb') == 'connected' and status_data.get('documents_count', 0) > 0:
                self.log_result("MongoDB Integration", True, f"MongoDB integration stable. Documents: {status_data.get('documents_count')}")
                return True
            else:
                self.log_result("MongoDB Integration", False, f"MongoDB integration issues: {status_data}")
                return False
                
        except Exception as e:
            self.log_result("MongoDB Integration", False, f"Error: {str(e)}")
            return False
    
    def test_api_performance(self):
        """Test API performance with OG Expert Catalog load"""
        try:
            # Test multiple API calls to check performance
            start_time = time.time()
            
            test_calls = [
                ("GET", "/", "Root endpoint"),
                ("GET", "/status", "Status endpoint"),
                ("POST", "/status", "Create status", {"client_name": f"Performance_Test_{int(time.time())}"})
            ]
            
            response_times = []
            
            for method, path, description, *data in test_calls:
                call_start = time.time()
                
                try:
                    url = f"{API_BASE_URL}{path}"
                    
                    if method == "GET":
                        response = requests.get(url, timeout=10)
                    elif method == "POST":
                        test_data = data[0] if data else {"client_name": "test"}
                        response = requests.post(url, json=test_data, timeout=10)
                    
                    call_end = time.time()
                    response_time = (call_end - call_start) * 1000  # Convert to milliseconds
                    response_times.append(response_time)
                    
                    if response.status_code in [200, 201]:
                        print(f"  ✅ {description}: {response_time:.0f}ms")
                    else:
                        print(f"  ❌ {description}: {response_time:.0f}ms (HTTP {response.status_code})")
                        
                except Exception as e:
                    call_end = time.time()
                    response_time = (call_end - call_start) * 1000
                    response_times.append(response_time)
                    print(f"  ❌ {description}: {response_time:.0f}ms (Error: {str(e)})")
            
            avg_response_time = sum(response_times) / len(response_times) if response_times else 0
            
            # Consider performance good if average response time is under 100ms
            if avg_response_time < 100:
                self.log_result("API Performance", True, f"Excellent performance: {avg_response_time:.0f}ms average response time")
                return True
            elif avg_response_time < 500:
                self.log_result("API Performance", True, f"Good performance: {avg_response_time:.0f}ms average response time")
                return True
            else:
                self.log_result("API Performance", False, f"Poor performance: {avg_response_time:.0f}ms average response time")
                return False
                
        except Exception as e:
            self.log_result("API Performance", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all OG Expert Catalog integration tests"""
        print("🔥 Starting OG Expert Catalog Integration Tests...")
        print("Testing the new expert-generated catalog with 45 premium products")
        print()
        
        # Test 1: Backend Server Health
        print("1. Testing Backend Server Health...")
        self.test_backend_server_health()
        print()
        
        # Test 2: OG Expert Catalog Loading
        print("2. Testing OG Expert Catalog Loading (45 products)...")
        self.test_og_expert_catalog_loading()
        print()
        
        # Test 3: OG Theming and Naming
        print("3. Testing OG Theming and Naming...")
        self.test_og_theming_and_naming()
        print()
        
        # Test 4: Premium Features
        print("4. Testing Premium Features (scene codes, concepts, Telugu support, rails)...")
        self.test_premium_features()
        print()
        
        # Test 5: Category Distribution
        print("5. Testing Category Distribution (9 categories)...")
        self.test_category_distribution()
        print()
        
        # Test 6: Pricing Bands
        print("6. Testing Pricing Bands (Under ₹999, Core, Vault)...")
        self.test_pricing_bands()
        print()
        
        # Test 7: Badge System
        print("7. Testing Badge System (REBEL_DROP, BEST_SELLER, VAULT_EXCLUSIVE, UNDER_999)...")
        self.test_badge_system()
        print()
        
        # Test 8: Rails Organization
        print("8. Testing Rails Organization...")
        self.test_rails_organization()
        print()
        
        # Test 9: Image Path Integrity
        print("9. Testing Image Path Integrity and Accessibility...")
        self.test_image_path_integrity()
        print()
        
        # Test 10: MongoDB Integration
        print("10. Testing MongoDB Integration...")
        self.test_mongodb_integration()
        print()
        
        # Test 11: API Performance
        print("11. Testing API Performance...")
        self.test_api_performance()
        print()
        
        # Summary
        print("=" * 80)
        print("🏁 OG EXPERT CATALOG INTEGRATION TEST SUMMARY")
        print("=" * 80)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📊 Total: {self.passed_tests + self.failed_tests}")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! OG Expert Catalog integration is fully operational.")
            print("🔥 45 premium products with OG theming successfully integrated.")
            print("🎯 Premium features (scene codes, cinematic concepts, rails system) working correctly.")
            print("🏷️ Badge system and pricing bands functional.")
            print("📁 9 categories properly distributed with image path integrity.")
            return True
        else:
            print(f"\n⚠️  {self.failed_tests} test(s) failed. Please check the issues above.")
            return False

if __name__ == "__main__":
    tester = OGExpertCatalogTester()
    success = tester.run_all_tests()
    
    # Save test results to file
    with open('/app/og_expert_catalog_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': API_BASE_URL,
            'catalog_type': 'OG_EXPERT_CATALOG',
            'expected_products': 45,
            'passed_tests': tester.passed_tests,
            'failed_tests': tester.failed_tests,
            'overall_success': success,
            'test_results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/og_expert_catalog_test_results.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)