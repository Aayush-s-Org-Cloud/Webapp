const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const logger = require('../logger'); 
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadFileToS3({ file, fileName, userId, mimeType }) {    
    const uniqueFileName = `${Date.now()}_${fileName}`;
    const key = `images/${userId}/${uniqueFileName}`;  

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,   
        ContentType: mimeType,
    };
    // Upload the file to S3
    const result = await s3.upload(params).promise();
    return result.Location;  
}

async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
    };

    try {
        console.log(`Attempting to delete file from S3 with key: ${fileKey}`);
        await s3.deleteObject(params).promise();
        console.log(`File deleted successfully from S3: ${fileKey}`);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw new Error('File deletion from S3 failed');
    }
}

module.exports = { uploadFileToS3, deleteFileFromS3 };