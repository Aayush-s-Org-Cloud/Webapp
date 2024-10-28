// s3Service.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const statsdClient = require('../statsd');

// Retrieve bucket name from environment variable
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

async function uploadFile(params) {
    const start = Date.now();
    const result = await s3.upload({ ...params, Bucket: BUCKET_NAME }).promise();
    const duration = Date.now() - start;
    
    statsdClient.timing('s3.upload.duration', duration);
    return result;
}

async function getFile(params) {
    const start = Date.now();
    const result = await s3.getObject({ ...params, Bucket: BUCKET_NAME }).promise();
    const duration = Date.now() - start;
    
    statsdClient.timing('s3.getObject.duration', duration);
    return result;
}

module.exports = { uploadFile, getFile };