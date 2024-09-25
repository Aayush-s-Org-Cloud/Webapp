const healthCheck = (req, res, next) => {
    // If the request contains a payload, return 400 Bad Request and don't proceed further
    if (Object.keys(req.body).length > 0) {
      return res.status(400).json({ error: 'Payload not allowed' });
    }
  
    // Seting headers 
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');   
  
     
    next();
  };

  module.exports = {
    healthCheck,
  };