const express = require('express');
const multer = require('multer');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const imageController = require('../controllers/imageController');
const statsdClient = require('../statsd');   

// Set up multer for image file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a user's profile image
router.post('/v1/user/self/pic', authenticate, upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    await imageController.uploadImage(req, res);
    const duration = Date.now() - startTime;
    statsdClient.increment('api.user.self.pic.post.count');
    statsdClient.timing('api.user.self.pic.post.duration', duration);
});

// Route to retrieve a user's profile image
router.get('/v1/user/self/pic', authenticate, async (req, res) => {
    const startTime = Date.now();
    await imageController.getImage(req, res);
    const duration = Date.now() - startTime;
    statsdClient.increment('api.user.self.pic.get.count');
    statsdClient.timing('api.user.self.pic.get.duration', duration);
});

// Route to delete a user's profile image
router.delete('/v1/user/self/pic', authenticate, async (req, res) => {
    const startTime = Date.now();
    await imageController.deleteImage(req, res);
    const duration = Date.now() - startTime;
    statsdClient.increment('api.user.self.pic.delete.count');
    statsdClient.timing('api.user.self.pic.delete.duration', duration);
});

module.exports = router;