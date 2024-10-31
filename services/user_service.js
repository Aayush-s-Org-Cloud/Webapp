const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const sequelize = require('../config/database');   
const User = require('../models/usermodel')(sequelize);
const logger = require('../logger'); // Ensure logger is correctly configured and imported

const isExistingUser = async (email) => {
    const existingUser = await User.findOne({ 
        where: { email: email } 
    });
    if (existingUser) {
        logger.info(`User check - existing: ${email}`);
    } else {
        logger.info(`User check - not found: ${email}`);
    }
    return existingUser !== null;  
};

const createUser = async (userData) => {
    const { email, first_name, last_name, password } = userData;

    // if user already exists
    const userExists = await isExistingUser(email);
    if (userExists) {
        logger.info(`Attempt to create user that already exists: ${email}`);
        throw new Error('User with this email already exists');
    }

    // password hashing using bcrypt and salt rounds 
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(48).toString('hex');  

    // new user if user is not existing 
    const newUser = await User.create({
        email,
        first_name,
        last_name,
        password: hashedPassword,
        token  
    });

    logger.info(`New user created: ${newUser.id}`);

    return {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        accountCreated: newUser.accountCreated,
        accountUpdated: newUser.accountUpdated
    };
};

module.exports = {
    isExistingUser,
    createUser
};