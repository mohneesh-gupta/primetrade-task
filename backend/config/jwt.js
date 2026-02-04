module.exports = {
  secret: process.env.JWT_SECRET || 'mySecret',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
};
