const sequelize = require('../config/database');

const healthCheck = async (req, res, next) => {
  //  headers 
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    // always checking database connection first for any request 
    await sequelize.authenticate();
    // no other than get method is allowed 
    if (req.method !== 'GET') {
      return res.status(405).send();  
    }
    // For GET requests checking any content header iof it is greater than 0 than its a payload 
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
      return res.status(400).send();  
    }
    if (Object.keys(req.query).length !== 0) {
      return res.status(400).send();
  }
    // If everything is fine, return 200 OK
    res.status(200).send(); 

  } catch (error) {
    console.error('Database connection error:', error.message);  
    return res.status(503).send();  
  }
};
//unknown pages 
const handleNotFound = (req, res) => {
  return res.status(404).json();
};

module.exports = {
  healthCheck,
  handleNotFound
};