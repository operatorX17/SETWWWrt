#!/usr/bin/env python3
"""
⚡ QUICK OG STORE SETUP
Ultra-fast setup with your image directory structure
"""

import os
import sys
from shopify_automation import ShopifyOGAutomation
from upload_images import ShopifyImageUploader

def quick_setup():
    """Run ultra-fast OG store setup"""
    print("⚡ QUICK OG STORE SETUP")
    print("=" * 40)
    
    # Get image directory from user
    print("📁 Please provide your product images directory path:")
    print("   Example: /Users/yourname/Desktop/PRODUCTS")
    print("   Example: C:\\Users\\yourname\\Desktop\\PRODUCTS")
    
    image_dir = input("📂 Enter your images directory path: ").strip()
    
    if not os.path.exists(image_dir):
        print(f"❌ Directory not found: {image_dir}")
        return False
    
    # Confirm directory structure
    print(f"\n🔍 Scanning directory: {image_dir}")
    categories = []
    total_images = 0
    
    for item in os.listdir(image_dir):
        item_path = os.path.join(image_dir, item)
        if os.path.isdir(item_path):
            images = [f for f in os.listdir(item_path) 
                     if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
            if images:
                categories.append(f"  📁 {item}: {len(images)} images")
                total_images += len(images)
    
    print(f"\n📊 Found {len(categories)} categories with {total_images} total images:")
    for cat in categories:
        print(cat)
    
    # Confirm setup
    print(f"\n🚀 Ready to create {total_images} OG products automatically!")
    print("   ✅ Auto-generate titles, descriptions, prices")
    print("   ✅ Apply OG tags and metadata")
    print("   ✅ Create collections")
    print("   ✅ Upload images")
    print("   ✅ Setup OG store branding")
    
    confirm = input("\n💥 Proceed with automation? (y/n): ").lower().strip()
    
    if confirm != 'y':
        print("❌ Setup cancelled")
        return False
    
    try:
        # Step 1: Run main automation
        print("\n🔥 STEP 1: Creating products and collections...")
        automation = ShopifyOGAutomation()
        results = automation.run_complete_setup(image_dir)
        
        # Step 2: Upload images
        print("\n🖼️ STEP 2: Uploading product images...")
        uploader = ShopifyImageUploader()
        uploader.match_and_upload_images(image_dir)
        
        print("\n🎉 QUICK SETUP COMPLETE!")
        print("✅ Your OG store is ready!")
        
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {str(e)}")
        return False

def test_api_connection():
    """Test Shopify API connection"""
    print("🔌 Testing Shopify API connection...")
    
    automation = ShopifyOGAutomation()
    
    # Test basic API call
    response = automation.make_request("GET", "/shop.json")
    
    if response:
        shop_name = response.get("shop", {}).get("name", "Unknown")
        print(f"✅ Connected to store: {shop_name}")
        return True
    else:
        print("❌ API connection failed")
        return False

def main():
    """Main execution"""
    print("🔥 OG STORE AUTOMATION TOOLKIT")
    print("=" * 50)
    
    # Test API first
    if not test_api_connection():
        print("💡 Please check your API credentials in the scripts")
        return
    
    # Run quick setup
    success = quick_setup()
    
    if success:
        print("\n🎯 NEXT STEPS:")
        print("1. Check your Shopify store - products should be live!")
        print("2. Visit your store URL to see the OG theme")
        print("3. Test the frontend app - it should show real data now")
        print("\n🚀 Your OG store is production ready!")

if __name__ == "__main__":
    main()