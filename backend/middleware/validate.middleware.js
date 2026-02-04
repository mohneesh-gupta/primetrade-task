const { validationResult } = require('express-validator');

// Middleware to handle validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: extractedErrors
    });
  }
  
  next();
};

module.exports = validate;
