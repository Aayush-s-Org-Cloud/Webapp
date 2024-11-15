// controllers/verifyEmail.js

const { User } = require('../models'); // Removed EmailVerification import
const logger = require('../logger');

const verifyEmail = async (req, res) => {
    const { email, token } = req.query;

    // Log the verification attempt
    logger.info(`Verification attempt for email: ${email}, token: ${token}`);

    // Validate presence of email and token
    if (!email || !token) {
        logger.info('Email or token missing in verification request.');
        return res.status(400).json({ message: 'Email and token are required.' });
    }

    try {
        // Trim and standardize email
        const standardizedEmail = email.trim().toLowerCase();

        // Find user by email and token
        const user = await User.findOne({
            where: {
                email: standardizedEmail,
                verificationToken: token,
            },
        });

        if (!user) {
            logger.info('User not found with provided email and token.');
            return res.status(400).json({ message: 'Invalid token or email' });
        }

        // Check if token has expired
        const currentTime = new Date();
        if (user.verificationTokenExpiresAt < currentTime) {
            logger.info('Verification token has expired.');
            return res.status(400).json({ message: 'Token expired' });
        }

        // Update user verification status
        user.verified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;

        await user.save();

        logger.info(`User ${user.email} has been verified successfully.`);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        logger.error('Verification error:', { error: error.message, stack: error.stack });
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = verifyEmail;