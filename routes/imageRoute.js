const express = require('express');
const multer = require('multer');
const router = express.Router();
const authenticate = require('../middleware/authentication');
const imageController = require('../controller/imageController');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a user's profile image
router.post('/v1/user/self/pic', authenticate, upload.single('image'), imageController.uploadImage);

// Route to retrieve a user's profile image
router.get('/v1/user/self/pic', authenticate, imageController.getImage);

// Route to delete a user's profile image
router.delete('/v1/user/self/pic', authenticate, imageController.deleteImage);

module.exports = router;