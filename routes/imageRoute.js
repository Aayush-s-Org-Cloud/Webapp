const express = require('express');
const multer = require('multer');
const router = express.Router();
const statsdClient = require('../statsd');  
const authenticate = require('../middleware/authentication');
const imageController = require('../controller/imageController');
const logger = require('../logger'); 
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
         
        if (!file.mimetype.startsWith('image/')) {
            logger.warn('Rejected file upload: Not an image', { fileName: file.originalname, mimetype: file.mimetype });
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

 
router.post('/v1/user/self/pic', authenticate, upload.single('pic'), async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.upload.count');
    const start = Date.now();

    await imageController.uploadImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.upload.duration', duration);
});

 
router.get('/v1/user/self/pic', authenticate, async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.get.count');
    const start = Date.now();

    await imageController.getImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.get.duration', duration);
});


router.delete('/v1/user/self/pic', authenticate, async (req, res) => {
    statsdClient.increment('api.v1.user.self.pic.delete.count');
    const start = Date.now();

    await imageController.deleteImage(req, res);

    const duration = Date.now() - start;
    statsdClient.timing('api.v1.user.self.pic.delete.duration', duration);
});

 
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
         
        if (err.code === 'LIMIT_FILE_SIZE') {
            logger.warn('Rejected file upload: File too large', { fileSize: err.limit });
            return res.status(400).json({ message: 'File size should not exceed 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
         
        logger.error('File upload error', { error: err.message });
        return res.status(400).json({ message: err.message });
    }
    next();
});

module.exports = router;

