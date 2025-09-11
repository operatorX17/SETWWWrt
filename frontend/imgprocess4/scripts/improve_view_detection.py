#!/usr/bin/env python3
"""
Improved View Detection Script
Analyzes images to better detect front/back views and provides manual correction tools.
"""

import json
import os
from PIL import Image
import cv2
import numpy as np
from collections import defaultdict

def analyze_image_for_view_detection(image_path):
    """Analyze image to detect if it's likely front or back view"""
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            return {'confidence': 0, 'detected_view': 'unknown', 'reason': 'Could not load image'}
        
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        height, width = gray.shape
        
        # Analysis factors
        analysis = {
            'confidence': 0,
            'detected_view': 'front',  # default
            'factors': [],
            'reason': ''
        }
        
        # Factor 1: Text detection (more text usually means front)
        # Simple edge detection to find text-like regions
        edges = cv2.Canny(gray, 50, 150)
        text_density = np.sum(edges) / (width * height)
        
        if text_density > 0.1:  # High edge density suggests text/graphics
            analysis['factors'].append('high_text_density')
            analysis['confidence'] += 0.3
        
        # Factor 2: Center region analysis
        # Front views often have central design elements
        center_y, center_x = height // 2, width // 2
        center_region = gray[center_y-50:center_y+50, center_x-50:center_x+50]
        if center_region.size > 0:
            center_variance = np.var(center_region)
            if center_variance > 1000:  # High variance suggests design elements
                analysis['factors'].append('central_design')
                analysis['confidence'] += 0.2
        
        # Factor 3: Symmetry analysis
        # Back views are often more symmetrical
        left_half = gray[:, :width//2]
        right_half = cv2.flip(gray[:, width//2:], 1)
        
        if left_half.shape == right_half.shape:
            symmetry_score = cv2.matchTemplate(left_half, right_half, cv2.TM_CCOEFF_NORMED)[0][0]
            if symmetry_score > 0.7:  # High symmetry
                analysis['factors'].append('high_symmetry')
                analysis['detected_view'] = 'back'
                analysis['confidence'] += 0.4
        
        # Factor 4: Bottom region analysis
        # Back views often have tags/labels at bottom
        bottom_region = gray[int(height*0.8):, :]
        if bottom_region.size > 0:
            bottom_edges = cv2.Canny(bottom_region, 50, 150)
            bottom_density = np.sum(bottom_edges) / bottom_region.size
            if bottom_density > 0.05:
                analysis['factors'].append('bottom_elements')
                if 'high_symmetry' in analysis['factors']:
                    analysis['detected_view'] = 'back'
                    analysis['confidence'] += 0.2
        
        # Compile reason
        analysis['reason'] = f"Detected as {analysis['detected_view']} based on: {', '.join(analysis['factors'])}"
        
        return analysis
        
    except Exception as e:
        return {'confidence': 0, 'detected_view': 'unknown', 'reason': f'Error: {str(e)}'}

def load_grouped_products(file_path):
    """Load grouped products from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def improve_view_detection(grouped_data, images_dir):
    """Improve view detection for all products"""
    improved_products = []
    analysis_results = []
    
    for product in grouped_data['products']:
        improved_product = product.copy()
        product_analysis = {
            'product_id': product['product_id'],
            'concept_name': product['concept_name'],
            'original_views': len(product.get('images', [product])),
            'image_analyses': []
        }
        
        # Analyze each image
        images = product.get('images', [{'image_id': product['image_id'], 'view': product.get('view', 'front')}])
        improved_images = []
        
        for img_info in images:
            image_path = os.path.join(images_dir, img_info['image_id'])
            
            if os.path.exists(image_path):
                analysis = analyze_image_for_view_detection(image_path)
                
                # Update view based on analysis
                improved_img = img_info.copy()
                if analysis['confidence'] > 0.5:
                    improved_img['view'] = analysis['detected_view']
                    improved_img['view_confidence'] = analysis['confidence']
                    improved_img['detection_reason'] = analysis['reason']
                
                improved_images.append(improved_img)
                
                product_analysis['image_analyses'].append({
                    'image_id': img_info['image_id'],
                    'original_view': img_info['view'],
                    'detected_view': analysis['detected_view'],
                    'confidence': analysis['confidence'],
                    'reason': analysis['reason']
                })
            else:
                improved_images.append(img_info)
                product_analysis['image_analyses'].append({
                    'image_id': img_info['image_id'],
                    'original_view': img_info['view'],
                    'detected_view': 'unknown',
                    'confidence': 0,
                    'reason': 'Image file not found'
                })
        
        # Update product with improved images
        if 'images' in improved_product:
            improved_product['images'] = improved_images
        else:
            # Single image product
            if improved_images:
                img = improved_images[0]
                improved_product['view'] = img['view']
                if 'view_confidence' in img:
                    improved_product['view_confidence'] = img['view_confidence']
                    improved_product['detection_reason'] = img['detection_reason']
        
        # Recalculate view flags
        front_views = [img for img in improved_images if img['view'] == 'front']
        back_views = [img for img in improved_images if img['view'] == 'back']
        
        improved_product['has_front_view'] = len(front_views) > 0
        improved_product['has_back_view'] = len(back_views) > 0
        improved_product['total_views'] = len(improved_images)
        
        # Update analysis summary
        product_analysis['improved_front_views'] = len(front_views)
        product_analysis['improved_back_views'] = len(back_views)
        product_analysis['has_both_views'] = len(front_views) > 0 and len(back_views) > 0
        
        improved_products.append(improved_product)
        analysis_results.append(product_analysis)
    
    return improved_products, analysis_results

def generate_manual_review_file(analysis_results, output_file):
    """Generate a file for manual review and correction"""
    review_data = {
        'instructions': {
            'purpose': 'Manual review and correction of view detection',
            'how_to_use': [
                '1. Review each product with multiple views',
                '2. Check if view detection is correct',
                '3. Manually correct view field if needed',
                '4. Save and run apply_manual_corrections.py'
            ],
            'view_options': ['front', 'back', 'side', 'detail']
        },
        'products_needing_review': []
    }
    
    for analysis in analysis_results:
        if analysis['original_views'] > 1 or any(img['confidence'] < 0.7 for img in analysis['image_analyses']):
            review_item = {
                'product_id': analysis['product_id'],
                'concept_name': analysis['concept_name'],
                'needs_review_reason': [],
                'images': []
            }
            
            if analysis['original_views'] > 1:
                review_item['needs_review_reason'].append('multiple_views')
            
            for img_analysis in analysis['image_analyses']:
                if img_analysis['confidence'] < 0.7:
                    review_item['needs_review_reason'].append('low_confidence_detection')
                
                review_item['images'].append({
                    'image_id': img_analysis['image_id'],
                    'detected_view': img_analysis['detected_view'],
                    'confidence': img_analysis['confidence'],
                    'manual_view': img_analysis['detected_view'],  # User can edit this
                    'notes': ''  # User can add notes
                })
            
            review_data['products_needing_review'].append(review_item)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(review_data, f, indent=2, ensure_ascii=False)
    
    return len(review_data['products_needing_review'])

def main():
    # File paths
    grouped_file = 'out/grouped_products.json'
    images_dir = 'organized_designs'  # Adjust if different
    output_file = 'out/improved_products.json'
    analysis_file = 'out/view_detection_analysis.json'
    review_file = 'out/manual_review.json'
    
    print("🔄 Loading grouped products...")
    grouped_data = load_grouped_products(grouped_file)
    print(f"📊 Loaded {len(grouped_data['products'])} products")
    
    print("🔍 Analyzing images for better view detection...")
    improved_products, analysis_results = improve_view_detection(grouped_data, images_dir)
    
    # Update the data structure
    improved_data = grouped_data.copy()
    improved_data['products'] = improved_products
    improved_data['metadata']['view_detection_improved'] = True
    
    # Recalculate statistics
    stats = improved_data['statistics']
    products_with_both = sum(1 for p in improved_products if p.get('has_front_view') and p.get('has_back_view'))
    products_with_front_only = sum(1 for p in improved_products if p.get('has_front_view') and not p.get('has_back_view'))
    products_with_back_only = sum(1 for p in improved_products if p.get('has_back_view') and not p.get('has_front_view'))
    
    stats['products_with_front_and_back'] = products_with_both
    stats['products_with_front_only'] = products_with_front_only
    stats['products_with_back_only'] = products_with_back_only
    
    print(f"💾 Saving improved products to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(improved_data, f, indent=2, ensure_ascii=False)
    
    print(f"📊 Saving analysis results to {analysis_file}...")
    with open(analysis_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, indent=2, ensure_ascii=False)
    
    print(f"📝 Generating manual review file...")
    review_count = generate_manual_review_file(analysis_results, review_file)
    
    # Print summary
    print("\n" + "="*50)
    print("🔍 VIEW DETECTION IMPROVEMENT SUMMARY")
    print("="*50)
    print(f"Products analyzed: {len(improved_products)}")
    print(f"Products with front & back: {products_with_both}")
    print(f"Products with front only: {products_with_front_only}")
    print(f"Products with back only: {products_with_back_only}")
    print(f"Products needing manual review: {review_count}")
    print(f"\n📝 Manual review file created: {review_file}")
    print("   Edit this file to correct any view detection errors")
    print("\n✅ View detection improvement completed!")

if __name__ == '__main__':
    main()