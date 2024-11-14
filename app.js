const express = require('express');
const app = express();
const sequelize = require('./config/database'); 
const healthRoutes = require('./routes/health_checker_routes');
const { handleNotFound } = require('./controller/healthcontroller');
const userRoutes = require('./routes/user_routes');  
const imageRoutes = require('./routes/imageRoute');  
const { User } = require('./models/usermodel');

const {  EmailVerification } = require('../models/EmailVerification');
app.use('/', express.json());
app.use('/',userRoutes); 
app.use('/', healthRoutes);
app.use('/', imageRoutes);
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json();
  }
  next(err);
});


app.use(handleNotFound);

module.exports = app;
