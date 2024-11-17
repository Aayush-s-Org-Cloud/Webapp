const express = require('express');
const router = express.Router();
const statsdClient = require('../statsd'); 
const { healthCheck } = require('../controller/healthcontroller');
// Health check route
router.all('/healthzz', express.json(), async (req, res) => {
    //number of times this health check API is called
    statsdClient.increment('api.healthz.check.count');
    
    // Measure the duration of this health check API call
    const start = Date.now();

    await healthCheck(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.healthz.check.duration', duration);
});

module.exports = router;