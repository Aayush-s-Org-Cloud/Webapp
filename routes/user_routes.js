// routes/user_routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/user', userController.createUser);
router.put('/user/self', authenticate, userController.updateUser);
router.get('/user/self', authenticate, userController.getUserInfo);
module.exports = router;