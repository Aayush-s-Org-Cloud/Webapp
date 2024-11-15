const { User } = require('../models'); // Import only the User model
const logger = require('../logger');

const verifyEmail = async (req, res) => {
    const { token, email } = req.query;

    if (!token || !email) {
        logger.info('Missing token or email in email verification');
        return res.status(400).send('Invalid verification link.');
    }
    const userEmail = email.toLowerCase();

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email: userEmail } });
        logger.info(`Verification attempt for email: ${userEmail}`);

        if (!user) {
            logger.info(`User not found for email: ${userEmail}`);
            return res.status(400).send('Invalid or expired verification link.');
        }

        // Check if the token matches
        if (user.verificationToken !== token) {
            logger.info(`Invalid verification token for email: ${userEmail}`);
            return res.status(400).send('Invalid or expired verification link.');
        }

        // Check if the token has expired
        if (new Date() > user.verificationTokenExpiresAt) {
            logger.info(`Verification token expired for email: ${userEmail}`);
            return res.status(400).send('Verification link has expired.');
        }

        // Update user's verification status
        user.isEmailVerified = true;
        user.verificationToken = null; // Clear the token
        user.verificationTokenExpiresAt = null; // Clear the expiration
        await user.save();

        logger.info(`User email verified successfully: ${userEmail}`);
        return res.status(200).send('Email verified successfully.');
    } catch (error) {
        logger.error('Error during email verification', { message: error.message, stack: error.stack });
        console.error('Error during email verification:', error);
        return res.status(500).send('Internal server error.');
    }
};

module.exports = verifyEmail;