const authRoutes = require('./src/routes/authRoutes');
const { authenticateToken } = require('./src/middleware/authMiddleware');

module.exports = {
    authRoutes,
    authenticateToken
};
