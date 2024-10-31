// services/s3Service.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const logger = require('../logger'); 
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

/**
 * Uploads file to S3.
 * @param {Object} params  
 * @returns {Promise<string>}  
 */
async function uploadFileToS3({ file, key, mimeType }) {    
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,   
        ContentType: mimeType,
    };
    try {
        const result = await s3.upload(params).promise();
        logger.info(`File uploaded to S3: ${key}`, { url: result.Location });
        return result.Location;  
    } catch (error) {
        logger.error('Failed to upload file to S3', { error: error.message });
        throw error;
    } 
}

/**
 * Deletes file from S3.
 * @param {string} fileKey  
 * @returns {Promise<void>}
 */
async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
    };

    try {
        logger.info(`Attempting to delete file from S3 with key: ${fileKey}`);
        await s3.deleteObject(params).promise();
        logger.info(`File deleted successfully from S3: ${fileKey}`);
    } catch (error) {
        logger.error('Error deleting file from S3', { error: error.message, stack: error.stack });
        throw new Error('File deletion from S3 failed');
    }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };