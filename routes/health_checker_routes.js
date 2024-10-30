const express = require('express');
const router = express.Router();
const statsdClient = require('../statsd'); // Import StatsD client
const { healthCheck } = require('../controller/healthcontroller');
const logger = require('./logger'); 
// Health check route
router.all('/healthz', async (req, res) => {
    // Count the number of times this health check API is called
    statsdClient.increment('api.healthz.check.count');
    
    // Measure the duration of this health check API call
    const start = Date.now();

    await healthCheck(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.healthz.check.duration', duration);
});

module.exports = router;