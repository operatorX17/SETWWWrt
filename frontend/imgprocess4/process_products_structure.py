# process_products_structure.py
import os, io, json, glob, time, shutil
from pathlib import Path
from tenacity import retry, stop_after_attempt, wait_exponential
from PIL import Image
import google.generativeai as genai
from datetime import datetime

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
API_KEY = os.getenv("GOOGLE_API_KEY")
PRODUCTS_DIR = "./PRODUCTS"  # new organized input
OUT_DIR = "./out"     # organized outputs
OUT_NDJSON = f"{OUT_DIR}/ai_products.ndjson"
OUT_FRONT = f"{OUT_DIR}/front_selection.json"
OUT_ADMIN = f"{OUT_DIR}/ai_products_for_admin.json"

assert API_KEY, "Set GOOGLE_API_KEY"
genai.configure(api_key=API_KEY)

# Configure safety settings to be more permissive
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    }
]

model = genai.GenerativeModel(MODEL, safety_settings=safety_settings)

# ---- Master Prompt (adapted for organized structure) ----
MASTER_PROMPT = f"""
SYSTEM:
You are a merch vision analyst for an OG-themed (Pawan Kalyan) fan store.
All items are same base garment style per category; only colors/prints differ.
Return a STRICT JSON object per image with EXACT keys below.
No markdown, no extra text. If unknown, use null. Keep it cinematic, short, and fan-first.

PRICING CONTEXT:
- T-shirts: Range ₹199-₹975 (Basic: ₹699, Exclusive: ₹899-₹975)
- Hoodies: Range ₹1119-₹2000 (Affordable: ₹1119-₹1299)
- Caps/Headbands: Lower cost items to reach broader audience
- GSM: 240-260 for most items
- Oversized basic t-shirts can cost up to ₹455 production, so ₹699 minimum for decent margin
- Showcase premium quality items that look great, avoid random/repeated designs

THEME GUARDRAILS:
- Limit palette to OG Cinematic Brutality: Jet Black (#0B0B0D), Blood Red (#C1121F), Brass Gold (#C99700), Ash White (#EAEAEA).
- Titles: "OG // <Category> — <Concept Name>" (max 6 words concept, no scene tags).
- Description: 1–2 lines, hype but not cringe; allow Telugu sprinkles in Latin script (e.g., "raktham", "veta").
- Categories allowed: Hoodie, Tee, Cap, Slide (only).
- Badges priority: "Vault Exclusive" > "Rebel Drop" > "Under ₹999" (choose max 1; if premium-looking art, prefer Vault Exclusive; if entry price-looking art, Under ₹999; else Rebel Drop).
- Price band: BUDGET (₹199-₹699), CORE (₹700-₹1299), PREMIUM (₹1300-₹2000).
  Base pricing on visual quality and design complexity you observe in the image.
- Tags must be flat, machine-friendly: CAT_<CATEGORY>, plus from: CUE_BLOOD_RED, CUE_BRASS, CUE_SMOKE, CUE_RAIN as visually relevant.

OUTPUT JSON KEYS (exact):
{{
  "image_id": "<filename>",
  "category": "Hoodie|Tee|Cap|Slide",
  "concept_name": "<short cinematic>",
  "title": "OG // <Category> — <Concept Name>",
  "handle": "og-<category>-<kebab-concept>",
  "palette": [{{"name":"Jet Black","hex":"#0B0B0D"}}, ... limited to the four OG colors actually visible],
  "description": "<1-2 lines, EN with a bit TE vibe>",
  "badge": "Vault Exclusive|Rebel Drop|Under ₹999|",
  "price_band": "BUDGET|CORE|PREMIUM",
  "tags": ["CAT_<CATEGORY>", "CUE_*", "TE", "EN"],
  "visual_coolness_score": 0.0,    # 0..1 subjective aesthetic heat for fans
  "hero_card_ready": true|false,     # true if this would look killer in homepage hero/rails
  "view": "front|back|detail"        # infer from folder structure or image content
}}

RUBRICS:
- category: infer from silhouette/print scale (Tee most likely unless hat brim/slide strap).
- concept_name: 1–3 words, e.g., "Hungry Cheetah", "Blood Oath", "Katana Rain".
- description: line 1 = vibe; line 2 = CTA vibe (e.g., "Ready to hunt. Arm up.").
- tags: always include "TE" and "EN". Add CUE_* if applicable from the art.
- visual_coolness_score: rate purely on fan hype effect of the print (not price).
- hero_card_ready: true if bold contrast, iconic motif, clean read at small sizes.
- view: determine from folder name or image analysis

Remember: DO NOT invent fabric/material; these are AI mockups printed on demand.
""".strip()

