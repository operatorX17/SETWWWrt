#!/usr/bin/env python3
import os
import json

def verify_handoff():
    """Verify that everything is ready for web development team handoff"""
    
    print("=== WEB DEVELOPMENT HANDOFF VERIFICATION ===")
    
    # Check for package directory
    package_dirs = [d for d in os.listdir('.') if d.startswith('AI_PRODUCT_CATALOG_WEBDEV_')]
    
    if package_dirs:
        pkg_path = package_dirs[0]
        print(f"\n[SUCCESS] Package Created: {pkg_path}")
        
        # Count files in package
        files = []
        for root, dirs, filenames in os.walk(pkg_path):
            for f in filenames:
                files.append(os.path.relpath(os.path.join(root, f), pkg_path))
        
        print(f"[INFO] Total Files in Package: {len(files)}")
        
        # Check key files
        print("\n[CHECK] Key Files Present:")
        key_files = [
            'PRODUCTION_READY_CATALOG.json',
            'README.md', 
            'QUICK_START.md',
            'PACKAGE_MANIFEST.json',
            '.env.example'
        ]
        
        for kf in key_files:
            present = any(kf in f for f in files)
            status = "[OK]" if present else "[MISSING]"
            print(f"  {status} {kf}")
        
        # Check directories
        print("\n[CHECK] Package Structure:")
        dirs_present = []
        for root, dirs, _ in os.walk(pkg_path):
            for d in dirs:
                rel_dir = os.path.relpath(os.path.join(root, d), pkg_path)
                dirs_present.append(rel_dir)
                print(f"  [DIR] {rel_dir}/")
        
        # Check if PRODUCTS directory exists and has content
        products_path = os.path.join(pkg_path, 'PRODUCTS')
        if os.path.exists(products_path):
            product_categories = os.listdir(products_path)
            print(f"  [INFO] Product categories: {len(product_categories)}")
            for cat in product_categories[:3]:  # Show first 3
                print(f"    - {cat}")
            if len(product_categories) > 3:
                print(f"    ... and {len(product_categories) - 3} more")
    
    else:
        print("\n[ERROR] No package directory found!")
    
    # Check handoff documentation
    print("\n[CHECK] Handoff Documents:")
    handoff_docs = [
        'WEB_DEV_INTEGRATION_GUIDE.md',
        'WEBDEV_HANDOFF_SUMMARY.md'
    ]
    
    for doc in handoff_docs:
        exists = os.path.exists(doc)
        status = "[OK]" if exists else "[MISSING]"
        print(f"  {status} {doc}")
    
    # Check main catalog file
    catalog_path = 'FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json'
    if os.path.exists(catalog_path):
        print(f"\n[OK] Main catalog file exists: {catalog_path}")
        try:
            with open(catalog_path, 'r', encoding='utf-8') as f:
                catalog = json.load(f)
            
            metadata = catalog.get('metadata', {})
            print(f"[INFO] Catalog contains:")
            print(f"  - Products: {metadata.get('total_products', 'Unknown')}")
            print(f"  - Categories: {metadata.get('categories', 'Unknown')}")
            print(f"  - Hero Products: {metadata.get('hero_products', 'Unknown')}")
            print(f"  - Bundle Offers: {metadata.get('bundle_offers', 'Unknown')}")
        except Exception as e:
            print(f"[WARNING] Could not read catalog: {e}")
    else:
        print(f"\n[ERROR] Main catalog file missing: {catalog_path}")
    
    print("\n=== HANDOFF STATUS ===")
    
    if package_dirs and os.path.exists('WEB_DEV_INTEGRATION_GUIDE.md') and os.path.exists('WEBDEV_HANDOFF_SUMMARY.md'):
        print("[SUCCESS] ✓ Ready for Web Development Team")
        print("\n[NEXT STEPS]")
        print("1. Share the package directory with web development team")
        print("2. Provide WEB_DEV_INTEGRATION_GUIDE.md for complete setup")
        print("3. Reference WEBDEV_HANDOFF_SUMMARY.md for quick overview")
        print("4. Web team should start with QUICK_START.md in the package")
    else:
        print("[ERROR] ✗ Handoff not ready - missing components")

if __name__ == "__main__":
    verify_handoff()