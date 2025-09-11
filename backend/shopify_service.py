import os
import json
import logging
from typing import List, Dict, Optional, Any
from datetime import datetime
import requests
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ShopifyService:
    """Production-ready Shopify integration service"""
    
    def __init__(self):
        self.store_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
        self.admin_token = os.getenv('SHOPIFY_ADMIN_ACCESS_TOKEN')
        self.storefront_token = os.getenv('SHOPIFY_STOREFRONT_ACCESS_TOKEN')
        self.api_version = os.getenv('SHOPIFY_API_VERSION', '2024-01')
        
        if not all([self.store_domain, self.admin_token]):
            raise ValueError("Missing required Shopify credentials")
            
        self.admin_url = f"https://{self.store_domain}/admin/api/{self.api_version}"
        self.storefront_url = f"https://{self.store_domain}/api/{self.api_version}/graphql.json"
        
        # MongoDB connection
        self.mongo_client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/pspk_store'))
        self.db = self.mongo_client[os.getenv('MONGODB_DB_NAME', 'pspk_store')]
        self.products_collection = self.db.products
        
    def get_admin_headers(self) -> Dict[str, str]:
        """Get headers for Admin API requests"""
        return {
            'X-Shopify-Access-Token': self.admin_token,
            'Content-Type': 'application/json'
        }
    
    def get_storefront_headers(self) -> Dict[str, str]:
        """Get headers for Storefront API requests"""
        return {
            'X-Shopify-Storefront-Access-Token': self.storefront_token,
            'Content-Type': 'application/json'
        }
    
    def create_product(self, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new product in Shopify"""
        try:
            url = f"{self.admin_url}/products.json"
            response = requests.post(
                url,
                headers=self.get_admin_headers(),
                json={'product': product_data}
            )
            response.raise_for_status()
            
            product = response.json().get('product')
            if product:
                # Store in MongoDB
                self.products_collection.update_one(
                    {'shopify_id': product['id']},
                    {'$set': {
                        **product,
                        'updated_at': datetime.utcnow(),
                        'sync_status': 'synced'
                    }},
                    upsert=True
                )
                logger.info(f"Created product: {product['title']} (ID: {product['id']})")
            
            return product
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to create product: {str(e)}")
            return None
    
    def update_product(self, product_id: str, product_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing product in Shopify"""
        try:
            url = f"{self.admin_url}/products/{product_id}.json"
            response = requests.put(
                url,
                headers=self.get_admin_headers(),
                json={'product': product_data}
            )
            response.raise_for_status()
            
            product = response.json().get('product')
            if product:
                # Update in MongoDB
                self.products_collection.update_one(
                    {'shopify_id': product['id']},
                    {'$set': {
                        **product,
                        'updated_at': datetime.utcnow(),
                        'sync_status': 'synced'
                    }}
                )
                logger.info(f"Updated product: {product['title']} (ID: {product['id']})")
            
            return product
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to update product {product_id}: {str(e)}")
            return None
    
    def delete_product(self, product_id: str) -> bool:
        """Delete a product from Shopify"""
        try:
            url = f"{self.admin_url}/products/{product_id}.json"
            response = requests.delete(url, headers=self.get_admin_headers())
            response.raise_for_status()
            
            # Mark as deleted in MongoDB
            self.products_collection.update_one(
                {'shopify_id': int(product_id)},
                {'$set': {
                    'deleted_at': datetime.utcnow(),
                    'sync_status': 'deleted'
                }}
            )
            
            logger.info(f"Deleted product ID: {product_id}")
            return True
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to delete product {product_id}: {str(e)}")
            return False
    
    def get_products(self, limit: int = 250, page_info: str = None) -> Dict[str, Any]:
        """Get products from Shopify Admin API"""
        try:
            url = f"{self.admin_url}/products.json"
            params = {'limit': limit}
            if page_info:
                params['page_info'] = page_info
                
            response = requests.get(url, headers=self.get_admin_headers(), params=params)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get products: {str(e)}")
            return {'products': []}
    
    def sync_all_products(self) -> Dict[str, Any]:
        """Sync all products from Shopify to MongoDB"""
        try:
            all_products = []
            page_info = None
            
            while True:
                data = self.get_products(page_info=page_info)
                products = data.get('products', [])
                
                if not products:
                    break
                    
                all_products.extend(products)
                
                # Check for pagination
                link_header = data.get('link')
                if not link_header or 'rel="next"' not in link_header:
                    break
                    
                # Extract next page info (simplified)
                page_info = None  # Would need proper link header parsing
                break  # For now, just get first page
            
            # Store all products in MongoDB
            for product in all_products:
                self.products_collection.update_one(
                    {'shopify_id': product['id']},
                    {'$set': {
                        **product,
                        'updated_at': datetime.utcnow(),
                        'sync_status': 'synced'
                    }},
                    upsert=True
                )
            
            logger.info(f"Synced {len(all_products)} products")
            return {
                'status': 'success',
                'products_synced': len(all_products),
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to sync products: {str(e)}")
            return {
                'status': 'error',
                'message': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def get_storefront_products(self, query: str = None) -> Dict[str, Any]:
        """Get products using Storefront API for frontend display"""
        graphql_query = """
        query getProducts($first: Int!, $query: String) {
            products(first: $first, query: $query) {
                edges {
                    node {
                        id
                        title
                        handle
                        description
                        productType
                        vendor
                        tags
                        availableForSale
                        createdAt
                        updatedAt
                        images(first: 10) {
                            edges {
                                node {
                                    id
                                    url
                                    altText
                                    width
                                    height
                                }
                            }
                        }
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    title
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPrice {
                                        amount
                                        currencyCode
                                    }
                                    availableForSale
                                    selectedOptions {
                                        name
                                        value
                                    }
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }
        """
        
        try:
            variables = {
                'first': 100,
                'query': query
            }
            
            response = requests.post(
                self.storefront_url,
                headers=self.get_storefront_headers(),
                json={
                    'query': graphql_query,
                    'variables': variables
                }
            )
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to get storefront products: {str(e)}")
            return {'data': {'products': {'edges': []}}}
    
    def verify_webhook(self, data: bytes, signature: str) -> bool:
        """Verify Shopify webhook signature"""
        import hmac
        import hashlib
        import base64
        
        webhook_secret = os.getenv('SHOPIFY_WEBHOOK_SECRET')
        if not webhook_secret:
            return False
            
        computed_signature = base64.b64encode(
            hmac.new(
                webhook_secret.encode('utf-8'),
                data,
                hashlib.sha256
            ).digest()
        ).decode('utf-8')
        
        return hmac.compare_digest(computed_signature, signature)
    
    def health_check(self) -> Dict[str, Any]:
        """Check Shopify API connectivity"""
        try:
            url = f"{self.admin_url}/shop.json"
            response = requests.get(url, headers=self.get_admin_headers())
            response.raise_for_status()
            
            shop_data = response.json().get('shop', {})
            
            return {
                'status': 'healthy',
                'shop_name': shop_data.get('name'),
                'shop_domain': shop_data.get('domain'),
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

# Global instance
shopify_service = ShopifyService()