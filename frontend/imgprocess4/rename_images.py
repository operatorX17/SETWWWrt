import json
import os
import shutil
from pathlib import Path

def clean_filename(name):
    """Convert concept name to a clean filename"""
    # Remove special characters and replace spaces with hyphens
    clean = name.replace(" ", "-").replace("'", "").replace('"', "")
    # Remove other problematic characters
    clean = ''.join(c for c in clean if c.isalnum() or c in '-_')
    return clean.lower()

def load_product_mappings(ndjson_path):
    """Load image_id to concept_name mappings from NDJSON file"""
    mappings = {}
    
    with open(ndjson_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip():
                product = json.loads(line)
                image_id = product.get('image_id')
                concept_name = product.get('concept_name')
                category = product.get('category', '').lower()
                
                if image_id and concept_name:
                    clean_name = clean_filename(concept_name)
                    # Add category prefix for uniqueness
                    new_name = f"{category}-{clean_name}"
                    mappings[image_id] = new_name
    
    return mappings

def rename_images_in_folder(folder_path, mappings, dry_run=True):
    """Rename images in the specified folder"""
    folder = Path(folder_path)
    renamed_count = 0
    
    print(f"\n{'DRY RUN: ' if dry_run else ''}Processing folder: {folder}")
    print("-" * 50)
    
    for image_file in folder.glob("*.jpeg"):
        original_name = image_file.name
        
        if original_name in mappings:
            new_name = mappings[original_name] + ".jpeg"
            new_path = folder / new_name
            
            print(f"{'[DRY RUN] ' if dry_run else ''}Renaming:")
            print(f"  From: {original_name}")
            print(f"  To:   {new_name}")
            
            if not dry_run:
                try:
                    image_file.rename(new_path)
                    renamed_count += 1
                    print(f"  ✓ Success")
                except Exception as e:
                    print(f"  ✗ Error: {e}")
            else:
                renamed_count += 1
            print()
        else:
            print(f"No mapping found for: {original_name}")
    
    return renamed_count

def update_organized_folders(base_path, mappings, dry_run=True):
    """Update image references in organized folders"""
    front_folder = Path(base_path) / "out" / "front_view_designs"
    updated_count = 0
    
    print(f"\n{'DRY RUN: ' if dry_run else ''}Updating organized folders...")
    print("-" * 50)
    
    for product_folder in front_folder.iterdir():
        if product_folder.is_dir():
            for image_file in product_folder.glob("*.jpeg"):
                original_name = image_file.name
                
                if original_name in mappings:
                    new_name = mappings[original_name] + ".jpeg"
                    new_path = product_folder / new_name
                    
                    print(f"{'[DRY RUN] ' if dry_run else ''}Updating in {product_folder.name}:")
                    print(f"  From: {original_name}")
                    print(f"  To:   {new_name}")
                    
                    if not dry_run:
                        try:
                            image_file.rename(new_path)
                            updated_count += 1
                            print(f"  ✓ Success")
                        except Exception as e:
                            print(f"  ✗ Error: {e}")
                    else:
                        updated_count += 1
                    print()
    
    return updated_count

def main():
    base_path = Path(__file__).parent
    ndjson_path = base_path / "out" / "ai_products.ndjson"
    images_folder = base_path / "images"
    
    print("=" * 60)
    print("IMAGE RENAMING SCRIPT")
    print("=" * 60)
    
    # Load mappings
    print("Loading product mappings...")
    mappings = load_product_mappings(ndjson_path)
    print(f"Found {len(mappings)} image mappings")
    
    # Show some examples
    print("\nExample mappings:")
    for i, (old, new) in enumerate(list(mappings.items())[:5]):
        print(f"  {old} → {new}.jpeg")
    if len(mappings) > 5:
        print(f"  ... and {len(mappings) - 5} more")
    
    # First run as dry run
    print("\n" + "="*60)
    print("DRY RUN - No files will be changed")
    print("="*60)
    
    renamed_in_images = rename_images_in_folder(images_folder, mappings, dry_run=True)
    updated_in_organized = update_organized_folders(base_path, mappings, dry_run=True)
    
    print(f"\nDRY RUN SUMMARY:")
    print(f"  Images to rename in /images/: {renamed_in_images}")
    print(f"  Images to update in organized folders: {updated_in_organized}")
    
    # Ask for confirmation
    print("\n" + "="*60)
    response = input("Proceed with actual renaming? (y/N): ").strip().lower()
    
    if response == 'y':
        print("\nProceeding with actual renaming...")
        print("="*60)
        
        renamed_in_images = rename_images_in_folder(images_folder, mappings, dry_run=False)
        updated_in_organized = update_organized_folders(base_path, mappings, dry_run=False)
        
        print(f"\nFINAL SUMMARY:")
        print(f"  Images renamed in /images/: {renamed_in_images}")
        print(f"  Images updated in organized folders: {updated_in_organized}")
        print("\n✓ Renaming complete!")
    else:
        print("\nRenaming cancelled.")

if __name__ == "__main__":
    main()