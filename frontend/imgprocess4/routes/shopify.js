const express = require('express');
const Shopify = require('shopify-api-node');
const Product = require('../models/Product');
const router = express.Router();

// Initialize Shopify client
const getShopifyClient = () => {
  if (!process.env.SHOPIFY_SHOP_NAME || !process.env.SHOPIFY_ACCESS_TOKEN) {
    throw new Error('Shopify credentials not configured');
  }
  
  return new Shopify({
    shopName: process.env.SHOPIFY_SHOP_NAME,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN
  });
};

// GET /api/shopify/test - Test Shopify connection
router.get('/test', async (req, res) => {
  try {
    const shopify = getShopifyClient();
    const shop = await shopify.shop.get();
    
    res.json({
      connected: true,
      shop: {
        name: shop.name,
        domain: shop.domain,
        email: shop.email,
        currency: shop.currency,
        timezone: shop.timezone
      }
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message
    });
  }
});

// POST /api/shopify/sync-product/:id - Sync single product to Shopify
router.post('/sync-product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const shopify = getShopifyClient();
    const shopifyProductData = product.toShopifyFormat();

    let shopifyProduct;
    
    if (product.shopify_product_id) {
      // Update existing product
      shopifyProduct = await shopify.product.update(product.shopify_product_id, shopifyProductData);
    } else {
      // Create new product
      shopifyProduct = await shopify.product.create(shopifyProductData);
      
      // Update our product with Shopify IDs
      product.shopify_product_id = shopifyProduct.id.toString();
      if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
        product.shopify_variant_id = shopifyProduct.variants[0].id.toString();
      }
    }

    // Update sync status
    product.status = 'synced';
    product.last_synced = new Date();
    await product.save();

    res.json({
      success: true,
      product: product,
      shopify_product: {
        id: shopifyProduct.id,
        handle: shopifyProduct.handle,
        admin_url: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/products/${shopifyProduct.id}`
      }
    });
  } catch (error) {
    console.error('Shopify sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shopify/sync-all - Sync all active products to Shopify
router.post('/sync-all', async (req, res) => {
  try {
    const { force = false } = req.body;
    const filter = { status: 'active' };
    
    if (!force) {
      filter.shopify_product_id = { $exists: false };
    }

    const products = await Product.find(filter);
    const shopify = getShopifyClient();
    
    const results = {
      total: products.length,
      synced: 0,
      updated: 0,
      errors: []
    };

    for (const product of products) {
      try {
        const shopifyProductData = product.toShopifyFormat();
        let shopifyProduct;
        
        if (product.shopify_product_id && force) {
          // Update existing
          shopifyProduct = await shopify.product.update(product.shopify_product_id, shopifyProductData);
          results.updated++;
        } else if (!product.shopify_product_id) {
          // Create new
          shopifyProduct = await shopify.product.create(shopifyProductData);
          product.shopify_product_id = shopifyProduct.id.toString();
          if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
            product.shopify_variant_id = shopifyProduct.variants[0].id.toString();
          }
          results.synced++;
        }

        product.status = 'synced';
        product.last_synced = new Date();
        await product.save();
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        results.errors.push({
          product_id: product._id,
          title: product.title,
          error: error.message
        });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shopify/products - Get products from Shopify
router.get('/products', async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const shopify = getShopifyClient();
    
    const products = await shopify.product.list({
      limit: parseInt(limit),
      page: parseInt(page)
    });

    res.json({
      products: products.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        variants_count: p.variants.length,
        images_count: p.images.length
      })),
      count: products.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/shopify/product/:shopify_id - Delete product from Shopify
router.delete('/product/:shopify_id', async (req, res) => {
  try {
    const shopify = getShopifyClient();
    await shopify.product.delete(req.params.shopify_id);
    
    // Update our database
    const product = await Product.findOne({ shopify_product_id: req.params.shopify_id });
    if (product) {
      product.shopify_product_id = undefined;
      product.shopify_variant_id = undefined;
      product.status = 'draft';
      product.last_synced = undefined;
      await product.save();
    }

    res.json({ success: true, message: 'Product deleted from Shopify' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/shopify/webhook/product-update - Webhook for product updates
router.post('/webhook/product-update', async (req, res) => {
  try {
    const shopifyProduct = req.body;
    
    const product = await Product.findOne({ shopify_product_id: shopifyProduct.id.toString() });
    if (product) {
      // Update local product with Shopify changes
      product.title = shopifyProduct.title;
      product.description = shopifyProduct.body_html;
      product.is_published = shopifyProduct.status === 'active';
      product.last_synced = new Date();
      
      if (shopifyProduct.variants && shopifyProduct.variants.length > 0) {
        const variant = shopifyProduct.variants[0];
        product.price_inr = parseFloat(variant.price);
        product.inventory_quantity = variant.inventory_quantity;
        product.sku = variant.sku;
      }
      
      await product.save();
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/shopify/sync-status - Get sync status for all products
router.get('/sync-status', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const syncedCount = await Product.countDocuments({ shopify_product_id: { $exists: true } });
    const totalCount = await Product.countDocuments();
    const lastSync = await Product.findOne(
      { last_synced: { $exists: true } },
      {},
      { sort: { last_synced: -1 } }
    );

    res.json({
      total_products: totalCount,
      synced_products: syncedCount,
      sync_percentage: totalCount > 0 ? Math.round((syncedCount / totalCount) * 100) : 0,
      last_sync: lastSync ? lastSync.last_synced : null,
      status_breakdown: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;