// database.js
const { Sequelize } = require('sequelize');
const statsdClient = require('../statsd'); // Import StatsD client
require('dotenv').config();
const logger = require('../logger');
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
    try {
        const result = await sequelize.query(query, options);
        const duration = Date.now() - start;
        statsdClient.timing('db.query.duration', duration);  
        logger.info(`Query executed successfully: ${query}`, { duration, rows: result.length });  
        return result;
    } catch (error) {
        const duration = Date.now() - start;
        statsdClient.timing('db.query.duration', duration);  
        logger.error(`Query failed: ${query}`, { error: error.message, duration });  
        throw error;
    }
}
 
sequelize.sync()
    .then(() => console.log('Database synced successfully'))
    .catch((error) => console.error('Database sync failed:', error));
module.exports = sequelize,timedQuery ;