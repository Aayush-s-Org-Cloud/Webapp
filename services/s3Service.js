// Importing the S3 client and necessary commands
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const logger = require('../logger');

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });

async function uploadFileToS3({ file, key, mimeType }) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: mimeType,
    };

    try {
        const command = new PutObjectCommand(params);
        const { Location } = await s3Client.send(command);
        logger.info(`File uploaded to S3: ${key}`, { url: Location });
        return Location;
    } catch (error) {
        logger.error('Failed to upload file to S3', { error: error.message });
        throw error;
    }
}

async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);
        logger.info(`File deleted successfully from S3: ${fileKey}`);
    } catch (error) {
        logger.error('Error deleting file from S3', { error: error.message });
        throw new Error('File deletion from S3 failed');
    }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };