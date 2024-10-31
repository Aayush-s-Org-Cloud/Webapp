// controller/imageController.js
const { Image, sequelize } = require('../models');
const { uploadFileToS3 , deleteFileFromS3 } = require('../services/s3Service');
const logger = require('../logger'); 
const { v4: uuidv4 } = require('uuid');

exports.uploadImage = async (req, res) => {
    if (!req.file) {
        logger.warn('No image uploaded');
        return res.status(400).json({ message: 'No image uploaded' });
    }

    try {
        const { originalname, mimetype, buffer } = req.file;
        const userId = req.user.id;

        
        const existingImage = await Image.findOne({ where: { id: userId } });
        if (existingImage) {
            logger.info(`User ${userId} attempted to upload a second image`);
            return res.status(400).json({ message: 'Image already exists. Please delete the existing image before uploading a new one.' });
        }
        
        // Upload to S3
        const uniqueFileName = `${uuidv4()}_${originalname}`;
        const fileKey = `images/${userId}/${uniqueFileName}`;
        const imageUrl = await uploadFileToS3({
            file: buffer,          
            key: fileKey,
            mimeType: mimetype,
        });
        // Create Image record with the same ID as userId
        const image = await Image.create({
            id: userId,          
            file_name: originalname,
            key: fileKey,         
            url: imageUrl, 
            upload_date: new Date()
        });

        logger.info(`Image uploaded successfully for user ${userId}`, { imageId: image.id, key: image.key });

        res.status(201).json({
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.id   
        });
    } catch (error) {
        logger.error('Failed to upload image', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
};
exports.getImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const image = await Image.findOne({ where: { id: userId } });

        if (!image) {
            logger.info(`User ${userId} attempted to retrieve a non-existent image`);
            return res.status(404).json({ message: 'Image not found' });
        }

        logger.info(`Image retrieved successfully for user ${userId}`, { imageId: image.id });

        res.json({
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.id   
        });
    } catch (error) {
        logger.error('Failed to retrieve image', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to retrieve image', details: error.message });
    }
};
exports.deleteImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const image = await Image.findOne({ where: { id: userId } });
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        await deleteFileFromS3(image.key);
        await image.destroy();
        logger.info(`Image deleted successfully for user ${userId}`, { imageId: image.id, key: image.key });
        res.status(204).send();
    } catch (error) {
        logger.error('Failed to delete image', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
};