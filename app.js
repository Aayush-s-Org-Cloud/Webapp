const express = require('express');
const app = express();
const healthRoutes = require('./routes/health_checker_routes');
const { handleNotFound } = require('./controller/healthcontroller');
const sequelize = require('./config/database'); // Database connection

// routes pathway 
app.use('/', healthRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json();
  }
  next(err);
});
app.use(handleNotFound);

module.exports = app;