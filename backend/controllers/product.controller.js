const Product = require('../models/Product.model');

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };

    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }

    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort(sort);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products'
    });
  }
};

// Get single product (Public)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product'
    });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      imageUrl: imageUrl || '',
      createdBy: req.user._id
    });

    // Populate creator info
    await product.populate('createdBy', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product'
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const allowedUpdates = ['name', 'description', 'price', 'category', 'stock', 'imageUrl', 'isActive'];
    const updates = {};

    // Filter only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product'
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product'
    });
  }
};

// Get all products including inactive (Admin only)
const getAllProductsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const products = await Product.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: 'success',
      data: {
        products,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get all products admin error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products'
    });
  }
};

// Get product statistics (Admin only)
const getProductStats = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ stock: 0 });

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalProducts,
          active: activeProducts,
          inactive: totalProducts - activeProducts,
          outOfStock
        },
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch product statistics'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductStats
};
