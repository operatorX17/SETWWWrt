# og_gemini_batch.py
import os, io, json, glob, time
from tenacity import retry, stop_after_attempt, wait_exponential
from PIL import Image
import google.generativeai as genai

MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
API_KEY = os.getenv("GOOGLE_API_KEY")
IMG_DIR = "./images"
OUT_NDJSON = "ai_products.ndjson"
OUT_FRONT = "front_selection.json"

assert API_KEY, "Set GOOGLE_API_KEY"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel(MODEL)

OG_COLORS = [
  {"name":"Jet Black","hex":"#0B0B0D"},
  {"name":"Blood Red","hex":"#C1121F"},
  {"name":"Brass Gold","hex":"#C99700"},
  {"name":"Ash White","hex":"#EAEAEA"}
]

MASTER_PROMPT = f"""
SYSTEM:
You are a merch vision analyst for an OG-themed (Pawan Kalyan) fan store.
All items are same base garment style per category; only colors/prints differ.
Return a STRICT JSON object per image with EXACT keys below.
No markdown, no extra text. If unknown, use null. Keep it cinematic, short, and fan-first.

āāPRICING CONTEXT:
- T-shirts: Range ₹199-₹975 (āBasic: ₹699, Exclusive: ₹899-₹975)
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
  "hero_card_ready": true|false     # true if this would look killer in homepage hero/rails
}}

RUBRICS:
- category: infer from silhouette/print scale (Tee most likely unless hat brim/slide strap).
- concept_name: 1–3 words, e.g., "Hungry Cheetah", "Blood Oath", "Katana Rain".
- description: line 1 = vibe; line 2 = CTA vibe (e.g., "Ready to hunt. Arm up.").
- tags: always include "TE" and "EN". Add CUE_* if applicable from the art.
- visual_coolness_score: rate purely on fan hype effect of the print (not price).
- hero_card_ready: true if bold contrast, iconic motif, clean read at small sizes.

Remember: DO NOT invent fabric/material; these are AI mockups printed on demand.
"""

def pil_to_bytes(img):
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()

@retry(reraise=True, stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=1, max=20))
def analyze_image(path):
    img = Image.open(path).convert("RGB")
    parts = [
        {"text": MASTER_PROMPT},
        {"inline_data": {"mime_type": "image/png", "data": pil_to_bytes(img)}}
    ]
    resp = model.generate_content(parts)
    txt = resp.text.strip()
    # strip code fences if any
    if txt.startswith("```"):
        txt = txt.strip("`")
        lines = [l for l in txt.splitlines() if not l.lower().startswith("json")]
        txt = "\n".join(lines).strip()
    obj = json.loads(txt)
    # enforce filename
    obj["image_id"] = os.path.basename(path)
    # sanitize category
    if obj.get("category") not in ["Hoodie","Tee","Cap","Slide"]:
        obj["category"] = "Tee"
    # enforce handle kebab
    def kebab(s):
        import re
        return re.sub(r"[^a-z0-9]+","-", s.lower()).strip("-")
    if "title" not in obj or not obj["title"]:
        cn = obj.get("concept_name","Unnamed")
        obj["title"] = f"OG // {obj['category']} — {cn}"
    cn = obj.get("concept_name","Unnamed")
    obj["handle"] = f"og-{obj['category'].lower()}-{kebab(cn)}"
    # palette limit: only known OG colors
    allowed = {c["hex"].upper():c for c in OG_COLORS}
    pal = obj.get("palette") or []
    filtered = []
    for c in pal:
        hx = (c.get("hex") or "").upper()
        if hx in allowed:
            filtered.append(allowed[hx])
    if not filtered:
        # pick at least one based on image vibe guess (default Jet Black)
        filtered = [OG_COLORS[0]]
    obj["palette"] = filtered
    # normalize tags
    tags = set(obj.get("tags") or [])
    tags.add(f"CAT_{obj['category'].upper()}")
    tags.update(["TE","EN"])
    obj["tags"] = sorted(tags)
    # badge/price band coupling
    b = obj.get("badge","") or ""
    if b == "Vault Exclusive":
        obj["price_band"] = "PREMIUM"
    elif b == "Under ₹999":ā
        obj["price_band"] = "BUDGET"
    elif obj.get("price_band") not in ["BUDGET","CORE","PREMIUM"]:
        obj["price_band"] = "CORE"
    # default coolness
    vc = obj.get("visual_coolness_score")
    if not isinstance(vc,(int,float)):
        obj["visual_coolness_score"] = 0.6
    # hero flag
    if "hero_card_ready" not in obj:
        obj["hero_card_ready"] = bool(obj["visual_coolness_score"] >= 0.7)
    return obj

def main():
    files = sorted([p for p in glob.glob(os.path.join(IMG_DIR,"*")) if p.lower().endswith((".png",".jpg",".jpeg",".webp"))])
    if not files:
        print("No images found in ./images")
        return
    out = open(OUT_NDJSON,"w",encoding="utf-8")
    all_objs = []
    for f in files:
        try:
            obj = analyze_image(f)
            out.write(json.dumps(obj, ensure_ascii=False) + "\n")
            all_objs.append(obj)
            print("✓", os.path.basename(f))
            time.sleep(0.2)
        except Exception as e:
            print("✗", os.path.basename(f), "->", repr(e))
    out.close()

    # build front selection: top visually cool TEES
    tees = [o for o in all_objs if o.get("category")=="Tee"]
    tees.sort(key=lambda x: (float(x.get("visual_coolness_score",0)), x.get("badge")=="Rebel Drop"), reverse=True)
    front = {
        "generated_at": __import__("datetime").datetime.now().isoformat(),
        "top_tees": [
            {
              "image_id": t["image_id"],
              "handle": t["handle"],
              "title": t["title"],
              "badge": t.get("badge",""),
              "price_band": t.get("price_band","CORE"),
              "palette": t.get("palette",[]),
              "visual_coolness_score": t.get("visual_coolness_score",0),
              "hero_card_ready": t.get("hero_card_ready", False)
            } for t in tees[:8]
        ]
    }
    with open(OUT_FRONT,"w",encoding="utf-8") as fh:
        json.dump(front, fh, ensure_ascii=False, indent=2)
    print("Wrote:", OUT_NDJSON, OUT_FRONT)

if __name__ == "__main__":
    main()