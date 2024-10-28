// statsd.js
const StatsD = require('node-statsd');
const statsdClient = new StatsD({
    host: '127.0.0.1',
    port: 8125,
    prefix: 'myapp.',  
});

module.exports = statsdClient;