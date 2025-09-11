#!/usr/bin/env python3
"""
Prepare Web Development Package
Creates a zip file with all essential files for web development agent
"""

import os
import zipfile
import json
from datetime import datetime
import shutil

def create_webdev_package():
    """Create a comprehensive package for web development agent"""
    
    # Define base directory
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    package_dir = os.path.join(base_dir, 'webdev_package')
    
    # Create package directory
    if os.path.exists(package_dir):
        shutil.rmtree(package_dir)
    os.makedirs(package_dir)
    
    print(f"Creating web development package in: {package_dir}")
    
    # Essential files to include
    essential_files = [
        # Product data
        'out/grouped_products.json',
        'out/ai_products_for_admin.json', 
        'out/front_selection.json',
        'out/product_grouping_stats.json',
        
        # Backend code
        'models/Product.js',
        'routes/products.js',
        'routes/sync.js',
        'routes/upload.js',
        'server.js',
        'package.json',
        
        # Documentation
        'docs/PRODUCT_LINKING_EXPLANATION.md',
        'docs/FILES_FOR_WEB_DEV.md',
        'SHARE_WITH_WEB_DEV.txt',
        'README.md'
    ]
    
    # Copy essential files
    copied_files = []
    for file_path in essential_files:
        src = os.path.join(base_dir, file_path)
        if os.path.exists(src):
            # Create directory structure in package
            dst_dir = os.path.join(package_dir, os.path.dirname(file_path))
            os.makedirs(dst_dir, exist_ok=True)
            
            dst = os.path.join(package_dir, file_path)
            shutil.copy2(src, dst)
            copied_files.append(file_path)
            print(f"✓ Copied: {file_path}")
        else:
            print(f"✗ Missing: {file_path}")
    
    # Copy image directories
    image_dirs = ['out/front_view_designs', 'out/back_view_designs']
    for img_dir in image_dirs:
        src_dir = os.path.join(base_dir, img_dir)
        if os.path.exists(src_dir):
            dst_dir = os.path.join(package_dir, img_dir)
            shutil.copytree(src_dir, dst_dir)
            
            # Count images
            image_count = sum([len(files) for r, d, files in os.walk(dst_dir)])
            print(f"✓ Copied: {img_dir} ({image_count} images)")
            copied_files.append(f"{img_dir}/ ({image_count} images)")
        else:
            print(f"✗ Missing: {img_dir}")
    
    # Copy client directory if exists
    client_dir = os.path.join(base_dir, 'client')
    if os.path.exists(client_dir):
        dst_client = os.path.join(package_dir, 'client')
        shutil.copytree(client_dir, dst_client)
        print(f"✓ Copied: client/ (React components)")
        copied_files.append("client/ (React components)")
    
    # Create package manifest
    manifest = {
        'package_name': 'AI Product Catalog - Web Dev Package',
        'created_at': datetime.now().isoformat(),
        'description': 'Complete package for web development agent integration',
        'total_products': 47,
        'files_included': copied_files,
        'integration_ready': True,
        'platforms_supported': ['Shopify', 'WooCommerce', 'Custom Store'],
        'key_features': [
            'Unified product catalog with front/back views',
            'SEO-optimized product handles and descriptions',
            'Price band categorization',
            'Visual coolness scoring',
            'Hero card ready products',
            'Complete backend API',
            'Database schema included',
            'Image organization by design'
        ],
        'next_steps': [
            'Review grouped_products.json for product structure',
            'Set up database using models/Product.js schema',
            'Deploy backend using server.js',
            'Configure image hosting for front_view_designs/',
            'Integrate with chosen e-commerce platform',
            'Set up admin dashboard using ai_products_for_admin.json'
        ]
    }
    
    # Save manifest
    manifest_path = os.path.join(package_dir, 'PACKAGE_MANIFEST.json')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    print(f"✓ Created: PACKAGE_MANIFEST.json")
    
    # Create quick start guide
    quick_start = """
# Quick Start Guide for Web Development Agent

## Package Contents
This package contains everything needed to integrate the AI-generated product catalog into a web store.

## Key Files to Start With
1. **grouped_products.json** - Main product catalog (47 products)
2. **models/Product.js** - Database schema
3. **server.js** - Backend server setup
4. **front_view_designs/** - Product images

## Integration Steps
1. Review PACKAGE_MANIFEST.json for complete file list
2. Set up database using Product.js schema
3. Deploy backend API (server.js + routes/)
4. Configure image hosting
5. Integrate with your e-commerce platform

## Product Data Structure
- Each product has unique ID, SEO handle, price band
- Images organized by design name
- Products support multiple views (front/back)
- Hero-ready products marked for featured display
- Visual coolness scores for sorting

## Support Files
- **SHARE_WITH_WEB_DEV.txt** - File priority list
- **FILES_FOR_WEB_DEV.md** - Detailed documentation
- **PRODUCT_LINKING_EXPLANATION.md** - Technical architecture

## Ready for Integration
This catalog is ready for Shopify, WooCommerce, or custom store platforms.
"""
    
    quick_start_path = os.path.join(package_dir, 'QUICK_START.md')
    with open(quick_start_path, 'w', encoding='utf-8') as f:
        f.write(quick_start.strip())
    print(f"✓ Created: QUICK_START.md")
    
    # Calculate package size
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(package_dir):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            total_size += os.path.getsize(filepath)
    
    size_mb = total_size / (1024 * 1024)
    
    # Create zip file
    zip_path = os.path.join(base_dir, f'webdev_package_{datetime.now().strftime("%Y%m%d_%H%M%S")}.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(package_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_name = os.path.relpath(file_path, package_dir)
                zipf.write(file_path, arc_name)
    
    print(f"\n🎉 Package created successfully!")
    print(f"📁 Package directory: {package_dir}")
    print(f"📦 Zip file: {zip_path}")
    print(f"📊 Total size: {size_mb:.2f} MB")
    print(f"📋 Files included: {len(copied_files)}")
    print(f"\n📤 Ready to share with web development agent!")
    
    return zip_path, package_dir

if __name__ == "__main__":
    create_webdev_package()