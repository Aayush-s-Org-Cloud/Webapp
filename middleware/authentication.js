const sequelize = require('../config/database');   
const initUserModel = require('../models/usermodel');
const User = initUserModel(sequelize);
const logger = require('../logger');
const bcrypt = require('bcryptjs');
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json();
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
        return res.status(401).json();
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json();
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json();
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication failed:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = authenticate;