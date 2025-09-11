import json
import os

def get_correct_product_info(product_name, products_dir):
    for category in os.listdir(products_dir):
        category_path = os.path.join(products_dir, category)
        if os.path.isdir(category_path):
            for product_folder in os.listdir(category_path):
                if product_folder.lower() in product_name.lower() or product_name.lower() in product_folder.lower():
                    product_path = os.path.join(category_path, product_folder)
                    front_image = None
                    back_image = None
                    for view in os.listdir(product_path):
                        view_path = os.path.join(product_path, view)
                        if "front" in view.lower() and os.path.isdir(view_path):
                            front_image = os.path.join(view_path, os.listdir(view_path)[0])
                        elif "back" in view.lower() and os.path.isdir(view_path):
                            back_image = os.path.join(view_path, os.listdir(view_path)[0])
                    return category, front_image, back_image
    return None, None, None

def fix_product_catalog(ai_products_file, products_dir, output_file):
    corrected_products = []
    with open(ai_products_file, 'r') as f:
        for line in f:
            product = json.loads(line)
            product_name = product.get("concept_name", "")
            category, front_image, back_image = get_correct_product_info(product_name, products_dir)

            if category:
                product["category"] = category
                # Update title and tags based on the correct category
                product["title"] = f"OG // {category.singularize().capitalize()} — {product_name}"
                product["handle"] = f"og-{category.singularize()}-{product_name.lower().replace(' ', '-')}"
                product["tags"] = [f"CAT_{category.upper()}", f"CAT_{category.capitalize()}", "EN", "TE"]


            if front_image:
                product["front_image_path"] = front_image
            if back_image:
                product["back_image_path"] = back_image
            
            corrected_products.append(product)

    with open(output_file, 'w') as f:
        json.dump(corrected_products, f, indent=4)

if __name__ == "__main__":
    ai_products_file = "c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\ai_products.ndjson"
    products_dir = "c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\PRODUCTS"
    output_file = "c:\\Users\\KARTHIK GOWDA M P\\Downloads\\imgprocess4\\out\\corrected_product_catalog.json"
    fix_product_catalog(ai_products_file, products_dir, output_file)
    print(f"Corrected product catalog saved to {output_file}")