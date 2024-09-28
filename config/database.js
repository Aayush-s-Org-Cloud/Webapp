const { Sequelize, DataTypes } = require('sequelize');  // Include DataTypes
require('dotenv').config();
const usermodel = require('../models/usermodel');  // Import your user model correctly

// Setup sequelize instance with environment variables
const sequelize = new Sequelize({
    dialect: process.env.DATA_DIALECT,
    host: process.env.DATA_HOST,
    port: process.env.DATA_PORT,
    username: process.env.DATA_USER,
    password: process.env.DATA_PASSWORD,
    database: process.env.DATA_DATABASE,
});

// Initialize models with sequelize
const User = usermodel(sequelize);  

// Check database connection
async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// checking all the defined models with database 
async function syncModels() {
    try {
        await sequelize.sync({ alter: true });   
        console.log('All models were integrated successfully.');
    } catch (error) {
        console.error('Failed to integrate models:', error);
    }
}

checkConnection();  // Check connection at startup
syncModels();  // Sync models at startup

module.exports = {
    User,
    sequelize
};