// verify.js

const User = require('../models/usermodel');
const EmailVerification = require('../models/EmailVerification');
const logger = require('../logger');

const verifyEmail = async (req, res) => {
    const { token, userId } = req.query;

    if (!token || !userId) {
        logger.info('Missing token or userId in email verification');
        return res.status(400).send('Invalid verification link.');
    }

    try {
        // Find the verification record
        const verificationRecord = await EmailVerification.findOne({ where: { userId: userId, token: token } });

        if (!verificationRecord) {
            logger.info(`No verification record found for user ID: ${userId} with token: ${token}`);
            return res.status(400).send('Invalid or expired verification link.');
        }

        if (new Date() > verificationRecord.expiresAt) {
            logger.info(`Verification token expired for user ID: ${userId}`);
            return res.status(400).send('Verification link has expired.');
        }

        // Update user's verification status
        const user = await User.findByPk(userId);
        if (!user) {
            logger.info(`User not found for ID: ${userId}`);
            return res.status(400).send('User does not exist.');
        }

       // user.isEmailVerified = true; // Ensure your User model has this field
        await user.save();

        

        logger.info(`User email verified successfully: ${userId}`);
        return res.status(200).send('Email verified successfully.');
    } catch (error) {
        logger.error('Error during email verification', { error: error.message });
        return res.status(500).send('Internal server error.');
    }
};

module.exports = verifyEmail;