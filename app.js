
const express = require('express');
const app = express();
app.use(express.json());
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const healthRoutes = require('./routes/health_checker_routes');
const { handleNotFound } = require('./controller/healthcontroller');
const sequelize = require('./config/database'); // Database connection
const userRoutes = require('./routes/user_routes');  

// routes pathway
app.use('/v1',userRoutes); 
app.use('/', healthRoutes);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json();
  }
  next(err);
});
app.use(handleNotFound);

module.exports = app;