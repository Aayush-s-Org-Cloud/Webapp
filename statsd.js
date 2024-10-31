const StatsD = require('hot-shots');
const logger = require('./logger');  

const statsdClient = new StatsD({
    host: process.env.StatsD_HOST ||'127.0.0.1',
    port: process.env.StatsD_PORT || 8125,
    prefix: 'myapp.',  
    errorHandler: function (error) {
        logger.error('StatsD Error:', error);
    }
});

 
statsdClient.increment('test.metric');
logger.info('StatsD client initialized and test metric sent.');

module.exports = statsdClient;