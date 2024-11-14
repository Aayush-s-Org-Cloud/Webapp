// user_routes.js
const express = require('express');
const router = express.Router();
const statsdClient = require('../statsd');  
const userController = require('../controller/usercontroller');
const authenticate = require('../middleware/authentication');  
const verifyEmail = require('../controller/verify');
// Track metrics and enforce JSON content type for the create user endpoint
router.post('/v1/user', userController.enforceJsonContentType, async (req, res) => {
    statsdClient.increment('api.v1.user.create.count');
    const start = Date.now();

    await userController.createUser(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.create.duration', duration);
});
router.get('/verify', verifyEmail);
// Track metrics, enforce JSON content type, and authentication for updating user info
router.put('/v1/user/self', authenticate, userController.enforceJsonContentType, async (req, res) => {
    statsdClient.increment('api.v1.user.update.count');
    const start = Date.now();

    await userController.updateUser(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.update.duration', duration);
});

// Track metrics and authenticate for retrieving user info
router.get('/v1/user/self', authenticate, async (req, res) => {
    statsdClient.increment('api.v1.user.get.count');
    const start = Date.now();

    await userController.getUserInfo(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.get.duration', duration);
});

// Handle unsupported methods for user endpoints
router.all('/v1/user', (req, res) => {
    res.status(405).send({ error: 'Method Not Allowed' });
});

router.all('/v1/user/self', (req, res) => {
    res.status(405).send({ error: 'Method Not Allowed' });
});

module.exports = router;