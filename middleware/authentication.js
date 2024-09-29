const sequelize = require('../config/database');  
const User = require('../models/usermodel')(sequelize);


const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).send({ error: 'No authentication token provided' });
        }

        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(401).send({ error: 'Not authorized to access this resource' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).send({ error: 'Internal server error', details: error.message });
    }
};

module.exports = authenticate;