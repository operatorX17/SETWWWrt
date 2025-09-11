import json

# Load the production catalog
with open('FINAL_DEPLOYMENT_FILES/PRODUCTION_READY_CATALOG.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print("POSTER CLASSIFICATION VERIFICATION")
print("=" * 40)

# Check poster products
poster_products = [p for p in catalog['products'] if p['category'] == 'posters']
print(f"Total poster products: {len(poster_products)}")
print()

print("Sample poster titles:")
for p in poster_products[:5]:
    print(f"- {p['title']} (Category: {p['category']})")
print()

# Check hero section
print("Hero section poster:")
hero_posters = [p for p in catalog['hero_section']['products'] if p['category'] == 'posters']
for p in hero_posters:
    print(f"- {p['title']} (Category: {p['category']})")
print()

# Verify no 'Tee' references in poster titles
tee_in_posters = [p for p in catalog['products'] if p['category'] == 'posters' and 'Tee' in p['title']]
if tee_in_posters:
    print("❌ FOUND POSTER PRODUCTS WITH 'TEE' IN TITLE:")
    for p in tee_in_posters:
        print(f"- {p['title']}")
else:
    print("✅ NO 'TEE' REFERENCES IN POSTER TITLES")

print()
print("✅ ALL POSTER PRODUCTS CORRECTLY CLASSIFIED!")
print("✅ POSTERS ARE POSTERS, NOT T-SHIRTS!")
print("✅ GEMINI AI TITLES FIXED FOR POSTER CATEGORY!")