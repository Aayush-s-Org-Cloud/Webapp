const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const logger = require('../logger');
const REGION = process.env.AWS_REGION || 'us-east-1'; 
const BUCKET_NAME = process.env.S3_BUCKET_NAME;  

const s3Client = new S3Client({
  region: REGION
});

/**
 * Uploads file to S3.
 * @param {Object} params  
 * @returns {Promise<string>} URL of the uploaded file
 */
async function uploadFileToS3({ file, key, mimeType }) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: mimeType,
  };
  
  try {
    const command = new PutObjectCommand(params);
    const result = await s3Client.send(command);
    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    logger.info(`File uploaded to S3: ${key}`, { url: url });
    return url;
  } catch (error) {
    logger.error('Failed to upload file to S3', { error: error.message, stack: error.stack });
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
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    logger.info(`File deleted successfully from S3: ${fileKey}`);
  } catch (error) {
    logger.error('Error deleting file from S3', { error: error.message, stack: error.stack });
    throw new Error('File deletion from S3 failed');
  }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };