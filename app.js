const express = require('express');
const app = express();
const sequelize = require('./config/database'); 
const healthRoutes = require('./routes/health_checker_routes');
const { handleNotFound } = require('./controller/healthcontroller');
const userRoutes = require('./routes/user_routes');  

app.use('/v1', express.json());
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