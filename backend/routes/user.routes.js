const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All routes require authentication and admin role
router.use(protect);
router.use(restrictTo('admin'));

// Admin routes for user management
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.toggleUserStatus);
router.delete('/:id', userController.deleteUser);

module.exports = router;
