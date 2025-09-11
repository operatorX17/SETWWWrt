const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Product = require('../models/Product');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { productId, viewType = 'front' } = req.body;
    
    let uploadPath;
    if (productId) {
      // Upload to specific product folder
      const product = await Product.findById(productId);
      if (product && product.handle_fragment) {
        uploadPath = path.join(__dirname, '../uploads', `${viewType}_view_designs`, product.handle_fragment);
      } else {
        uploadPath = path.join(__dirname, '../uploads', 'temp');
      }
    } else {
      // Upload to temp folder
      uploadPath = path.join(__dirname, '../uploads', 'temp');
    }
    
    // Create directory if it doesn't exist
    try {
      await fs.mkdir(uploadPath, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files per upload
  }
});

// POST /api/upload/product-images - Upload images for a specific product
router.post('/product-images', upload.array('images', 10), async (req, res) => {
  try {
    const { productId, viewType = 'front', replaceExisting = false } = req.body;
    
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Process uploaded files
    const uploadedImages = req.files.map((file, index) => ({
      url: `/uploads/${viewType}_view_designs/${product.handle_fragment}/${file.filename}`,
      alt_text: `${product.concept_name} - ${viewType} view ${index + 1}`,
      position: index + 1,
      view_type: viewType,
      file_size: file.size,
      mime_type: file.mimetype
    }));
    
    // Update product images
    if (replaceExisting) {
      // Replace all images of this view type
      product.images = product.images.filter(img => img.view_type !== viewType);
      product.images.push(...uploadedImages);
    } else {
      // Add to existing images
      const existingCount = product.images.filter(img => img.view_type === viewType).length;
      uploadedImages.forEach((img, index) => {
        img.position = existingCount + index + 1;
      });
      product.images.push(...uploadedImages);
    }
    
    // Re-sort images by position
    product.images.sort((a, b) => a.position - b.position);
    
    await product.save();
    
    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      product_id: productId,
      uploaded_images: uploadedImages,
      total_images: product.images.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/bulk-images - Upload images in bulk (for multiple products)
router.post('/bulk-images', upload.array('images', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    const results = {
      total_files: req.files.length,
      processed: 0,
      matched: 0,
      unmatched: [],
      errors: []
    };
    
    for (const file of req.files) {
      try {
        results.processed++;
        
        // Try to match filename to product
        const filename = path.parse(file.originalname).name;
        
        // Extract product info from filename (assuming format like "Tee front 975.11.jpeg")
        const parts = filename.split(' ');
        if (parts.length >= 3) {
          const category = parts[0];
          const viewType = parts[1];
          const price = parts[2];
          
          // Find matching product
          const product = await Product.findOne({
            $or: [
              { category: new RegExp(category, 'i') },
              { concept_name: new RegExp(category, 'i') }
            ],
            price_inr: parseFloat(price)
          });
          
          if (product) {
            // Move file to correct location
            const targetDir = path.join(__dirname, '../uploads', `${viewType}_view_designs`, product.handle_fragment);
            await fs.mkdir(targetDir, { recursive: true });
            
            const targetPath = path.join(targetDir, file.filename);
            await fs.rename(file.path, targetPath);
            
            // Update product images
            const newImage = {
              url: `/uploads/${viewType}_view_designs/${product.handle_fragment}/${file.filename}`,
              alt_text: `${product.concept_name} - ${viewType} view`,
              position: (product.images?.length || 0) + 1,
              view_type: viewType,
              file_size: file.size,
              mime_type: file.mimetype
            };
            
            product.images = product.images || [];
            product.images.push(newImage);
            await product.save();
            
            results.matched++;
          } else {
            results.unmatched.push({
              filename: file.originalname,
              reason: 'No matching product found'
            });
          }
        } else {
          results.unmatched.push({
            filename: file.originalname,
            reason: 'Invalid filename format'
          });
        }
      } catch (error) {
        results.errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/upload/image/:productId/:imageIndex - Delete specific image
router.delete('/image/:productId/:imageIndex', async (req, res) => {
  try {
    const { productId, imageIndex } = req.params;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const index = parseInt(imageIndex);
    if (index < 0 || index >= product.images.length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }
    
    const imageToDelete = product.images[index];
    
    // Delete physical file
    try {
      const filePath = path.join(__dirname, '..', imageToDelete.url);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn('Could not delete physical file:', error.message);
    }
    
    // Remove from product
    product.images.splice(index, 1);
    
    // Re-index remaining images
    product.images.forEach((img, idx) => {
      img.position = idx + 1;
    });
    
    await product.save();
    
    res.json({
      success: true,
      message: 'Image deleted successfully',
      remaining_images: product.images.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/reorder-images/:productId - Reorder product images
router.post('/reorder-images/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { imageOrder } = req.body; // Array of image indices in new order
    
    if (!Array.isArray(imageOrder)) {
      return res.status(400).json({ error: 'imageOrder must be an array' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (imageOrder.length !== product.images.length) {
      return res.status(400).json({ error: 'imageOrder length must match number of images' });
    }
    
    // Reorder images
    const reorderedImages = imageOrder.map((oldIndex, newIndex) => {
      const image = product.images[oldIndex];
      return {
        ...image,
        position: newIndex + 1
      };
    });
    
    product.images = reorderedImages;
    await product.save();
    
    res.json({
      success: true,
      message: 'Images reordered successfully',
      images: product.images
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/upload/stats - Get upload statistics
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const productsWithImages = await Product.countDocuments({
      'images.0': { $exists: true }
    });
    
    // Count images by view type
    const pipeline = [
      { $unwind: '$images' },
      { $group: {
        _id: '$images.view_type',
        count: { $sum: 1 },
        total_size: { $sum: '$images.file_size' }
      }}
    ];
    
    const imageStats = await Product.aggregate(pipeline);
    
    // Calculate storage usage
    const uploadDir = path.join(__dirname, '../uploads');
    let totalStorageSize = 0;
    
    try {
      const calculateDirSize = async (dirPath) => {
        let size = 0;
        const items = await fs.readdir(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = await fs.stat(itemPath);
          
          if (stats.isDirectory()) {
            size += await calculateDirSize(itemPath);
          } else {
            size += stats.size;
          }
        }
        
        return size;
      };
      
      totalStorageSize = await calculateDirSize(uploadDir);
    } catch (error) {
      console.warn('Could not calculate storage size:', error.message);
    }
    
    res.json({
      products: {
        total: totalProducts,
        with_images: productsWithImages,
        without_images: totalProducts - productsWithImages,
        image_coverage_percentage: totalProducts > 0 ? Math.round((productsWithImages / totalProducts) * 100) : 0
      },
      images: {
        by_view_type: imageStats,
        total_count: imageStats.reduce((sum, stat) => sum + stat.count, 0),
        total_size_bytes: totalStorageSize,
        total_size_mb: Math.round(totalStorageSize / (1024 * 1024) * 100) / 100
      },
      storage: {
        upload_directory: uploadDir,
        total_size_bytes: totalStorageSize,
        total_size_mb: Math.round(totalStorageSize / (1024 * 1024) * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload/cleanup - Clean up orphaned files
router.post('/cleanup', async (req, res) => {
  try {
    const results = {
      scanned_files: 0,
      orphaned_files: 0,
      deleted_files: 0,
      errors: []
    };
    
    const uploadDir = path.join(__dirname, '../uploads');
    
    // Get all image URLs from database
    const products = await Product.find({}, 'images');
    const dbImageUrls = new Set();
    
    products.forEach(product => {
      if (product.images) {
        product.images.forEach(image => {
          if (image.url) {
            dbImageUrls.add(image.url);
          }
        });
      }
    });
    
    // Scan upload directory
    const scanDirectory = async (dirPath, relativePath = '') => {
      try {
        const items = await fs.readdir(dirPath);
        
        for (const item of items) {
          const itemPath = path.join(dirPath, item);
          const stats = await fs.stat(itemPath);
          
          if (stats.isDirectory()) {
            await scanDirectory(itemPath, path.join(relativePath, item));
          } else {
            results.scanned_files++;
            
            // Check if file is referenced in database
            const fileUrl = `/uploads/${path.join(relativePath, item).replace(/\\/g, '/')}`;
            
            if (!dbImageUrls.has(fileUrl)) {
              results.orphaned_files++;
              
              // Delete orphaned file
              try {
                await fs.unlink(itemPath);
                results.deleted_files++;
              } catch (error) {
                results.errors.push({
                  file: fileUrl,
                  error: error.message
                });
              }
            }
          }
        }
      } catch (error) {
        results.errors.push({
          directory: dirPath,
          error: error.message
        });
      }
    };
    
    await scanDirectory(uploadDir);
    
    res.json({
      success: true,
      results,
      cleaned_at: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;