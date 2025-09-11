# OG Gemini Batch Image Processor

A Python application that uses Google's Gemini AI to analyze product images and generate structured metadata for an OG-themed (Pawan Kalyan) fan merchandise store.

## Features

- Batch processing of product images using Gemini AI
- Automatic categorization (Hoodie, Tee, Cap, Slide)
- Color palette extraction limited to OG theme colors
- Product metadata generation with pricing and badges
- JSON output for easy integration with e-commerce platforms
- Front-end selection generation for top products

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API Key

1. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and add your API key:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

### 3. Alternative: Set Environment Variable

**Windows (PowerShell):**
```powershell
$env:GOOGLE_API_KEY="your_api_key_here"
```

**Windows (Command Prompt):**
```cmd
set GOOGLE_API_KEY=your_api_key_here
```

**Linux/Mac:**
```bash
export GOOGLE_API_KEY="your_api_key_here"
```

## Usage

### 1. Add Images

Place your product images in the `./images/` directory. Supported formats:
- PNG
- JPG/JPEG
- WebP

### 2. Run the Processor

```bash
python og_gemini_batch.py
```

### 3. Output Files

The script generates two files:

- **`ai_products.ndjson`**: Complete product data (one JSON object per line)
- **`front_selection.json`**: Curated selection of top tees for frontend display

## Configuration

### Environment Variables

- `GOOGLE_API_KEY`: Your Gemini API key (required)
- `GEMINI_MODEL`: Model to use (default: "gemini-2.5-flash")

### OG Theme Colors

The application uses a specific color palette:
- **Jet Black**: #0B0B0D
- **Blood Red**: #C1121F
- **Brass Gold**: #C99700
- **Ash White**: #EAEAEA

### Product Categories

- Hoodie
- Tee
- Cap
- Slide

### Badge System

- **Vault Exclusive**: Premium products (₹3000+)
- **Rebel Drop**: Standard products (₹1000-2499)
- **Under ₹999**: Budget-friendly products

## Output Format

### Product Object Structure

```json
{
  "image_id": "product1.jpg",
  "category": "Tee",
  "concept_name": "Blood Oath",
  "title": "OG // Tee — Blood Oath",
  "handle": "og-tee-blood-oath",
  "palette": [
    {"name": "Blood Red", "hex": "#C1121F"},
    {"name": "Jet Black", "hex": "#0B0B0D"}
  ],
  "description": "Sworn in crimson, bound by honor.\nReady to bleed for the cause.",
  "badge": "Vault Exclusive",
  "price_band": "VAULT_PRICE",
  "tags": ["CAT_TEE", "CUE_BLOOD_RED", "EN", "TE"],
  "visual_coolness_score": 0.85,
  "hero_card_ready": true
}
```

## Error Handling

The script includes:
- Automatic retry logic with exponential backoff
- Error logging for failed image processing
- Graceful handling of API rate limits

## Troubleshooting

### Common Issues

1. **"Set GOOGLE_API_KEY" error**
   - Ensure your API key is properly set in environment variables or .env file

2. **"No images found in ./images"**
   - Check that images are in the correct directory
   - Verify file formats are supported

3. **API rate limiting**
   - The script includes automatic retry logic
   - Consider adding longer delays between requests if needed

### Getting Help

If you encounter issues:
1. Check that all dependencies are installed
2. Verify your API key is valid and has sufficient quota
3. Ensure images are in supported formats and not corrupted

## License

This project is for educational and development purposes.