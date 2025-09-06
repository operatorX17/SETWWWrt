#!/usr/bin/env python3
"""
OG Product Creator - Creates premium OG-themed products for Shopify
Handles front/back images and generates cinematic product names
"""
import os
import json
import requests
import time
from pathlib import Path
import hashlib
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/backend/.env')

class OGProductCreator:
    def __init__(self):
        self.shopify_domain = os.getenv('SHOPIFY_STORE_DOMAIN')
        self.admin_api_key = os.getenv('SHOPIFY_ADMIN_API_KEY')
        self.admin_api_secret = os.getenv('SHOPIFY_ADMIN_API_SECRET')
        
        if not all([self.shopify_domain, self.admin_api_key]):
            raise ValueError("Missing Shopify credentials in environment")
            
        self.base_url = f"https://{self.shopify_domain}/admin/api/2023-10"
        self.headers = {
            'X-Shopify-Access-Token': self.admin_api_key,
            'Content-Type': 'application/json'
        }
        
        # OG-themed product names based on categories
        self.og_names = {
            'teeshirt': [
                'OG Rebel Tee', 'Firestorm Fighter Tee', 'Shadow Warrior Tee',
                'Blood Moon Rebel Tee', 'Dark Thunder Tee', 'Venom Strike Tee',
                'Iron Wolf Tee', 'Midnight Predator Tee', 'Savage Storm Tee',
                'Black Phoenix Tee', 'Silent Assassin Tee', 'Crimson Beast Tee',
                'Steel Hawk Tee', 'Night Fury Tee', 'Brutal Legion Tee',
                'Ghost Hunter Tee', 'War Machine Tee'
            ],
            'hoodies': [
                'OG Assassin Hoodie', 'Death Stalker Hoodie', 'Storm Breaker Hoodie',
                'Venom Shadow Hoodie', 'Iron Predator Hoodie', 'Blood Wolf Hoodie',
                'Dark Phoenix Hoodie', 'Night Hunter Hoodie', 'Savage Beast Hoodie',
                'Steel Thunder Hoodie', 'Crimson Fury Hoodie', 'Ghost Warrior Hoodie',
                'War Demon Hoodie', 'Black Storm Hoodie', 'Silent Death Hoodie',
                'Brutal Machine Hoodie', 'Iron Legion Hoodie', 'Shadow Strike Hoodie',
                'Midnight Hawk Hoodie', 'Venom Beast Hoodie', 'Fire Storm Hoodie',
                'Blood Machine Hoodie'
            ],
            'posters': [
                'OG Firestorm Poster', 'Rebel Army Poster', 'Dark Legion Poster',
                'Blood Moon Poster', 'Iron Wolf Poster', 'Shadow Beast Poster',
                'War Machine Poster', 'Crimson Storm Poster', 'Death Hunter Poster',
                'Savage Predator Poster'
            ],
            'sweatshirts': [
                'OG War Machine Sweatshirt', 'Blood Thunder Sweatshirt', 'Iron Beast Sweatshirt',
                'Shadow Legion Sweatshirt', 'Dark Predator Sweatshirt'
            ],
            'full shirts': [
                'OG Formal Assassin Shirt', 'Executive Predator Shirt', 'Business Beast Shirt',
                'Corporate Hunter Shirt', 'Elite Warrior Shirt'
            ],
            'wallet': ['OG Rebel Wallet', 'Shadow Beast Wallet'],
            'slippers': ['OG Beast Slippers', 'Predator Slides', 'Warrior Sandals'],
            'hats': ['OG Beast Cap', 'Predator Hat', 'Hunter Cap'],
            'headband': ['OG Warrior Headband']
        }
        
        self.created_collections = set()
        self.created_products = []

    def get_premium_name(self, category, index=0):
        """Generate premium OG-themed product names"""
        category_lower = category.lower()
        
        # Map category variations to standard names
        if category_lower in ['teeshirt', 't-shirt', 'tshirt']:
            names = self.og_names['teeshirt']
        elif category_lower in ['hoodie', 'hoodies']:
            names = self.og_names['hoodies']
        elif category_lower in ['poster', 'posters']:
            names = self.og_names['posters']
        elif category_lower in ['sweatshirt', 'sweatshirts']:
            names = self.og_names['sweatshirts']
        elif category_lower in ['full shirt', 'full shirts', 'shirt']:
            names = self.og_names['full shirts']
        elif category_lower == 'wallet':
            names = self.og_names['wallet']
        elif category_lower in ['slipper', 'slippers']:
            names = self.og_names['slippers']
        elif category_lower in ['hat', 'hats', 'cap']:
            names = self.og_names['hats']
        elif category_lower in ['headband']:
            names = self.og_names['headband']
        else:
            # Fallback for unknown categories
            names = [f'OG {category.title()} Beast', f'OG {category.title()} Predator', f'OG {category.title()} Hunter']
        
        # Return name based on index, cycle through if needed
        return names[index % len(names)]

    def create_collection_if_not_exists(self, category):
        """Create OG-themed collection for category"""
        collection_title = f"OG {category.title()}"
        
        if collection_title in self.created_collections:
            return
            
        collection_data = {
            "collection": {
                "title": collection_title,
                "handle": f"og-{category.lower().replace(' ', '-')}",
                "body_html": f"<p>Premium OG collection featuring the finest {category} for true fans. Each piece is crafted for warriors who demand excellence.</p>",
                "published": True,
                "metafields": [
                    {
                        "namespace": "ogfilm",
                        "key": "category_type",
                        "value": category,
                        "type": "single_line_text_field"
                    },
                    {
                        "namespace": "ogfilm", 
                        "key": "is_premium",
                        "value": "true",
                        "type": "boolean"
                    }
                ]
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/collections.json",
                headers=self.headers,
                json=collection_data
            )
            
            if response.status_code == 201:
                print(f"✅ Created collection: {collection_title}")
                self.created_collections.add(collection_title)
            else:
                print(f"❌ Failed to create collection {collection_title}: {response.text}")
                
        except Exception as e:
            print(f"❌ Error creating collection {collection_title}: {str(e)}")
            
        # Small delay to prevent rate limiting
        time.sleep(0.5)

    def upload_image_to_shopify(self, image_path):
        """Upload image to Shopify and return the image URL"""
        try:
            with open(image_path, 'rb') as img_file:
                image_data = img_file.read()
                
            # Convert image to base64
            import base64
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            # Get file extension
            file_ext = Path(image_path).suffix.lower()
            if file_ext == '.jpg':
                file_ext = '.jpeg'
                
            return {
                "attachment": image_base64,
                "filename": f"{Path(image_path).stem}{file_ext}"
            }
        except Exception as e:
            print(f"❌ Error uploading image {image_path}: {str(e)}")
            return None

    def create_product(self, category, product_folder, product_name):
        """Create a single product with front/back images"""
        
        # Find all images in the product folder
        image_paths = []
        product_path = Path(product_folder)
        
        # Look for front/back folders or color variant folders
        if (product_path / 'front').exists() and (product_path / 'back').exists():
            # Handle front/back structure
            front_images = list((product_path / 'front').glob('*.jpg')) + list((product_path / 'front').glob('*.jpeg')) + list((product_path / 'front').glob('*.png'))
            back_images = list((product_path / 'back').glob('*.jpg')) + list((product_path / 'back').glob('*.jpeg')) + list((product_path / 'back').glob('*.png'))
            
            # Add front images first, then back images
            image_paths.extend(front_images)
            image_paths.extend(back_images)
            
        elif any((product_path / subdir).exists() for subdir in ['Blue', 'black', 'grey', 'white', 'red']):
            # Handle color variant structure - take one image from each color
            for color_dir in product_path.iterdir():
                if color_dir.is_dir():
                    color_images = list(color_dir.glob('*.jpg')) + list(color_dir.glob('*.jpeg')) + list(color_dir.glob('*.png'))
                    if color_images:
                        image_paths.append(color_images[0])  # Take first image from each color
        else:
            # Direct images in the folder
            image_paths = list(product_path.glob('*.jpg')) + list(product_path.glob('*.jpeg')) + list(product_path.glob('*.png'))
        
        if not image_paths:
            print(f"⚠️ No images found for {product_name}")
            return None
            
        print(f"📷 Found {len(image_paths)} images for {product_name}")
        
        # Upload images and prepare product data
        product_images = []
        for img_path in image_paths[:5]:  # Limit to 5 images per product
            image_data = self.upload_image_to_shopify(img_path)
            if image_data:
                product_images.append(image_data)
        
        # Create product data
        product_data = {
            "product": {
                "title": product_name,
                "body_html": f"<p><strong>{product_name}</strong> - Premium OG merchandise for true fans. Crafted with precision and designed for warriors.</p><p>Every product is a weapon. Every fan is a soldier.</p>",
                "vendor": "DVV Entertainment",
                "product_type": category.title(),
                "published": True,
                "tags": ["OG", "Premium", "Limited", "Fan Arsenal", category.title()],
                "images": product_images,
                "variants": [
                    {
                        "title": "Default Title",
                        "price": self.get_og_price(category),
                        "inventory_quantity": 50,
                        "inventory_management": "shopify",
                        "fulfillment_service": "manual",
                        "requires_shipping": True,
                        "taxable": True,
                        "weight": self.get_product_weight(category),
                        "weight_unit": "g"
                    }
                ],
                "metafields": [
                    {
                        "namespace": "ogfilm",
                        "key": "rank",
                        "value": "rebel_drop",
                        "type": "single_line_text_field"
                    },
                    {
                        "namespace": "ogfilm",
                        "key": "is_limited",
                        "value": "true", 
                        "type": "boolean"
                    },
                    {
                        "namespace": "ogfilm",
                        "key": "category",
                        "value": category,
                        "type": "single_line_text_field"
                    }
                ]
            }
        }
        
        try:
            response = requests.post(
                f"{self.base_url}/products.json",
                headers=self.headers,
                json=product_data
            )
            
            if response.status_code == 201:
                product = response.json()['product']
                print(f"✅ Created product: {product_name} (ID: {product['id']})")
                self.created_products.append({
                    'id': product['id'],
                    'title': product_name,
                    'category': category
                })
                return product
            else:
                print(f"❌ Failed to create product {product_name}: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating product {product_name}: {str(e)}")
            return None
            
        # Rate limiting delay
        time.sleep(1)

    def get_og_price(self, category):
        """Get OG-themed pricing for categories"""
        pricing = {
            'teeshirt': '1299.00',
            'hoodies': '2499.00', 
            'posters': '899.00',
            'sweatshirts': '1999.00',
            'full shirts': '1799.00',
            'wallet': '1499.00',
            'slippers': '999.00',
            'hats': '699.00',
            'headband': '599.00'
        }
        return pricing.get(category.lower(), '1299.00')

    def get_product_weight(self, category):
        """Get estimated weight for shipping"""
        weights = {
            'teeshirt': 200,
            'hoodies': 600,
            'posters': 100,
            'sweatshirts': 500,
            'full shirts': 300,
            'wallet': 150,
            'slippers': 400,
            'hats': 200,
            'headband': 50
        }
        return weights.get(category.lower(), 200)

    def delete_existing_products(self):
        """Delete existing products to start fresh"""
        try:
            response = requests.get(
                f"{self.base_url}/products.json?limit=250",
                headers=self.headers
            )
            
            if response.status_code == 200:
                products = response.json().get('products', [])
                print(f"🗑️ Found {len(products)} existing products to delete")
                
                for product in products:
                    delete_response = requests.delete(
                        f"{self.base_url}/products/{product['id']}.json",
                        headers=self.headers
                    )
                    if delete_response.status_code == 200:
                        print(f"🗑️ Deleted: {product['title']}")
                    time.sleep(0.3)  # Rate limiting
                        
        except Exception as e:
            print(f"❌ Error deleting products: {str(e)}")

    def process_all_products(self, delete_existing=True):
        """Process all products in the PRODUCTS directory"""
        
        if delete_existing:
            print("🗑️ Deleting existing products...")
            self.delete_existing_products()
            
        products_dir = Path('/app/PRODUCTS')
        if not products_dir.exists():
            print("❌ PRODUCTS directory not found!")
            return
            
        print(f"🚀 Starting OG Product Creation...")
        print("=" * 60)
        
        # Track product indices for unique naming
        category_indices = {}
        
        for category_dir in products_dir.iterdir():
            if not category_dir.is_dir():
                continue
                
            category = category_dir.name
            print(f"\n📂 Processing category: {category}")
            
            # Create collection for this category
            self.create_collection_if_not_exists(category)
            
            category_indices[category] = 0
            
            # Process each product in the category
            for product_dir in category_dir.iterdir():
                if not product_dir.is_dir():
                    continue
                    
                # Generate premium OG name
                product_name = self.get_premium_name(category, category_indices[category])
                category_indices[category] += 1
                
                print(f"  🎯 Creating: {product_name}")
                
                # Create the product
                product = self.create_product(category, product_dir, product_name)
                
                if product:
                    print(f"  ✅ Success: {product_name}")
                else:
                    print(f"  ❌ Failed: {product_name}")
                    
        print("\n" + "=" * 60)
        print(f"🎉 OG Product Creation Complete!")
        print(f"📊 Created {len(self.created_products)} products")
        print(f"📚 Created {len(self.created_collections)} collections")
        
        # Summary
        print("\n📋 SUMMARY:")
        for product in self.created_products:
            print(f"  • {product['title']} ({product['category']})")

def main():
    print("🔥 OG PRODUCT CREATOR - Premium Shopify Integration 🔥")
    print("=" * 60)
    
    try:
        creator = OGProductCreator()
        creator.process_all_products(delete_existing=True)
        
    except Exception as e:
        print(f"💥 FATAL ERROR: {str(e)}")
        return False
        
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\n🎯 ALL SYSTEMS GO! Products ready for battle! 🎯")
    else:
        print("\n💀 MISSION FAILED! Check errors above. 💀")