const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/Product');
const cron = require('node-cron');
const router = express.Router();

// POST /api/sync/ai-output - Sync AI output files to database
router.post('/ai-output', async (req, res) => {
  try {
    const { filePath, autoSync = false } = req.body;
    const aiOutputPath = filePath || path.join(__dirname, '../out/ai_products.ndjson');
    
    // Check if file exists
    try {
      await fs.access(aiOutputPath);
    } catch (error) {
      return res.status(404).json({ error: 'AI output file not found' });
    }

    // Read and parse NDJSON file
    const fileContent = await fs.readFile(aiOutputPath, 'utf8');
    const lines = fileContent.trim().split('\n').filter(line => line.trim());
    
    const results = {
      total: lines.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };

    for (const line of lines) {
      try {
        const productData = JSON.parse(line);
        
        // Check if product already exists
        const existingProduct = await Product.findOne({ image_id: productData.image_id });
        
        if (existingProduct) {
          if (autoSync || new Date(productData.analyzed_at) > existingProduct.updated_at) {
            // Update existing product
            Object.assign(existingProduct, productData);
            existingProduct.updated_at = new Date();
            await existingProduct.save();
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // Create new product
          const newProduct = new Product({
            ...productData,
            status: 'draft',
            created_at: new Date(),
            updated_at: new Date()
          });
          await newProduct.save();
          results.created++;
        }
      } catch (error) {
        results.errors.push({
          line: line.substring(0, 100) + '...',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      results,
      synced_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sync/images - Sync product images from organized folders
router.post('/images', async (req, res) => {
  try {
    const { baseImagePath } = req.body;
    const imagePath = baseImagePath || path.join(__dirname, '../out');
    
    const results = {
      processed: 0,
      updated: 0,
      errors: []
    };

    // Process front view designs
    const frontViewPath = path.join(imagePath, 'front_view_designs');
    try {
      const designFolders = await fs.readdir(frontViewPath);
      
      for (const designFolder of designFolders) {
        const designPath = path.join(frontViewPath, designFolder);
        const stat = await fs.stat(designPath);
        
        if (stat.isDirectory()) {
          try {
            const imageFiles = await fs.readdir(designPath);
            const jpegFiles = imageFiles.filter(file => 
              file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg')
            );
            
            if (jpegFiles.length > 0) {
              // Find product by handle fragment
              const product = await Product.findOne({ handle_fragment: designFolder });
              
              if (product) {
                // Update product images
                product.images = jpegFiles.map((file, index) => ({
                  url: `/uploads/front_view_designs/${designFolder}/${file}`,
                  alt_text: `${product.concept_name} - Front View ${index + 1}`,
                  position: index + 1
                }));
                
                await product.save();
                results.updated++;
              }
            }
            
            results.processed++;
          } catch (error) {
            results.errors.push({
              folder: designFolder,
              error: error.message
            });
          }
        }
      }
    } catch (error) {
      results.errors.push({
        path: frontViewPath,
        error: error.message
      });
    }

    // Process back view designs
    const backViewPath = path.join(imagePath, 'back_view_designs');
    try {
      const designFolders = await fs.readdir(backViewPath);
      
      for (const designFolder of designFolders) {
        const designPath = path.join(backViewPath, designFolder);
        const stat = await fs.stat(designPath);
        
        if (stat.isDirectory()) {
          try {
            const imageFiles = await fs.readdir(designPath);
            const jpegFiles = imageFiles.filter(file => 
              file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg')
            );
            
            if (jpegFiles.length > 0) {
              // Find product by handle fragment and add back view images
              const product = await Product.findOne({ handle_fragment: designFolder });
              
              if (product) {
                const backImages = jpegFiles.map((file, index) => ({
                  url: `/uploads/back_view_designs/${designFolder}/${file}`,
                  alt_text: `${product.concept_name} - Back View ${index + 1}`,
                  position: (product.images?.length || 0) + index + 1
                }));
                
                product.images = [...(product.images || []), ...backImages];
                await product.save();
                results.updated++;
              }
            }
            
            results.processed++;
          } catch (error) {
            results.errors.push({
              folder: designFolder,
              error: error.message
            });
          }
        }
      }
    } catch (error) {
      results.errors.push({
        path: backViewPath,
        error: error.message
      });
    }

    res.json({
      success: true,
      results,
      synced_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sync/status - Get sync status
router.get('/status', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const productsWithImages = await Product.countDocuments({ 
      'images.0': { $exists: true } 
    });
    const syncedToShopify = await Product.countDocuments({ 
      shopify_product_id: { $exists: true } 
    });
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const draftProducts = await Product.countDocuments({ status: 'draft' });
    
    // Get latest AI output file info
    const aiOutputPath = path.join(__dirname, '../out/ai_products.ndjson');
    let aiFileInfo = null;
    try {
      const stats = await fs.stat(aiOutputPath);
      const content = await fs.readFile(aiOutputPath, 'utf8');
      const lines = content.trim().split('\n').filter(line => line.trim());
      
      aiFileInfo = {
        exists: true,
        size: stats.size,
        modified: stats.mtime,
        productCount: lines.length
      };
    } catch (error) {
      aiFileInfo = { exists: false };
    }

    res.json({
      database: {
        total_products: totalProducts,
        products_with_images: productsWithImages,
        synced_to_shopify: syncedToShopify,
        active_products: activeProducts,
        draft_products: draftProducts,
        image_sync_percentage: totalProducts > 0 ? Math.round((productsWithImages / totalProducts) * 100) : 0,
        shopify_sync_percentage: totalProducts > 0 ? Math.round((syncedToShopify / totalProducts) * 100) : 0
      },
      ai_output: aiFileInfo,
      last_checked: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sync/full - Full sync (AI output + images)
router.post('/full', async (req, res) => {
  try {
    const results = {
      ai_sync: null,
      image_sync: null,
      started_at: new Date().toISOString()
    };

    // Sync AI output first
    try {
      const aiOutputPath = path.join(__dirname, '../out/ai_products.ndjson');
      const fileContent = await fs.readFile(aiOutputPath, 'utf8');
      const lines = fileContent.trim().split('\n').filter(line => line.trim());
      
      const aiResults = {
        total: lines.length,
        created: 0,
        updated: 0,
        errors: []
      };

      for (const line of lines) {
        try {
          const productData = JSON.parse(line);
          const existingProduct = await Product.findOne({ image_id: productData.image_id });
          
          if (existingProduct) {
            Object.assign(existingProduct, productData);
            existingProduct.updated_at = new Date();
            await existingProduct.save();
            aiResults.updated++;
          } else {
            const newProduct = new Product({
              ...productData,
              status: 'draft',
              created_at: new Date(),
              updated_at: new Date()
            });
            await newProduct.save();
            aiResults.created++;
          }
        } catch (error) {
          aiResults.errors.push({ error: error.message });
        }
      }
      
      results.ai_sync = aiResults;
    } catch (error) {
      results.ai_sync = { error: error.message };
    }

    // Then sync images
    try {
      const imagePath = path.join(__dirname, '../out');
      const imageResults = { processed: 0, updated: 0, errors: [] };
      
      // Process front and back view designs
      for (const viewType of ['front_view_designs', 'back_view_designs']) {
        const viewPath = path.join(imagePath, viewType);
        try {
          const designFolders = await fs.readdir(viewPath);
          
          for (const designFolder of designFolders) {
            const designPath = path.join(viewPath, designFolder);
            const stat = await fs.stat(designPath);
            
            if (stat.isDirectory()) {
              const imageFiles = await fs.readdir(designPath);
              const jpegFiles = imageFiles.filter(file => 
                file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg')
              );
              
              if (jpegFiles.length > 0) {
                const product = await Product.findOne({ handle_fragment: designFolder });
                
                if (product) {
                  const newImages = jpegFiles.map((file, index) => ({
                    url: `/uploads/${viewType}/${designFolder}/${file}`,
                    alt_text: `${product.concept_name} - ${viewType.replace('_', ' ')} ${index + 1}`,
                    position: (product.images?.length || 0) + index + 1
                  }));
                  
                  if (viewType === 'front_view_designs') {
                    product.images = newImages;
                  } else {
                    product.images = [...(product.images || []), ...newImages];
                  }
                  
                  await product.save();
                  imageResults.updated++;
                }
              }
              imageResults.processed++;
            }
          }
        } catch (error) {
          imageResults.errors.push({ path: viewPath, error: error.message });
        }
      }
      
      results.image_sync = imageResults;
    } catch (error) {
      results.image_sync = { error: error.message };
    }

    results.completed_at = new Date().toISOString();
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-sync scheduler (runs every 5 minutes)
let autoSyncEnabled = false;

// POST /api/sync/auto/enable - Enable auto-sync
router.post('/auto/enable', (req, res) => {
  if (!autoSyncEnabled) {
    cron.schedule('*/5 * * * *', async () => {
      try {
        console.log('🔄 Running auto-sync...');
        
        // Check if AI output file has been updated
        const aiOutputPath = path.join(__dirname, '../out/ai_products.ndjson');
        const stats = await fs.stat(aiOutputPath);
        
        // Get last sync time from database or use a default
        const lastProduct = await Product.findOne({}, {}, { sort: { updated_at: -1 } });
        const lastSyncTime = lastProduct ? lastProduct.updated_at : new Date(0);
        
        if (stats.mtime > lastSyncTime) {
          console.log('📁 AI output file updated, syncing...');
          
          // Perform sync (simplified version)
          const fileContent = await fs.readFile(aiOutputPath, 'utf8');
          const lines = fileContent.trim().split('\n').filter(line => line.trim());
          
          let synced = 0;
          for (const line of lines) {
            try {
              const productData = JSON.parse(line);
              const existingProduct = await Product.findOne({ image_id: productData.image_id });
              
              if (!existingProduct) {
                const newProduct = new Product({
                  ...productData,
                  status: 'draft',
                  created_at: new Date(),
                  updated_at: new Date()
                });
                await newProduct.save();
                synced++;
              }
            } catch (error) {
              console.error('Auto-sync error:', error.message);
            }
          }
          
          console.log(`✅ Auto-sync completed: ${synced} new products`);
        }
      } catch (error) {
        console.error('Auto-sync failed:', error.message);
      }
    });
    
    autoSyncEnabled = true;
    console.log('🔄 Auto-sync enabled (every 5 minutes)');
  }
  
  res.json({ success: true, message: 'Auto-sync enabled' });
});

// POST /api/sync/auto/disable - Disable auto-sync
router.post('/auto/disable', (req, res) => {
  autoSyncEnabled = false;
  res.json({ success: true, message: 'Auto-sync disabled' });
});

// GET /api/sync/auto/status - Get auto-sync status
router.get('/auto/status', (req, res) => {
  res.json({ enabled: autoSyncEnabled });
});

module.exports = router;