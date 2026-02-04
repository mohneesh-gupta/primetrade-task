const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation
} = require('../validations/auth.validation');

// Public routes
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/password', protect, updatePasswordValidation, validate, authController.updatePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
