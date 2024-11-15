// tests/integration_tests.js

// Set environment variables required for tests
process.env.SNS_TOPIC_ARN = 'arn:aws:sns:us-east-1:123456789012:MyTopic';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'fakeAccessKeyId';
process.env.AWS_SECRET_ACCESS_KEY = 'fakeSecretAccessKey';
process.env.S3_BUCKET_NAME = 'test-bucket';

// Import and configure AWSMock before requiring any AWS SDK-dependent modules
const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

AWSMock.setSDKInstance(AWS);

// Mock SNS publish
AWSMock.mock('SNS', 'publish', (params, callback) => {
    callback(null, { MessageId: 'mocked-message-id' });
});

// Mock S3 upload (or other methods as used in your application)
AWSMock.mock('S3', 'upload', (params, callback) => {
    callback(null, { Location: 'http://example.com/test-image.jpg', Key: 'test-image.jpg' });
});

// Mock fs module
jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn()
}));

// Mock winston logger
jest.mock('winston', () => {
    const mLogger = { info: jest.fn(), error: jest.fn(), warn: jest.fn() };
    return {
        createLogger: jest.fn(() => mLogger),
        format: {
            combine: jest.fn(),
            timestamp: jest.fn(),
            printf: jest.fn(),
            errors: jest.fn()
        },
        transports: {
            Console: jest.fn(),
            File: jest.fn()
        }
    };
});

// Now import the rest of your modules
const request = require('supertest');
const app = require('../app');  
const { sequelize, User, Image } = require('../models'); 
const statsdClient = require('../statsd'); // Adjust the path as necessary

// Sync database before running tests
beforeAll(async () => {
    await sequelize.sync({ force: true });  
});

describe('User API', () => {
    let userId;
    let authHeader;

    it('create new user', async () => {
        const uniqueSuffix = Date.now();
        const userData = {
            email: `testing${uniqueSuffix}@gmail.com`,
            first_name: 'test',
            last_name: 'user',
            password: 'Password@456'
        };

        const response = await request(app)
            .post('/v1/user')
            .send(userData)
            .expect('Content-Type', /json/)
            .expect(201);

        // if user was created successfully
        if (response.statusCode !== 201) {
            console.error("User creation failed");
            return; 
        }

        // user ID and authorization header for use in other tests
        userId = response.body.id;
        authHeader = `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`;

        // Retrieve the verification token from the database
        const user = await User.findOne({ where: { email: userData.email.toLowerCase() } });
        const verificationToken = user.verificationToken;

        // Perform email verification
        await request(app)
            .get('/v1/user/verify')
            .query({ token: verificationToken, email: userData.email })
            .expect(200);
    });

    describe('Update User', () => {
        it('updating allowed fields', async () => {
            // authorization header is set  
            if (!authHeader) {
                console.error("auth setup is incomplete.");
                return;  
            }

            // update user
            await request(app)
                .put('/v1/user/self')
                .set('Authorization', authHeader)
                .send({ first_name: "updated", last_name: "updatedlast" })
                .expect(204);  
        });
    });

    describe('Duplicate Email Registration', () => {
        it('registration not allowed for existing email', async () => {
            const uniqueSuffix = Date.now();
            const userData = {
                email: `dupli${uniqueSuffix}@hotmail.com`, 
                first_name: 'duplicate',
                last_name: 'test',
                password: 'Password@456'
            };
    
            // First user registration
            await request(app)
                .post('/v1/user')
                .send(userData)
                .expect(201);
    
            // Second user registration with the same email 
            await request(app)
                .post('/v1/user')
                .send(userData)
                .expect(409);  
        });
    });
});

describe('Authentication', () => {
    it('reject auth with wrong password', async () => {
        // Create a unique email for each user to avoid conflicts
        const uniqueSuffix = Date.now();
        const userData = {
            email: `auth${uniqueSuffix}@yahoo.com`,
            first_name: 'auth',
            last_name: 'user',
            password: 'Password@456'
        };

        // new user
        await request(app)
            .post('/v1/user')
            .send(userData)
            .expect(201);

        // Retrieve the verification token from the database
        const user = await User.findOne({ where: { email: userData.email.toLowerCase() } });
        const verificationToken = user.verificationToken;

        // Perform email verification
        await request(app)
            .get('/v1/user/verify')
            .query({ token: verificationToken, email: userData.email })
            .expect(200);

        //correct email & wrong pass
        const wrongAuthHeader = `Basic ${Buffer.from(`${userData.email}:wrongpassword`).toString('base64')}`;

        // authenticate with wrong pass
        await request(app)
            .get('/v1/user/self')
            .set('Authorization', wrongAuthHeader)
            .expect(401);   
    });

    it('authenticate with correct username and pass', async () => {
        
        const uniqueSuffix = Date.now();
        const userData = {
            email: `correct${uniqueSuffix}@gmail.com`,
            first_name: 'correct',
            last_name: 'user',
            password: 'Password@456'
        };

        // new user
        const response = await request(app)
            .post('/v1/user')
            .send(userData)
            .expect(201);
        
        const authHeader = `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`;

        // Retrieve the verification token from the database
        const user = await User.findOne({ where: { email: userData.email.toLowerCase() } });
        const verificationToken = user.verificationToken;

        // Perform email verification
        await request(app)
            .get('/v1/user/verify')
            .query({ token: verificationToken, email: userData.email })
            .expect(200);

        // Authenticate with correct credentials
        await request(app)
            .get('/v1/user/self')
            .set('Authorization', authHeader)
            .expect(200);   
    });
});


afterAll(async () => {
    AWSMock.restore('SNS');  
    AWSMock.restore('S3'); // Restore S3 mock
    await sequelize.close();   
    if (statsdClient && typeof statsdClient.close === 'function') {
        statsdClient.close();  
    }
});