// middleware/authenticate.js

const { User } = require('../models'); // Ensure correct path
const logger = require('../logger');
const bcrypt = require('bcryptjs');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!user.verified) { // Changed to 'verified'
            logger.info(`Access denied for unverified user: ${user.email}`);
            return res.status(403).json({ error: 'Email not verified.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = authenticate;