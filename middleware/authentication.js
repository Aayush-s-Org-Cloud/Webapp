const sequelize = require('../config/database');   
const initUserModel = require('../models/usermodel');
const User = initUserModel(sequelize);
const bcrypt = require('bcryptjs');
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Access denied. No credentials sent!' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
        return res.status(401).json({ error: 'Credentials are not complete.' });
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ error: 'No user found with this email.' });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid Password.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = authenticate;