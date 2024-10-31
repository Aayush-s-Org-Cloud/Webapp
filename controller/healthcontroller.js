const sequelize = require('../config/database');
const logger = require('../logger'); // Assuming logger is configured properly in the 'logger.js' file

const healthCheck = async (req, res, next) => {
  // Set headers for caching policies
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    // Always check database connection first for any request
    await sequelize.authenticate();
    logger.info('Database connection successful');

    // No method other than GET is allowed
    if (req.method !== 'GET') {
      logger.info(`Method not allowed: ${req.method}`);
      return res.status(405).send();
    }

    // For GET requests checking if any content header is greater than 0 which indicates a payload
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
      logger.info('Payload on GET request where none is expected');
      return res.status(400).send();
    }

    // Ensure no query parameters are allowed
    if (Object.keys(req.query).length !== 0) {
      logger.info('Query parameters not allowed in health check');
      return res.status(400).send();
    }

    // If everything is fine, return 200 OK
    res.status(200).send();
    logger.info('Health check passed successfully');

  } catch (error) {
    logger.error('Database connection error:', error.message);
    return res.status(503).send();
  }
};

// Handler for unknown pages
const handleNotFound = (req, res) => {
  logger.info(`Request made to unknown route: ${req.originalUrl}`);
  return res.status(404).json();
};

module.exports = {
  healthCheck,
  handleNotFound
};