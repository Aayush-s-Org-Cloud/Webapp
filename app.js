const express = require('express');
const app = express();
const healthRoutes = require('./routes/health_checker_routes');
const { healthCheck} = require('./controller/healthController');
const sequelize = require('./config/database');  
// middleware to parse JSON payloads
app.use(express.json());

// routes define 
app.use('/', healthRoutes);

// Health Check with database connection
app.get('/healthz', healthCheck, async (req, res, next) => {
  try {
    
    await sequelize.authenticate();
    
    // 200 OK if the database connection is successful
    res.status(200).send();
  } catch (error) {
    // 503 Service Unavailable if the database connection fails
    res.status(503).send();
  }
});

app.get('/test', (req, res) => {
  res.send('Health Checker Working');
});

module.exports = app;