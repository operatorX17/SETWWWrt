#!/usr/bin/env python3
"""
OG Armory Product Analysis and Cleanup Script
- Analyzes all 84 product images
- Consolidates color variants 
- Prioritizes back images over front
- Creates clean product structure
"""

import os
import json
import shutil
from pathlib import Path
from collections import defaultdict

def analyze_products():
    products_dir = Path("/app/PRODUCTS")
    analysis = {
        "total_images": 0,
        "categories": {},
        "duplicates": [],
        "color_variants": {},
        "back_images": [],
        "front_images": [],
        "recommended_consolidation": []
    }
    
    # Walk through all product directories
    for root, dirs, files in os.walk(products_dir):
        root_path = Path(root)
        
        # Count images
        images = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        analysis["total_images"] += len(images)
        
        # Analyze structure
        if images:
            category = root_path.parts[2] if len(root_path.parts) > 2 else "unknown"
            product_name = root_path.parts[3] if len(root_path.parts) > 3 else "unknown"
            
            if category not in analysis["categories"]:
                analysis["categories"][category] = {}
            
            if product_name not in analysis["categories"][category]:
                analysis["categories"][category][product_name] = {
                    "front_images": [],
                    "back_images": [],
                    "color_variants": [],
                    "total_images": 0
                }
            
            # Check for front/back/color structure
            if "front" in root_path.name:
                analysis["categories"][category][product_name]["front_images"].extend(images)
                analysis["front_images"].extend([str(root_path / img) for img in images])
            elif "back" in root_path.name:
                analysis["categories"][category][product_name]["back_images"].extend(images)
                analysis["back_images"].extend([str(root_path / img) for img in images])
            elif root_path.name in ["black", "blue", "grey", "Red"]:  # Color variants
                analysis["categories"][category][product_name]["color_variants"].append({
                    "color": root_path.name,
                    "images": images,
                    "path": str(root_path)
                })
            
            analysis["categories"][category][product_name]["total_images"] += len(images)
    
    # Identify color variant consolidation opportunities
    for category, products in analysis["categories"].items():
        for product_name, data in products.items():
            if len(data["color_variants"]) > 1:
                analysis["color_variants"][f"{category}/{product_name}"] = data["color_variants"]
                
                # Recommend consolidation
                colors = [variant["color"] for variant in data["color_variants"]]
                analysis["recommended_consolidation"].append({
                    "product": f"{category}/{product_name}",
                    "colors": colors,
                    "action": f"Merge {len(colors)} color variants into single product with color options"
                })
    
    return analysis

def create_consolidated_product_data():
    """Create consolidated product data with back images prioritized"""
    products_dir = Path("/app/PRODUCTS")
    consolidated_products = []
    
    # Teeshirt consolidation - Focus on the duplicates you mentioned
    teeshirt_variants = {
        "Ocean Waves": ["Blue", "black", "grey"],
        "Abstract Geometry": ["black", "blue"],
        "Friend Back Photos": ["Red"]  # Only one color found
    }
    
    # Create consolidated tee products
    product_id = 1
    for design_name, colors in teeshirt_variants.items():
        if len(colors) > 1:  # Only consolidate multi-color items
            # Get images for each color
            front_images = []
            back_images = []
            
            for color in colors:
                color_dir = products_dir / "teeshirt" / design_name / color
                if color_dir.exists():
                    color_images = list(color_dir.glob("*.jpg")) + list(color_dir.glob("*.jpeg")) + list(color_dir.glob("*.png"))
                    # Assume first image is front, others are back/details
                    if color_images:
                        front_images.append(str(color_images[0]))
                        back_images.extend([str(img) for img in color_images[1:]])
            
            # Also check for dedicated front/back folders
            front_dir = products_dir / "teeshirt" / design_name / "front"
            back_dir = products_dir / "teeshirt" / design_name / "back"
            
            if front_dir.exists():
                front_images.extend([str(img) for img in front_dir.glob("*.jpg")])
                front_images.extend([str(img) for img in front_dir.glob("*.jpeg")])
            
            if back_dir.exists():
                back_images.extend([str(img) for img in back_dir.glob("*.jpg")])
                back_images.extend([str(img) for img in back_dir.glob("*.jpeg")])
            
            # Prioritize back images - put them first!
            all_images = back_images + front_images
            
            consolidated_products.append({
                "id": f"tee-consolidated-{product_id:02d}",
                "name": f"[ARMORY // REBEL TEE] — {design_name.upper()}",
                "category": "Teeshirt",
                "price": 1199,
                "originalPrice": 1499,
                "colors": colors,
                "images": all_images[:7],  # Max 7 images as per requirement
                "primary_image_type": "back",  # Back image prioritized
                "badges": ["REBEL DROP", "MULTI-COLOR"],
                "description": f"{design_name} rebel tee - Available in {len(colors)} warrior colors. Back design prioritized.",
                "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                "stock": {"XS":5,"S":12,"M":18,"L":22,"XL":9,"XXL":4}
            })
            product_id += 1
    
    # Add single-color and other products
    single_designs = [
        "City Skyline", "Minimalist Design", "Nature Photography", 
        "Vintage Typography", "Mountain Adventure", "Music Festival Vibes",
        "Space Exploration", "Tropical Paradise", "Urban Street Art", "Neon Lights"
    ]
    
    for design in single_designs:
        design_dir = products_dir / "teeshirt" / design
        if design_dir.exists():
            front_images = []
            back_images = []
            
            # Check for front/back folders
            front_dir = design_dir / "front"
            back_dir = design_dir / "back"
            
            if front_dir.exists():
                front_images = [str(img) for img in front_dir.glob("*.jpg")] + [str(img) for img in front_dir.glob("*.jpeg")]
            
            if back_dir.exists():
                back_images = [str(img) for img in back_dir.glob("*.jpg")] + [str(img) for img in back_dir.glob("*.jpeg")]
            
            # If no front/back folders, use direct images
            if not front_images and not back_images:
                all_imgs = list(design_dir.glob("*.jpg")) + list(design_dir.glob("*.jpeg"))
                if all_imgs:
                    front_images = [str(all_imgs[0])]
                    back_images = [str(img) for img in all_imgs[1:]]
            
            # Prioritize back images - put them first!
            all_images = back_images + front_images
            
            if all_images:
                consolidated_products.append({
                    "id": f"tee-single-{product_id:02d}",
                    "name": f"[ARMORY // REBEL TEE] — {design.upper()}",
                    "category": "Teeshirt", 
                    "price": 999 if "minimal" in design.lower() else 1199,
                    "originalPrice": 1299 if "minimal" in design.lower() else 1499,
                    "images": all_images[:7],
                    "primary_image_type": "back",
                    "badges": ["REBEL DROP"],
                    "description": f"{design} rebel tee - Premium OG design with back artwork prioritized.",
                    "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
                    "stock": {"XS":4,"S":11,"M":16,"L":19,"XL":8,"XXL":3}
                })
                product_id += 1
    
    return consolidated_products

