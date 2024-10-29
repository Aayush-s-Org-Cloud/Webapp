const Image = require('../models/imagemodel');
const { uploadFileToS3, deleteFileFromS3 } = require('../services/s3Service');

exports.uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No image uploaded' });
    }
    try {
        const { originalname, mimetype, buffer } = req.file;
        const userId = req.user.id; 
        const imageUrl = await uploadFileToS3({
            file: buffer,
            fileName: originalname,
            userId: userId,
            mimeType: mimetype,
        });

        // Save metadata in the database
        const image = await Image.create({
            file_name: originalname,
            url: imageUrl,
            user_id: userId,
            upload_date: new Date()
        });

        // Return the saved image metadata as JSON response
        res.status(201).json({
            file_name: image.file_name,
            id: image.id,
            url: image.url,
            upload_date: image.upload_date,
            user_id: image.user_id
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
        // Use images/{user_id}/{file_name} for deleteFileFromS3 to locate and delete the image
        const fileKey = `images/${req.user.id}/${image.file_name}`;
        await deleteFileFromS3(fileKey);   
        await image.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image', details: error.message });
    }
};