OG_COLORS = {
  "#0B0B0D": {"name":"Jet Black","hex":"#0B0B0D"},
  "#C1121F": {"name":"Blood Red","hex":"#C1121F"},
  "#C99700": {"name":"Brass Gold","hex":"#C99700"},
  "#EAEAEA": {"name":"Ash White","hex":"#EAEAEA"}
}

# Category mapping for folder names
CATEGORY_MAPPING = {
    "hoodies": "Hoodie",
    "teeshirt": "Tee",
    "full shirts": "Tee",
    "sweatshirts": "Hoodie",
    "hats": "Cap",
    "headband": "Cap",
    "slippers": "Slide",
    "posters": "Tee",  # treating posters as tee designs
    "wallet": "Tee"    # treating wallet designs as tee designs
}

def pil_to_bytes(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

@retry(reraise=True, stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=1, max=20))
def analyze_image(path, category_hint=None, view_hint=None, product_hint=None):
    img = Image.open(path).convert("RGB")
    
    # Enhanced prompt with context from folder structure
    context_prompt = MASTER_PROMPT
    if category_hint:
        context_prompt += f"\n\nCONTEXT: This image is from the {category_hint} category folder."
    if view_hint:
        context_prompt += f" The view is likely: {view_hint}."
    if product_hint:
        context_prompt += f" Product identifier: {product_hint}."
    
    parts = [
        {"text": context_prompt},
        {"inline_data": {"mime_type": "image/png", "data": pil_to_bytes(img)}}
    ]
    resp = model.generate_content(parts)
    
    # Check if response has valid content
    if not resp.candidates or not resp.candidates[0].content.parts:
        raise ValueError(f"No valid response from API. Finish reason: {resp.candidates[0].finish_reason if resp.candidates else 'Unknown'}")
    
    txt = resp.text.strip()
    if not txt:
        raise ValueError("Empty response from API")
        
    if txt.startswith("```"):
        txt = txt.strip("`")
        lines = [l for l in txt.splitlines() if not l.lower().startswith("json")]
        txt = "\n".join(lines).strip()
    
    if not txt:
        raise ValueError("No valid JSON content after processing")
        
    try:
        obj = json.loads(txt)
    except json.JSONDecodeError as e:
        raise json.JSONDecodeError(f"Failed to parse JSON: {txt[:100]}...", e.doc, e.pos)

    # normalize required fields
    fname = os.path.basename(path)
    obj["image_id"] = fname
    
    # Use category hint if provided
    if category_hint and category_hint in CATEGORY_MAPPING:
        obj["category"] = CATEGORY_MAPPING[category_hint]
    elif obj.get("category") not in ["Hoodie","Tee","Cap","Slide"]:
        obj["category"] = "Tee"
    
    # Use view hint if provided
    if view_hint:
        obj["view"] = view_hint
    elif obj.get("view") not in ["front","back","detail"]:
        obj["view"] = "front"
    
    # enforce colors to OG set only
    pal = obj.get("palette") or []
    filtered = []
    for c in pal:
        hx = (c.get("hex") or "").upper()
        if hx in OG_COLORS:
            filtered.append(OG_COLORS[hx])
    obj["palette"] = filtered or [OG_COLORS["#0B0B0D"]]

    # enforce handle/title
    def kebab(s):
        import re
        return re.sub(r"[^a-z0-9]+","-", (s or "unnamed").lower()).strip("-")
    
    concept = obj.get("concept_name") or product_hint or "Unnamed"
    obj["concept_name"] = concept
    if not obj.get("title"):
        obj["title"] = f"OG // {obj['category']} — {concept}"
    obj["handle_fragment"] = obj.get("handle_fragment") or kebab(concept)

    # tags
    tags = set(obj.get("tags") or [])
    tags.add(f"CAT_{obj['category'].upper()}")
    tags.update(["TE","EN"])
    obj["tags"] = sorted(tags)

    # price and badge sanity
    badge = obj.get("badge") or ""
    price = float(obj.get("price_inr") or 0.0)
    
    # enforce .11 endings
    def to_11(x): 
        base = round(float(x))
        return float(f"{base}.11")
    
    if price <= 0:
        defaults = {"Tee": 899.11, "Hoodie": 1299.11, "Cap": 399.11, "Slide": 899.11}
        price = defaults.get(obj["category"], 899.11)
    
    # respect badge constraints
    if badge == "Under ₹999" and price > 999.11:
        price = 999.11
    if badge == "Vault Exclusive":
        if obj["category"] == "Hoodie" and price < 1299.11:
            price = 1299.11
        if obj["category"] == "Tee" and price < 975.11:
            price = 975.11
    
    # normalize to .11
    if abs(price - round(price)) < 0.6:
        price = to_11(price)
    else:
        price = float(f"{int(price)}.11")
    obj["price_inr"] = price

    # price_band from price
    if price <= 699.11:
        obj["price_band"] = "BUDGET"
    elif price <= 1299.11:
        obj["price_band"] = "CORE"
    else:
        obj["price_band"] = "PREMIUM"

    # coolness fallback
    vc = obj.get("visual_coolness_score")
    if not isinstance(vc,(int,float)):
        obj["visual_coolness_score"] = 0.6
    if "hero_card_ready" not in obj:
        obj["hero_card_ready"] = bool(obj["visual_coolness_score"] >= 0.7)

    return obj

