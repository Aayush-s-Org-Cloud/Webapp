const express = require('express');
const router = express.Router(); 
const { healthCheck } = require('../controller/healthcontroller');
// Health check route
router.all('/healthz', healthCheck);

module.exports = router;