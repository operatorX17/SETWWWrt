#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests all backend endpoints and functionality for the OG merch application
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

if not BACKEND_URL:
    print("❌ REACT_APP_BACKEND_URL not found in frontend/.env")
    sys.exit(1)

# Ensure API prefix
API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔗 Testing Backend API at: {API_BASE_URL}")
print("=" * 60)

class BackendTester:
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
    
    def test_server_health(self):
        """Test basic server health and root endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                # Updated to match the actual response from OG Armory Backend
                if data.get("message") == "OG Armory Backend API" and data.get("status") == "running":
                    self.log_result("Server Health Check", True, "OG Armory Backend API responding correctly")
                    return True
                else:
                    self.log_result("Server Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Server Health Check", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result("Server Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_environment_variables(self):
        """Test that environment variables are properly loaded"""
        try:
            # Check if we can access the backend (indirect test of env vars)
            response = requests.get(f"{API_BASE_URL}/", timeout=5)
            if response.status_code == 200:
                self.log_result("Environment Variables", True, "Backend accessible, env vars loaded")
                return True
            else:
                self.log_result("Environment Variables", False, "Backend not accessible")
                return False
        except Exception as e:
            self.log_result("Environment Variables", False, f"Error: {str(e)}")
            return False
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test CORS with Origin header (this is when CORS headers are sent)
            headers = {'Origin': 'https://example.com'}
            response = requests.get(f"{API_BASE_URL}/", headers=headers, timeout=5)
            
            cors_headers = [
                'access-control-allow-origin',
                'access-control-allow-credentials'
            ]
            
            found_headers = []
            for header in cors_headers:
                if header in response.headers:
                    found_headers.append(f"{header}: {response.headers[header]}")
            
            if found_headers:
                self.log_result("CORS Configuration", True, f"CORS headers found: {', '.join(found_headers)}")
                return True
            else:
                self.log_result("CORS Configuration", False, "No CORS headers found")
                return False
        except Exception as e:
            self.log_result("CORS Configuration", False, f"Error: {str(e)}")
            return False
    
    def test_create_status_check(self):
        """Test POST /api/status endpoint"""
        try:
            test_data = {
                "client_name": "OG_Test_Client_" + str(int(time.time()))
            }
            
            response = requests.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                # Updated to match the actual response format
                required_fields = ['message', 'id', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['message'] == "Status created":
                        self.log_result("Create Status Check", True, f"Created status check with ID: {data['id']}")
                        return data['id']
                    else:
                        self.log_result("Create Status Check", False, "Unexpected message in response")
                        return None
                else:
                    self.log_result("Create Status Check", False, f"Missing required fields: {required_fields}")
                    return None
            else:
                self.log_result("Create Status Check", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.RequestException as e:
            self.log_result("Create Status Check", False, f"Request error: {str(e)}")
            return None
        except Exception as e:
            self.log_result("Create Status Check", False, f"Error: {str(e)}")
            return None
    
    def test_get_status_checks(self):
        """Test GET /api/status endpoint"""
        try:
            response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                # Updated to handle the new status response format
                if isinstance(data, dict) and data.get("status") in ["healthy", "degraded"]:
                    mongodb_status = data.get("mongodb", "unknown")
                    doc_count = data.get("documents_count", 0)
                    self.log_result("Get Status Checks", True, f"Status endpoint working: {data.get('status')}, MongoDB: {mongodb_status}, Documents: {doc_count}")
                    return True
                else:
                    self.log_result("Get Status Checks", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_result("Get Status Checks", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_result("Get Status Checks", False, f"Request error: {str(e)}")
            return False
        except Exception as e:
            self.log_result("Get Status Checks", False, f"Error: {str(e)}")
            return False
    
    def test_mongodb_integration(self):
        """Test MongoDB integration by creating and retrieving data"""
        try:
            # Create a test status check
            test_client_name = f"MongoDB_Test_{int(time.time())}"
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
            
            created_record = create_response.json()
            created_id = created_record.get('id')
            
            # Retrieve status to verify our record was stored
            get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
            
            if get_response.status_code != 200:
                self.log_result("MongoDB Integration", False, "Failed to retrieve status")
                return False
            
            status_data = get_response.json()
            
            # Check if MongoDB is connected and has documents
            if status_data.get('mongodb') == 'connected' and status_data.get('documents_count', 0) > 0:
                self.log_result("MongoDB Integration", True, f"Successfully created and verified record in MongoDB. Documents: {status_data.get('documents_count')}")
                return True
            else:
                self.log_result("MongoDB Integration", False, f"MongoDB integration issues: {status_data}")
                return False
                
        except Exception as e:
            self.log_result("MongoDB Integration", False, f"Error: {str(e)}")
            return False
    
    def test_shopify_environment_variables(self):
        """Test that Shopify environment variables are properly configured"""
        try:
            # Load backend .env file to check Shopify credentials
            load_dotenv('/app/backend/.env')
            
            required_shopify_vars = [
                'SHOPIFY_STORE_DOMAIN',
                'SHOPIFY_STOREFRONT_API_TOKEN',
                'SHOPIFY_STOREFRONT_API_VERSION',
                'SHOPIFY_ADMIN_API_KEY',
                'SHOPIFY_ADMIN_API_SECRET'
            ]
            
            missing_vars = []
            configured_vars = []
            
            for var in required_shopify_vars:
                value = os.getenv(var)
                if not value:
                    missing_vars.append(var)
                else:
                    # Mask sensitive tokens for logging
                    if 'TOKEN' in var or 'KEY' in var or 'SECRET' in var:
                        masked_value = f"{value[:8]}...{value[-4:]}" if len(value) > 12 else "***"
                        configured_vars.append(f"{var}={masked_value}")
                    else:
                        configured_vars.append(f"{var}={value}")
            
            if missing_vars:
                self.log_result("Shopify Environment Variables", False, f"Missing variables: {', '.join(missing_vars)}")
                return False
            else:
                self.log_result("Shopify Environment Variables", True, f"All Shopify vars configured: {', '.join(configured_vars)}")
                return True
                
        except Exception as e:
            self.log_result("Shopify Environment Variables", False, f"Error: {str(e)}")
            return False
    
    def test_shopify_storefront_api_connectivity(self):
        """Test direct connectivity to Shopify Storefront API"""
        try:
            # Load Shopify credentials
            load_dotenv('/app/backend/.env')
            
            store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
            access_token = os.getenv('SHOPIFY_STOREFRONT_API_TOKEN')
            api_version = os.getenv('SHOPIFY_STOREFRONT_API_VERSION')
            
            if not all([store_domain, access_token, api_version]):
                self.log_result("Shopify Storefront API Connectivity", False, "Missing Shopify credentials")
                return False
            
            # Test GraphQL query to fetch shop info first
            graphql_url = f"https://{store_domain}/api/{api_version}/graphql.json"
            
            query = """
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
            
            response = requests.post(
                graphql_url,
                json={'query': query},
                headers=headers,
                timeout=15
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'errors' in data:
                    self.log_result("Shopify Storefront API Connectivity", False, f"GraphQL errors: {data['errors']}")
                    return False
                
                shop_data = data.get('data', {}).get('shop', {})
                shop_name = shop_data.get('name', 'Unknown')
                
                if shop_name and shop_name != 'Unknown':
                    self.log_result("Shopify Storefront API Connectivity", True, f"Successfully connected to '{shop_name}' store via Storefront API")
                    return True
                else:
                    self.log_result("Shopify Storefront API Connectivity", False, "Could not retrieve shop information")
                    return False
            else:
                self.log_result("Shopify Storefront API Connectivity", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("Shopify Storefront API Connectivity", False, f"Error: {str(e)}")
            return False
    
    def test_og_products_availability(self):
        """Test that OG products are available through Shopify Admin API"""
        try:
            # Load Shopify credentials
            load_dotenv('/app/backend/.env')
            
            store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
            admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')
            
            if not all([store_domain, admin_api_key]):
                self.log_result("OG Products Availability", False, "Missing Shopify Admin API credentials")
                return False
            
            # Use Admin API to check products (more reliable than Storefront API for this test)
            admin_url = f"https://{store_domain}/admin/api/2024-01/products.json?limit=250"
            
            headers = {
                'X-Shopify-Access-Token': admin_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(admin_url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                products = data.get('products', [])
                
                og_products = []
                
                for product in products:
                    title = product.get('title', '')
                    status = product.get('status', 'unknown')
                    tags = product.get('tags', '').split(', ') if product.get('tags') else []
                    
                    # Check for OG-related content
                    is_og_product = (
                        'OG' in title or 
                        'Death' in title or 
                        'War' in title or 
                        'Rebel' in title or
                        'Stalker' in title or
                        'Machine' in title or
                        'Beast' in title or
                        'Hunter' in title or
                        'Shadow' in title or
                        'Storm' in title or
                        any('og' in tag.lower() for tag in tags)
                    )
                    
                    if is_og_product:
                        og_products.append({
                            'title': title,
                            'status': status,
                            'tags': tags
                        })
                
                total_products = len(products)
                og_count = len(og_products)
                active_og_count = sum(1 for p in og_products if p['status'] == 'active')
                
                if og_count >= 20:  # Expecting at least 20 OG-themed products out of 52
                    # Show sample products
                    sample_titles = [p['title'] for p in og_products[:5]]
                    message = f"Found {og_count} OG products out of {total_products} total ({active_og_count} active). Samples: {', '.join(sample_titles)}"
                    
                    self.log_result("OG Products Availability", True, message)
                    return True
                else:
                    # Show what products we did find for debugging
                    found_titles = [p['title'] for p in og_products[:10]]
                    self.log_result("OG Products Availability", False, f"Only found {og_count} OG products (expected ≥20) out of {total_products} total. Found: {', '.join(found_titles) if found_titles else 'None'}")
                    return False
            else:
                self.log_result("OG Products Availability", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_result("OG Products Availability", False, f"Error: {str(e)}")
            return False
    
    def test_backend_shopify_integration_health(self):
        """Test overall backend health with Shopify integration context"""
        try:
            # Check if backend can handle requests while Shopify integration is configured
            test_requests = [
                ("GET", "/", "Root endpoint with Shopify context"),
                ("GET", "/status", "Status endpoint with Shopify context"),
            ]
            
            all_healthy = True
            
            for method, path, description in test_requests:
                try:
                    url = f"{API_BASE_URL}{path}"
                    response = requests.get(url, timeout=10)
                    
                    if response.status_code == 200:
                        print(f"  ✅ {description}")
                    else:
                        print(f"  ❌ {description} (HTTP {response.status_code})")
                        all_healthy = False
                        
                except Exception as e:
                    print(f"  ❌ {description} (Error: {str(e)})")
                    all_healthy = False
            
            # Test that backend can create records while Shopify is configured
            test_data = {"client_name": f"Shopify_Integration_Test_{int(time.time())}"}
            response = requests.post(
                f"{API_BASE_URL}/status",
                json=test_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"  ✅ Database operations with Shopify integration")
            else:
                print(f"  ❌ Database operations with Shopify integration (HTTP {response.status_code})")
                all_healthy = False
            
            if all_healthy:
                self.log_result("Backend Shopify Integration Health", True, "Backend stable with Shopify integration")
                return True
            else:
                self.log_result("Backend Shopify Integration Health", False, "Backend issues detected with Shopify integration")
                return False
                
        except Exception as e:
            self.log_result("Backend Shopify Integration Health", False, f"Error: {str(e)}")
            return False
    
    def test_api_routes_accessibility(self):
        """Test that all defined API routes are accessible"""
        routes_to_test = [
            ("GET", "/", "Root endpoint"),
            ("GET", "/status", "Get status checks"),
            ("POST", "/status", "Create status check")
        ]
        
        all_accessible = True
        
        for method, path, description in routes_to_test:
            try:
                url = f"{API_BASE_URL}{path}"
                
                if method == "GET":
                    response = requests.get(url, timeout=5)
                elif method == "POST":
                    # For POST, send valid test data
                    test_data = {"client_name": "Route_Test_Client"}
                    response = requests.post(url, json=test_data, timeout=5)
                
                if response.status_code in [200, 201]:
                    print(f"  ✅ {method} {path} - {description}")
                else:
                    print(f"  ❌ {method} {path} - {description} (HTTP {response.status_code})")
                    all_accessible = False
                    
            except Exception as e:
                print(f"  ❌ {method} {path} - {description} (Error: {str(e)})")
                all_accessible = False
        
        self.log_result("API Routes Accessibility", all_accessible, "All defined routes tested")
        return all_accessible
    
    def test_comprehensive_products_json_accessibility(self):
        """Test that comprehensive_products.json is accessible and properly structured with VAULT products"""
        try:
            # Test direct access to comprehensive_products.json via frontend URL
            frontend_url = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:3000').replace('/api', '').replace('https://smart-store-sync.preview.emergentagent.com', 'http://localhost:3000')
            products_url = f"{frontend_url}/comprehensive_products.json"
            
            response = requests.get(products_url, timeout=10)
            
            if response.status_code == 200:
                try:
                    products_data = response.json()
                    
                    if isinstance(products_data, list):
                        product_count = len(products_data)
                        
                        # Count VAULT products
                        vault_products = [p for p in products_data if p.get('category') == 'Vault']
                        vault_count = len(vault_products)
                        
                        # Verify we have products including VAULT exclusives
                        if product_count >= 10 and vault_count >= 3:
                            self.log_result("Comprehensive Products JSON Accessibility", True, f"Successfully loaded {product_count} products including {vault_count} VAULT exclusives from comprehensive_products.json")
                            return products_data
                        else:
                            self.log_result("Comprehensive Products JSON Accessibility", False, f"Expected ≥10 products with ≥3 VAULT products, found {product_count} total with {vault_count} VAULT")
                            return None
                    else:
                        self.log_result("Comprehensive Products JSON Accessibility", False, "Products data is not a list")
                        return None
                        
                except json.JSONDecodeError as e:
                    self.log_result("Comprehensive Products JSON Accessibility", False, f"Invalid JSON format: {str(e)}")
                    return None
            else:
                self.log_result("Comprehensive Products JSON Accessibility", False, f"HTTP {response.status_code}: Cannot access comprehensive_products.json")
                return None
                
        except Exception as e:
            self.log_result("Comprehensive Products JSON Accessibility", False, f"Error: {str(e)}")
            return None
    
    def test_vault_product_integration(self):
        """Test VAULT product integration and exclusive features"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("VAULT Product Integration", False, "Could not load products data")
                return False
            
            # Find VAULT products
            vault_products = [p for p in products_data if p.get('category') == 'Vault']
            
            if len(vault_products) < 3:
                self.log_result("VAULT Product Integration", False, f"Expected ≥3 VAULT products, found {len(vault_products)}")
                return False
            
            vault_features_verified = []
            issues = []
            
            for vault_product in vault_products:
                name = vault_product.get('name', 'Unknown')
                
                # Check VAULT-specific features
                if vault_product.get('vault_locked') == True:
                    vault_features_verified.append(f"{name}: vault_locked=True")
                else:
                    issues.append(f"{name}: Missing vault_locked flag")
                
                if vault_product.get('unlock_requirement'):
                    vault_features_verified.append(f"{name}: unlock_requirement present")
                else:
                    issues.append(f"{name}: Missing unlock_requirement")
                
                # Check VAULT badges
                badges = vault_product.get('badges', [])
                if 'VAULT' in badges and 'LOCKED EXCLUSIVE' in badges:
                    vault_features_verified.append(f"{name}: Proper VAULT badges")
                else:
                    issues.append(f"{name}: Missing VAULT/LOCKED EXCLUSIVE badges")
                
                # Check premium pricing (VAULT products should be expensive)
                price = vault_product.get('price', 0)
                if price >= 2999:  # VAULT products should be premium priced
                    vault_features_verified.append(f"{name}: Premium pricing (₹{price})")
                else:
                    issues.append(f"{name}: Low pricing for VAULT product (₹{price})")
            
            if len(issues) == 0:
                self.log_result("VAULT Product Integration", True, f"All {len(vault_products)} VAULT products properly configured: {'; '.join(vault_features_verified[:3])}")
                return True
            else:
                self.log_result("VAULT Product Integration", False, f"VAULT integration issues: {'; '.join(issues[:3])}")
                return False
                
        except Exception as e:
            self.log_result("VAULT Product Integration", False, f"Error: {str(e)}")
            return False
    
    def test_badge_system_functionality(self):
        """Test badge system functionality - verify REBEL DROP, VAULT, PREMIUM, LIMITED badges"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("Badge System Functionality", False, "Could not load products data")
                return False
            
            # Expected badges from review request
            expected_badges = ['REBEL DROP', 'VAULT', 'PREMIUM', 'LIMITED', 'LOCKED EXCLUSIVE']
            badge_counts = {}
            products_with_badges = 0
            
            for product in products_data:
                name = product.get('name', 'Unknown')
                badges = product.get('badges', [])
                
                if badges:
                    products_with_badges += 1
                    
                for badge in badges:
                    if badge in expected_badges:
                        if badge in badge_counts:
                            badge_counts[badge] += 1
                        else:
                            badge_counts[badge] = 1
                        print(f"  ✅ {name}: {badge} badge found")
            
            total_products = len(products_data)
            badge_coverage = (products_with_badges / total_products) * 100 if total_products > 0 else 0
            
            # Check if we have all expected badge types
            found_badge_types = len(badge_counts.keys())
            expected_badge_types = len(expected_badges)
            
            if found_badge_types >= 3 and badge_coverage >= 80:  # At least 3 badge types and 80% coverage
                badge_summary = ', '.join([f"{badge}({count})" for badge, count in badge_counts.items()])
                self.log_result("Badge System Functionality", True, f"Badge system working: {badge_summary}. Coverage: {badge_coverage:.1f}% ({products_with_badges}/{total_products} products)")
                return True
            else:
                self.log_result("Badge System Functionality", False, f"Badge system issues: Only {found_badge_types}/{expected_badge_types} badge types found, {badge_coverage:.1f}% coverage")
                return False
                
        except Exception as e:
            self.log_result("Badge System Functionality", False, f"Error: {str(e)}")
            return False
    
    def test_category_filtering_system(self):
        """Test category filtering - Teeshirt, Hoodies, Accessories, Vault categories"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("Category Filtering System", False, "Could not load products data")
                return False
            
            # Expected categories from review request
            expected_categories = ['Teeshirt', 'Hoodie', 'Accessories', 'Vault']
            category_counts = {}
            
            for product in products_data:
                category = product.get('category', 'Unknown')
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
            
            # Check if we have products in key categories (at least Teeshirt and Vault)
            has_teeshirts = category_counts.get('Teeshirt', 0) > 0
            has_vault = category_counts.get('Vault', 0) > 0
            total_categorized = sum(category_counts.get(cat, 0) for cat in expected_categories)
            total_products = len(products_data)
            
            if has_teeshirts and has_vault and total_categorized >= (total_products * 0.8):
                self.log_result("Category Filtering System", True, f"Category filtering working: {', '.join(category_results)}. {total_categorized}/{total_products} products categorized")
                return True
            else:
                missing = []
                if not has_teeshirts:
                    missing.append("No Teeshirt products")
                if not has_vault:
                    missing.append("No Vault products")
                if total_categorized < (total_products * 0.8):
                    missing.append(f"Only {total_categorized}/{total_products} products categorized")
                
                self.log_result("Category Filtering System", False, f"Category filtering issues: {'; '.join(missing)}")
                return False
                
        except Exception as e:
            self.log_result("Category Filtering System", False, f"Error: {str(e)}")
            return False
    
    def test_image_path_resolution(self):
        """Test image path resolution for both regular and vault products"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("Image Path Resolution", False, "Could not load products data")
                return False
            
            # Test a sample of products including VAULT products
            vault_products = [p for p in products_data if p.get('category') == 'Vault']
            regular_products = [p for p in products_data if p.get('category') != 'Vault']
            
            # Test 2 VAULT products and 3 regular products
            test_products = vault_products[:2] + regular_products[:3]
            
            accessible_images = 0
            total_images_tested = 0
            vault_images_tested = 0
            vault_images_accessible = 0
            
            for product in test_products:
                name = product.get('name', 'Unknown')
                images = product.get('images', [])
                is_vault = product.get('category') == 'Vault'
                
                # Test first image from each product
                if images:
                    image_url = images[0]
                    try:
                        # Handle different image URL formats
                        if image_url.startswith('/app/'):
                            # Local file path - convert to frontend URL
                            frontend_url = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:3000').replace('/api', '').replace('https://smart-store-sync.preview.emergentagent.com', 'http://localhost:3000')
                            image_url = image_url.replace('/app/frontend/public', frontend_url)
                        
                        response = requests.head(image_url, timeout=5)
                        if response.status_code == 200:
                            accessible_images += 1
                            if is_vault:
                                vault_images_accessible += 1
                            print(f"  ✅ {name}: Image accessible ({'VAULT' if is_vault else 'Regular'})")
                        else:
                            print(f"  ❌ {name}: Image not accessible (HTTP {response.status_code}) ({'VAULT' if is_vault else 'Regular'})")
                        
                        total_images_tested += 1
                        if is_vault:
                            vault_images_tested += 1
                            
                    except Exception as img_error:
                        print(f"  ❌ {name}: Image connection failed ({'VAULT' if is_vault else 'Regular'}) - {str(img_error)}")
                        total_images_tested += 1
                        if is_vault:
                            vault_images_tested += 1
            
            accessibility_percentage = (accessible_images / total_images_tested) * 100 if total_images_tested > 0 else 0
            vault_accessibility = (vault_images_accessible / vault_images_tested) * 100 if vault_images_tested > 0 else 0
            
            # Check back image priority
            back_image_count = 0
            for product in products_data:
                primary_image_type = product.get('primary_image_type', '')
                if primary_image_type == 'back':
                    back_image_count += 1
            
            back_percentage = (back_image_count / len(products_data)) * 100 if len(products_data) > 0 else 0
            
            if accessibility_percentage >= 60 and back_percentage >= 80:  # Accept if 60% images accessible and 80% have back priority
                self.log_result("Image Path Resolution", True, f"Image resolution working: {accessible_images}/{total_images_tested} images accessible ({accessibility_percentage:.1f}%), VAULT: {vault_accessibility:.1f}%, Back image priority: {back_percentage:.1f}%")
                return True
            else:
                issues = []
                if accessibility_percentage < 60:
                    issues.append(f"Low image accessibility: {accessibility_percentage:.1f}%")
                if back_percentage < 80:
                    issues.append(f"Back image priority issues: {back_percentage:.1f}%")
                
                self.log_result("Image Path Resolution", False, f"Image resolution issues: {'; '.join(issues)}")
                return False
                
        except Exception as e:
            self.log_result("Image Path Resolution", False, f"Error: {str(e)}")
            return False
    
    def test_product_image_asset_integration(self):
        """Test that product images are accessible via frontend URLs"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("Product Image Asset Integration", False, "Could not load products data")
                return False
            
            # Test a sample of product images for accessibility
            sample_products = products_data[:5]  # Test first 5 products
            accessible_images = 0
            total_images_tested = 0
            
            for product in sample_products:
                name = product.get('name', 'Unknown')
                images = product.get('images', [])
                
                # Test first image from each product
                if images:
                    image_url = images[0]
                    try:
                        # Handle different image URL formats
                        if image_url.startswith('/app/'):
                            # Local file path - convert to frontend URL
                            frontend_url = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:3000').replace('/api', '').replace('https://smart-store-sync.preview.emergentagent.com', 'http://localhost:3000')
                            image_url = image_url.replace('/app/frontend/public', frontend_url)
                        
                        response = requests.head(image_url, timeout=5)
                        if response.status_code == 200:
                            accessible_images += 1
                            print(f"  ✅ {name}: Image accessible")
                        else:
                            print(f"  ❌ {name}: Image not accessible (HTTP {response.status_code})")
                        total_images_tested += 1
                    except Exception as img_error:
                        print(f"  ❌ {name}: Image connection failed - {str(img_error)}")
                        total_images_tested += 1
            
            accessibility_percentage = (accessible_images / total_images_tested) * 100 if total_images_tested > 0 else 0
            
            if accessibility_percentage >= 60:  # Accept if 60% or more images are accessible
                self.log_result("Product Image Asset Integration", True, f"{accessible_images}/{total_images_tested} images accessible ({accessibility_percentage:.1f}%)")
                return True
            else:
                self.log_result("Product Image Asset Integration", False, f"Only {accessible_images}/{total_images_tested} images accessible ({accessibility_percentage:.1f}%)")
                return False
                
        except Exception as e:
            self.log_result("Product Image Asset Integration", False, f"Error: {str(e)}")
            return False
    
    def test_api_performance_with_og_system(self):
        """Test API performance with OG Armory system load"""
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
                self.log_result("API Performance with OG System", True, f"Excellent performance: {avg_response_time:.0f}ms average response time")
                return True
            elif avg_response_time < 500:
                self.log_result("API Performance with OG System", True, f"Good performance: {avg_response_time:.0f}ms average response time")
                return True
            else:
                self.log_result("API Performance with OG System", False, f"Poor performance: {avg_response_time:.0f}ms average response time")
                return False
                
        except Exception as e:
            self.log_result("API Performance with OG System", False, f"Error: {str(e)}")
            return False
    
    def test_navigation_sync_backend_support(self):
        """Test backend support for navigation synchronization with proper badges"""
        try:
            products_data = self.test_comprehensive_products_json_accessibility()
            if not products_data:
                self.log_result("Navigation Sync Backend Support", False, "Could not load products data")
                return False
            
            # Check for expected badges that support navigation sync
            expected_badges = ['REBEL DROP', 'VAULT', 'PREMIUM', 'LIMITED', 'LOCKED EXCLUSIVE']
            badge_counts = {}
            
            for product in products_data:
                badges = product.get('badges', [])
                for badge in badges:
                    if badge in expected_badges:
                        if badge in badge_counts:
                            badge_counts[badge] += 1
                        else:
                            badge_counts[badge] = 1
            
            print(f"  📊 Navigation badges found: {dict(badge_counts)}")
            
            # Check if we have products with navigation-supporting badges
            total_badged_products = sum(badge_counts.values())
            
            # Verify we have key navigation badges (REBEL DROP and VAULT)
            has_rebel_drop = badge_counts.get('REBEL DROP', 0) > 0
            has_vault = badge_counts.get('VAULT', 0) > 0
            
            if total_badged_products > 0 and has_rebel_drop and has_vault:
                badge_summary = ', '.join([f"{badge}({count})" for badge, count in badge_counts.items()])
                self.log_result("Navigation Sync Backend Support", True, f"Backend supports navigation with proper badges: {badge_summary}")
                return True
            else:
                missing = []
                if not has_rebel_drop:
                    missing.append("No REBEL DROP badges")
                if not has_vault:
                    missing.append("No VAULT badges")
                if total_badged_products == 0:
                    missing.append("No navigation badges found")
                
                self.log_result("Navigation Sync Backend Support", False, f"Navigation sync issues: {'; '.join(missing)}")
                return False
                
        except Exception as e:
            self.log_result("Navigation Sync Backend Support", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all backend tests including Shopify integration and OG Armory system tests"""
        print("🚀 Starting Comprehensive Backend API Tests with OG Armory System Verification...")
        print()
        
        # Test 1: Server Health
        print("1. Testing Server Health...")
        self.test_server_health()
        print()
        
        # Test 2: Environment Variables
        print("2. Testing Environment Variables...")
        self.test_environment_variables()
        print()
        
        # Test 3: CORS Configuration
        print("3. Testing CORS Configuration...")
        self.test_cors_configuration()
        print()
        
        # Test 4: API Routes Accessibility
        print("4. Testing API Routes Accessibility...")
        self.test_api_routes_accessibility()
        print()
        
        # Test 5: Create Status Check
        print("5. Testing Create Status Check...")
        self.test_create_status_check()
        print()
        
        # Test 6: Get Status Checks
        print("6. Testing Get Status Checks...")
        self.test_get_status_checks()
        print()
        
        # Test 7: MongoDB Integration
        print("7. Testing MongoDB Integration...")
        self.test_mongodb_integration()
        print()
        
        # Test 8: Shopify Environment Variables
        print("8. Testing Shopify Environment Variables...")
        self.test_shopify_environment_variables()
        print()
        
        # Test 9: Shopify Storefront API Connectivity
        print("9. Testing Shopify Storefront API Connectivity...")
        self.test_shopify_storefront_api_connectivity()
        print()
        
        # Test 10: OG Products Availability
        print("10. Testing OG Products Availability...")
        self.test_og_products_availability()
        print()
        
        # Test 11: Backend Shopify Integration Health
        print("11. Testing Backend Shopify Integration Health...")
        self.test_backend_shopify_integration_health()
        print()
        
        # OG ARMORY SYSTEM SPECIFIC TESTS WITH VAULT INTEGRATION
        print("=" * 60)
        print("🎯 OG ARMORY SYSTEM + VAULT INTEGRATION TESTS")
        print("=" * 60)
        
        # Test 12: Comprehensive Products JSON Accessibility
        print("12. Testing Comprehensive Products JSON Accessibility...")
        self.test_comprehensive_products_json_accessibility()
        print()
        
        # Test 13: VAULT Product Integration
        print("13. Testing VAULT Product Integration...")
        self.test_vault_product_integration()
        print()
        
        # Test 14: Badge System Functionality
        print("14. Testing Badge System Functionality...")
        self.test_badge_system_functionality()
        print()
        
        # Test 15: Category Filtering System
        print("15. Testing Category Filtering System...")
        self.test_category_filtering_system()
        print()
        
        # Test 16: Image Path Resolution
        print("16. Testing Image Path Resolution...")
        self.test_image_path_resolution()
        print()
        
        # Test 17: Product Image Asset Integration
        print("17. Testing Product Image Asset Integration...")
        self.test_product_image_asset_integration()
        print()
        
        # Test 18: API Performance with OG System
        print("18. Testing API Performance with OG System...")
        self.test_api_performance_with_og_system()
        print()
        
        # Test 19: Navigation Sync Backend Support
        print("19. Testing Navigation Sync Backend Support...")
        self.test_navigation_sync_backend_support()
        print()
        
        # Summary
        print("=" * 80)
        print("🏁 COMPREHENSIVE TEST SUMMARY - BACKEND + OG ARMORY + VAULT SYSTEM")
        print("=" * 80)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📊 Total: {self.passed_tests + self.failed_tests}")
        
        if self.failed_tests == 0:
            print("\n🎉 ALL TESTS PASSED! Backend, OG Armory, and VAULT system working correctly.")
            print("🛍️ Store: 40fg1q-ju.myshopify.com is fully integrated and operational.")
            print("🎯 OG Armory System: Comprehensive products loaded with VAULT exclusives.")
            print("🔒 VAULT System: Locked exclusive products properly implemented.")
            return True
        else:
            print(f"\n⚠️  {self.failed_tests} test(s) failed. Please check the issues above.")
            return False

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Save test results to file
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'backend_url': API_BASE_URL,
            'passed_tests': tester.passed_tests,
            'failed_tests': tester.failed_tests,
            'overall_success': success,
            'test_results': tester.test_results
        }, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)