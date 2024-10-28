const Image = require('../models/imagemodel');  
const { uploadFileToS3, deleteFileFromS3 } = require('../services/s3Service'); // S3 service functions

exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    try {
        const imageUrl = await uploadFileToS3(req.file);
        const image = await Image.create({
            file_name: req.file.originalname,
            url: imageUrl,
            user_id: req.user.id,
            upload_date: new Date()
        });
        res.status(201).json(image);
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
};

exports.getImage = async (req, res) => {
    try {
        const image = await Image.findOne({ where: { user_id: req.user.id } });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve image', details: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const image = await Image.findOne({ where: { user_id: req.user.id } });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        await deleteFileFromS3(image.file_name);
        await image.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
};