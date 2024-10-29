// statsd.js
const StatsD = require('node-statsd');
const logger = require('./logger'); // Now, this module exists

const statsdClient = new StatsD({
    host: '127.0.0.1',
    port: 8125,
    prefix: 'myapp.',  
    errorHandler: function (error) {
        logger.error('StatsD Error:', error);
    }
});

// Optional: Confirm connection by sending a test metric
statsdClient.increment('test.metric');
logger.info('StatsD client initialized and test metric sent.');

module.exports = statsdClient;