def ensure_dirs():
    Path(OUT_DIR).mkdir(parents=True, exist_ok=True)
    for sub in ["front_view_designs","back_view_designs","detail_view_designs"]:
        Path(f"{OUT_DIR}/{sub}").mkdir(parents=True, exist_ok=True)

def organize_file(src_path, view, handle_fragment):
    # copies image into out/front_view_designs|back_view_designs|detail_view_designs/<handle_fragment>/
    dest_root = f"{OUT_DIR}/{view}_view_designs/{handle_fragment}"
    Path(dest_root).mkdir(parents=True, exist_ok=True)
    shutil.copy2(src_path, f"{dest_root}/{os.path.basename(src_path)}")

def scan_products_structure():
    """Scan the PRODUCTS folder and return list of (image_path, category, view, product_id)"""
    results = []
    
    for category_folder in os.listdir(PRODUCTS_DIR):
        category_path = os.path.join(PRODUCTS_DIR, category_folder)
        if not os.path.isdir(category_path):
            continue
            
        category_name = category_folder.lower()
        
        # Handle different folder structures
        for item in os.listdir(category_path):
            item_path = os.path.join(category_path, item)
            
            if os.path.isfile(item_path) and item.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                # Direct image in category folder (like HeadBand, posters, wallet)
                results.append((item_path, category_name, "front", item))
            
            elif os.path.isdir(item_path):
                # Product folder structure
                product_id = item
                
                # Check if it has view subfolders (front/back/detail)
                view_folders = []
                direct_images = []
                
                for sub_item in os.listdir(item_path):
                    sub_path = os.path.join(item_path, sub_item)
                    if os.path.isdir(sub_path) and sub_item.lower() in ['front', 'back', 'detail']:
                        view_folders.append((sub_path, sub_item.lower()))
                    elif os.path.isfile(sub_path) and sub_item.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                        direct_images.append(sub_path)
                
                # Process view folders
                for view_path, view_name in view_folders:
                    for img_file in os.listdir(view_path):
                        if img_file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                            img_path = os.path.join(view_path, img_file)
                            results.append((img_path, category_name, view_name, product_id))
                
                # Process direct images (assume front view)
                for img_path in direct_images:
                    results.append((img_path, category_name, "front", product_id))
    
    return results

