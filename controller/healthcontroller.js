const sequelize = require('../config/database');
const logger = require('../logger');  

const healthCheck = async (req, res, next) => {
  // Set headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    // Check database connection
    await sequelize.authenticate();
    logger.info('Database connection successful');

    // Only GET method is allowed
    if (req.method !== 'GET') {
      logger.warn('Non-GET method attempted on health check');
      return res.status(405).send();
    }

    // Check for unexpected content in GET requests
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
      logger.warn('Content-length should be zero for GET requests in health check');
      return res.status(400).send();
    }

    if (Object.keys(req.query).length !== 0) {
      logger.warn('Query parameters are not allowed in health check');
      return res.status(400).send();
    }

    // If all checks pass, return 200 OK
    res.status(200).send();

  } catch (error) {
    logger.error('Database connection error during health check', { error: error.message });
    return res.status(503).send();
  }
};

const handleNotFound = (req, res) => {
  logger.warn('404 Not Found error on request', { path: req.path });
  return res.status(404).json();
};

module.exports = {
  healthCheck,
  handleNotFound
};