const StatsD = require('hot-shots');
const logger = require('./logger');  

const statsdClient = new StatsD({
    host: '127.0.0.1',
    port: 8125,
    prefix: 'myapp.',  
    errorHandler: function (error) {
        logger.error('StatsD Error:', error);
    }
});

 
statsdClient.increment('test.metric');
logger.info('StatsD client initialized and test metric sent.');

module.exports = statsdClient;