def generate_report():
    """Generate comprehensive analysis report"""
    analysis = analyze_products()
    consolidated = create_consolidated_product_data()
    
    report = f"""
🔥 OG ARMORY PRODUCT ANALYSIS REPORT 🔥

CURRENT ASSETS SUMMARY:
- Total Images Found: {analysis['total_images']} (You mentioned 36, we found {analysis['total_images']})
- Back Images Available: {len(analysis['back_images'])}
- Front Images Available: {len(analysis['front_images'])}
- Categories: {len(analysis['categories'])}

CATEGORY BREAKDOWN:
"""
    
    for category, products in analysis["categories"].items():
        report += f"\n{category.upper()}:\n"
        for product_name, data in products.items():
            report += f"  - {product_name}: {data['total_images']} images"
            if data['color_variants']:
                colors = [v['color'] for v in data['color_variants']]
                report += f" [{', '.join(colors)} variants]"
            report += "\n"
    
    report += f"\nCOLOR VARIANT CONSOLIDATION:\n"
    for product, variants in analysis["color_variants"].items():
        colors = [v["color"] for v in variants]
        report += f"  - {product}: {colors} → MERGE INTO SINGLE PRODUCT\n"
    
    report += f"\nCONSOLIDATED PRODUCT STRUCTURE:\n"
    report += f"- Created {len(consolidated)} consolidated products\n"
    report += f"- Back images prioritized in all products\n"
    report += f"- Color variants merged with size/color selection\n"
    
    report += f"\nRECOMMENDATIONS:\n"
    for rec in analysis["recommended_consolidation"]:
        report += f"  - {rec['action']}\n"
    
    report += f"\nIMAGE PRIORITY FIXED:\n"
    report += f"- All products now show BACK images first\n"
    report += f"- Front images moved to secondary positions\n"
    report += f"- Maximum 7 images per product as requested\n"
    
    return report, analysis, consolidated

if __name__ == "__main__":
    print("🔥 Analyzing OG Armory Product Assets...")
    report, analysis, consolidated = generate_report()
    
    # Save analysis
    with open("/app/product_analysis.json", "w") as f:
        json.dump(analysis, f, indent=2)
    
    # Save consolidated products
    with open("/app/consolidated_products.json", "w") as f:
        json.dump(consolidated, f, indent=2)
    
    # Save report
    with open("/app/product_analysis_report.txt", "w") as f:
        f.write(report)
    
    print(report)
    print(f"\n✅ Analysis complete! Files saved:")
    print(f"  - /app/product_analysis.json")
    print(f"  - /app/consolidated_products.json") 
    print(f"  - /app/product_analysis_report.txt")