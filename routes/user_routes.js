// routes/user_routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');

router.post('/user', userController.createUser);
router.put('/user/self', authenticate, userController.updateUser);
router.get('/user/self', authenticate, userController.getUserInfo);


router.all('/user', (req, res) => {
    res.status(405).send({ error: 'Method Not Allowed' });
});

router.all('/user/self', (req, res) => {
    res.status(405).send({ error: 'Method Not Allowed' });
});

module.exports = router;