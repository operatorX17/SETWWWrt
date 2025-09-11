const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      status,
      price_band,
      view,
      search,
      sort = '-created_at'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (price_band) filter.price_band = price_band;
    if (view) filter.view = view;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { concept_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/stats - Get product statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgCoolnessScore: { $avg: '$visual_coolness_score' },
          avgPrice: { $avg: '$price_inr' },
          categoryCounts: {
            $push: '$category'
          },
          statusCounts: {
            $push: '$status'
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          avgCoolnessScore: { $round: ['$avgCoolnessScore', 2] },
          avgPrice: { $round: ['$avgPrice', 2] }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const statusStats = await Product.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      overview: stats[0] || { total: 0, avgCoolnessScore: 0, avgPrice: 0 },
      byCategory: categoryStats,
      byStatus: statusStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Product with this handle or image_id already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/products/:id/status - Update product status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: Date.now() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/products/:id/publish - Toggle publish status
router.patch('/:id/publish', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    product.is_published = !product.is_published;
    product.status = product.is_published ? 'active' : 'draft';
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products/bulk-import - Bulk import from AI output
router.post('/bulk-import', async (req, res) => {
  try {
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'Products must be an array' });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    for (const productData of products) {
      try {
        const existingProduct = await Product.findOne({ image_id: productData.image_id });
        
        if (existingProduct) {
          // Update existing product
          Object.assign(existingProduct, productData);
          await existingProduct.save();
          results.updated++;
        } else {
          // Create new product
          const newProduct = new Product(productData);
          await newProduct.save();
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          image_id: productData.image_id,
          error: error.message
        });
      }
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/products/export/shopify - Export products in Shopify format
router.get('/export/shopify', async (req, res) => {
  try {
    const { status = 'active' } = req.query;
    const products = await Product.find({ status });
    
    const shopifyProducts = products.map(product => product.toShopifyFormat());
    
    res.json({
      products: shopifyProducts,
      count: shopifyProducts.length,
      exported_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;