#!/usr/bin/env python3
"""
Correct Image Analysis Script
Analyzes the actual image distribution in PRODUCTS folder vs catalog linking
"""

import os
import json
from pathlib import Path

def analyze_actual_images():
    """Count actual images in PRODUCTS folder"""
    products_dir = Path("PRODUCTS")
    
    front_images = []
    back_images = []
    other_images = []
    
    # Walk through all image files
    for img_file in products_dir.rglob("*.jpeg"):
        parent_dir = img_file.parent.name.lower()
        
        if parent_dir == "front":
            front_images.append(str(img_file))
        elif parent_dir in ["back", "Back"]:
            back_images.append(str(img_file))
        else:
            other_images.append(str(img_file))
    
    return front_images, back_images, other_images

def analyze_catalog_linking():
    """Analyze what the catalog actually linked"""
    try:
        with open("out/PRODUCTION_READY_CATALOG.json", "r", encoding="utf-8") as f:
            catalog = json.load(f)
        
        linked_front = 0
        linked_back = 0
        missing_front = 0
        missing_back = 0
        
        for product in catalog.get("products", []):
            images = product.get("images", {})
            
            front_img = images.get("front")
            back_img = images.get("back")
            
            if front_img and front_img != "null":
                linked_front += 1
            else:
                missing_front += 1
                
            if back_img and back_img != "null":
                linked_back += 1
            else:
                missing_back += 1
        
        return linked_front, linked_back, missing_front, missing_back
    except Exception as e:
        print(f"Error reading catalog: {e}")
        return 0, 0, 0, 0

def main():
    print("=== CORRECT IMAGE ANALYSIS ===")
    print()
    
    # Analyze actual images in PRODUCTS folder
    front_imgs, back_imgs, other_imgs = analyze_actual_images()
    
    print("📁 ACTUAL IMAGES IN PRODUCTS FOLDER:")
    print(f"   Front images: {len(front_imgs)}")
    print(f"   Back images: {len(back_imgs)}")
    print(f"   Other images: {len(other_imgs)}")
    print(f"   Total images: {len(front_imgs) + len(back_imgs) + len(other_imgs)}")
    print()
    
    # Analyze catalog linking
    linked_front, linked_back, missing_front, missing_back = analyze_catalog_linking()
    
    print("🔗 CATALOG LINKING STATUS:")
    print(f"   Linked front: {linked_front}")
    print(f"   Linked back: {linked_back}")
    print(f"   Missing front: {missing_front}")
    print(f"   Missing back: {missing_back}")
    print()
    
    # Analysis
    print("📊 ANALYSIS:")
    print(f"   Available front vs linked: {len(front_imgs)} available, {linked_front} linked")
    print(f"   Available back vs linked: {len(back_imgs)} available, {linked_back} linked")
    
    if len(front_imgs) > len(back_imgs):
        print(f"   ✅ MORE FRONT IMAGES AVAILABLE ({len(front_imgs)} vs {len(back_imgs)})")
    else:
        print(f"   ❌ More back images available ({len(back_imgs)} vs {len(front_imgs)})")
    
    # Linking efficiency
    front_efficiency = (linked_front / len(front_imgs)) * 100 if front_imgs else 0
    back_efficiency = (linked_back / len(back_imgs)) * 100 if back_imgs else 0
    
    print(f"   Front linking efficiency: {front_efficiency:.1f}%")
    print(f"   Back linking efficiency: {back_efficiency:.1f}%")
    
    # Save detailed report
    report = {
        "actual_images": {
            "front_count": len(front_imgs),
            "back_count": len(back_imgs),
            "other_count": len(other_imgs),
            "front_images": front_imgs,
            "back_images": back_imgs,
            "other_images": other_imgs
        },
        "catalog_linking": {
            "linked_front": linked_front,
            "linked_back": linked_back,
            "missing_front": missing_front,
            "missing_back": missing_back
        },
        "analysis": {
            "more_front_than_back": len(front_imgs) > len(back_imgs),
            "front_efficiency_percent": front_efficiency,
            "back_efficiency_percent": back_efficiency
        }
    }
    
    with open("out/correct_image_analysis.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n📄 Detailed report saved to: out/correct_image_analysis.json")

if __name__ == "__main__":
    main()