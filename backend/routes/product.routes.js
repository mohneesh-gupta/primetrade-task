const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, restrictTo, optionalAuth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  getProductsValidation
} = require('../validations/product.validation');

// Admin routes (must come BEFORE public routes to avoid conflicts)
router.get('/admin/all', protect, restrictTo('admin'), getProductsValidation, validate, productController.getAllProductsAdmin);
router.get('/admin/stats', protect, restrictTo('admin'), productController.getProductStats);

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getProductsValidation, validate, productController.getAllProducts);
router.get('/:id', optionalAuth, productIdValidation, validate, productController.getProductById);

// Protected routes (Admin only for mutations)
router.post('/', protect, restrictTo('admin'), createProductValidation, validate, productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), updateProductValidation, validate, productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productIdValidation, validate, productController.deleteProduct);

module.exports = router;
