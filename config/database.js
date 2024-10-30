// database.js
const { Sequelize } = require('sequelize');
const statsdClient = require('../statsd'); // Import StatsD client
require('dotenv').config();
const logger = require('./logger'); 
const sequelize = new Sequelize({
    dialect: process.env.DATA_DIALECT,
    host: process.env.DATA_HOST,
    port: process.env.DATA_PORT,
    username: process.env.DATA_USER,
    password: process.env.DATA_PASSWORD,
    database: process.env.DATA_DATABASE,
     
});

// Wrap the query method to include timing metrics
async function timedQuery(query, options) {
    const start = Date.now();
    const result = await sequelize.query(query, options); // Executes the query
    const duration = Date.now() - start;

    statsdClient.timing('db.query.duration', duration); // Log the duration metric
    return result;
}

// Sync database and log success or failure
sequelize.sync()
    .then(() => console.log('Database synced successfully'))
    .catch((error) => console.error('Database sync failed:', error));

// Export the Sequelize instance and the timed query function
module.exports = sequelize,timedQuery ;