def admin_shape_from_group(group):
    """Collapse multiple views into a single product payload for Admin API"""
    any_obj = group[0]
    product_type = any_obj["category"]
    concept = any_obj["concept_name"]
    handle_fragment = any_obj["handle_fragment"]
    title = f"OG // {product_type} — {concept}"

    # choose price as max across images
    price = max([float(o["price_inr"]) for o in group])
    # merge tags
    tags = sorted(list(set(sum([o["tags"] for o in group], []))))
    # pick best description
    best = max(group, key=lambda o: float(o.get("visual_coolness_score",0)))
    desc_html = f"<p>{best.get('description','')}</p>"
    
    # collect image paths
    imgs = []
    for o in group:
        view = o["view"]
        handle = o["handle_fragment"]
        imgs.append(f"./out/{view}_view_designs/{handle}/{o['image_id']}")

    payload = {
      "title": title,
      "handle": f"og-{product_type.lower()}-{handle_fragment}",
      "productType": product_type,
      "vendor": "DVV Entertainment",
      "descriptionHtml": desc_html,
      "tags": tags,
      "price": price,
      "imageSrcs": imgs,
      "metafields": {
        "og.rank":"COMMON",
        "og.is_limited": "true" if any_obj.get("badge")=="Vault Exclusive" else "false",
        "og.badges": json.dumps([any_obj.get("badge")]) if any_obj.get("badge") else "[]",
        "og.colorway": " / ".join([c["name"] for c in (any_obj.get("palette") or [])]),
        "og.locale_tags": json.dumps(["TE","EN"])
      }
    }
    return payload

def main():
    ensure_dirs()
    
    # Scan the PRODUCTS structure
    image_data = scan_products_structure()
    if not image_data:
        print("No images found in PRODUCTS folder")
        return

    print(f"Found {len(image_data)} images to process")
    
    nd = open(OUT_NDJSON,"w",encoding="utf-8")
    rows = []
    groups = {}  # key: (category, handle_fragment)

    for img_path, category, view, product_id in image_data:
        try:
            obj = analyze_image(img_path, category_hint=category, view_hint=view, product_hint=product_id)
            obj["analyzed_at"] = datetime.now().isoformat()
            nd.write(json.dumps(obj, ensure_ascii=False) + "\n")
            rows.append(obj)
            
            # organize into folders
            organize_file(img_path, obj["view"], obj["handle_fragment"])
            
            # group for admin shape
            key = (obj["category"], obj["handle_fragment"])
            groups.setdefault(key, []).append(obj)
            
            print("✓", os.path.basename(img_path), "→", obj["category"], obj["view"], obj["price_inr"])
            time.sleep(0.2)
        except Exception as e:
            print("✗", os.path.basename(img_path), "->", repr(e))
    
    nd.close()

    # Top tees selection for homepage
    tees = [o for o in rows if o.get("category")=="Tee"]
    tees.sort(key=lambda x: (float(x.get("visual_coolness_score",0)), x.get("badge")=="Rebel Drop"), reverse=True)
    front = {
      "generated_at": datetime.now().isoformat(),
      "top_tees": [
        {
          "image_id": t["image_id"],
          "handle_fragment": t["handle_fragment"],
          "title": t["title"],
          "badge": t.get("badge",""),
          "price_inr": t.get("price_inr",0.0),
          "price_band": t.get("price_band","CORE"),
          "palette": t.get("palette",[]),
          "visual_coolness_score": t.get("visual_coolness_score",0),
          "hero_card_ready": t.get("hero_card_ready", False)
        } for t in tees[:8]
      ]
    }
    with open(OUT_FRONT,"w",encoding="utf-8") as fh:
        json.dump(front, fh, ensure_ascii=False, indent=2)

    # Build admin payloads
    admin_list = []
    for key, group in groups.items():
        admin_list.append(admin_shape_from_group(group))
    with open(OUT_ADMIN,"w",encoding="utf-8") as fh:
        json.dump(admin_list, fh, ensure_ascii=False, indent=2)

    print("\nProcessing complete!")
    print("Wrote:", OUT_NDJSON, OUT_FRONT, OUT_ADMIN)
    print("Organized images under:", OUT_DIR, "/{front,back,detail}_view_designs/<handle_fragment>/")
    print(f"Processed {len(rows)} images into {len(groups)} product groups")

if __name__ == "__main__":
    main()