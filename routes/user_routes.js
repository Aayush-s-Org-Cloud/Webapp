const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller'); // Ensure correct naming and path

// Route that handles user creation
router.post('/user', userController.createUser); // This path will be '/v1/user' based on `app.js`

module.exports = router;