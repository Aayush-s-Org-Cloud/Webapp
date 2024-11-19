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
        return res.status(400).json();
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
            return res.status(400).json();
        }

        // Check if token has expired
        const currentTime = new Date();
        if (user.verificationTokenExpiresAt < currentTime) {
            logger.info('Verification token has expired.');
            return res.status(400).json();
        }

        // Update user verification status
        user.verified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;

        await user.save();

        logger.info(`User ${user.email} has been verified successfully.`);
        res.status(200).json();
    } catch (error) {
        logger.error('Verification error:', { error: error.message, stack: error.stack });
        res.status(500).json();
    }
};

module.exports = verifyEmail;