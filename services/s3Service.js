const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const logger = require('../logger'); 
const { v4: uuidv4 } = require('uuid');
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
/**
 * Uploads file to S3.
 * @param {Object} params  
 * @returns {Promise<string>}  
 */
async function uploadFileToS3({ file, fileName, userId, mimeType }) {    
    const uniqueFileName = `${uuidv4()}_${fileName}`;
    const key = `images/${userId}/${uniqueFileName}`;  

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,   
        ContentType: mimeType,
    };
    // Upload the file to S3
    try {
        const result = await s3.upload(uploadParams).promise();
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
        console.log(`Attempting to delete file from S3 with key: ${fileKey}`);
        await s3.deleteObject(deleteParams).promise();
        console.log(`File deleted successfully from S3: ${fileKey}`);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('File deletion from S3 failed');
    }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };