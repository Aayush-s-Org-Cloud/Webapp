const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadFileToS3(file, userId) {  // Accept userId as a parameter
    const uniqueFileName = `${Date.now()}_${file.originalname}`;
    const key = `images/${userId}/${uniqueFileName}`;  // Store images under images/{user_id}/

    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    // Upload the file to S3
    const result = await s3.upload(params).promise();
    return result.Location;  // URL to access the image
}

async function deleteFileFromS3(fileKey) {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
    };
    await s3.deleteObject(params).promise();
}

module.exports = { uploadFileToS3, deleteFileFromS3 };