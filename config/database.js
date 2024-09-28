const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: process.env.DATA_DIALECT,
    host: process.env.DATA_HOST,
    port: process.env.DATA_PORT,
    username: process.env.DATA_USER,
    password: process.env.DATA_PASSWORD,
    database: process.env.DATA_DATABASE,
});
 
sequelize.sync()
    .then(() => console.log('Database synced successfully'))
    .catch((error) => console.error('Database sync failed:', error));

module.exports = sequelize;