const express = require('express');
const multer = require('multer');
const router = express.Router();
const statsdClient = require('../statsd'); // Import StatsD client
const authenticate = require('../middleware/authentication');
const imageController = require('../controller/imageController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a user's profile image
router.post('/v1/user/self/pic', authenticate, upload.single('pic'), async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.upload.count');
    const start = Date.now();

    await imageController.uploadImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.upload.duration', duration);
});

// Route to retrieve a user's profile image
router.get('/v1/user/self/pic', authenticate, async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.get.count');
    const start = Date.now();

    await imageController.getImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.get.duration', duration);
});

// Route to delete a user's profile image
router.delete('/v1/user/self/pic', authenticate, async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.delete.count');
    const start = Date.now();

    await imageController.deleteImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.delete.duration', duration);
});

module.exports = router;