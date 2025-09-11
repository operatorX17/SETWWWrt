const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  // AI Generated Fields
  image_id: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tee', 'Hoodie', 'Cap', 'Slide', 'Sweatshirt', 'FullShirt', 'Hat', 'Poster', 'Slipper', 'Wallet', 'HeadBand']
  },
  concept_name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true,
    unique: true
  },
  handle_fragment: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  palette: [{
    name: String,
    hex: String
  }],
  badge: {
    type: String,
    enum: ['Rebel Drop', 'Under ₹999', 'Premium', 'Limited Edition']
  },
  price_band: {
    type: String,
    enum: ['BUDGET', 'CORE', 'PREMIUM'],
    required: true
  },
  price_inr: {
    type: Number,
    required: true
  },
  tags: [String],
  visual_coolness_score: {
    type: Number,
    min: 0,
    max: 1
  },
  hero_card_ready: {
    type: Boolean,
    default: false
  },
  view: {
    type: String,
    enum: ['front', 'back', 'detail'],
    required: true
  },
  analyzed_at: {
    type: Date,
    default: Date.now
  },
  
  // E-commerce Fields
  shopify_product_id: {
    type: String,
    sparse: true
  },
  shopify_variant_id: {
    type: String,
    sparse: true
  },
  inventory_quantity: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  weight: {
    type: Number,
    default: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  
  // Image Management
  images: [{
    url: String,
    alt_text: String,
    position: Number,
    cloudinary_id: String
  }],
  
  // Status Management
  status: {
    type: String,
    enum: ['draft', 'active', 'archived', 'synced'],
    default: 'draft'
  },
  is_published: {
    type: Boolean,
    default: false
  },
  
  // SEO
  meta_title: String,
  meta_description: String,
  
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_synced: Date
});

// Indexes for performance
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ handle: 1 });
ProductSchema.index({ shopify_product_id: 1 });
ProductSchema.index({ created_at: -1 });
ProductSchema.index({ visual_coolness_score: -1 });

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  
  // Generate SKU if not provided
  if (!this.sku) {
    this.sku = `OG-${this.category.toUpperCase()}-${this.handle_fragment.toUpperCase()}-${Date.now()}`;
  }
  
  // Generate meta fields if not provided
  if (!this.meta_title) {
    this.meta_title = this.title;
  }
  if (!this.meta_description) {
    this.meta_description = this.description.substring(0, 160);
  }
  
  next();
});

// Virtual for price in different currencies
ProductSchema.virtual('price_usd').get(function() {
  return (this.price_inr / 83).toFixed(2); // Approximate conversion
});

// Methods
ProductSchema.methods.toShopifyFormat = function() {
  return {
    title: this.title,
    body_html: this.description,
    vendor: 'OG',
    product_type: this.category,
    handle: this.handle,
    tags: this.tags.join(','),
    status: this.is_published ? 'active' : 'draft',
    variants: [{
      price: this.price_inr,
      sku: this.sku,
      inventory_quantity: this.inventory_quantity,
      weight: this.weight,
      weight_unit: 'g'
    }],
    images: this.images.map(img => ({
      src: img.url,
      alt: img.alt_text,
      position: img.position
    })),
    metafields: [
      {
        namespace: 'og_data',
        key: 'concept_name',
        value: this.concept_name,
        type: 'single_line_text_field'
      },
      {
        namespace: 'og_data',
        key: 'visual_coolness_score',
        value: this.visual_coolness_score.toString(),
        type: 'number_decimal'
      },
      {
        namespace: 'og_data',
        key: 'palette',
        value: JSON.stringify(this.palette),
        type: 'json'
      }
    ]
  };
};

module.exports = mongoose.model('Product', ProductSchema);