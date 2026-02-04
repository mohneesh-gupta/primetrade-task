const { body, param, query } = require('express-validator');

const VALID_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
];

const updateProductValidation = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .trim()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  body('imageUrl')
    .optional()
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
];

const productIdValidation = [
  param('id')
    .isMongoId().withMessage('Invalid product ID')
];

const getProductsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  query('category')
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Search query too long')
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  productIdValidation,
  getProductsValidation,
  VALID_CATEGORIES
};
