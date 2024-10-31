const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 
const sequelize = require('../config/database');   
const User = require('../models/usermodel')(sequelize);
const logger = require('../logger');  
const isExistingUser = async (email) => {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        logger.info(`User exists check: User with email ${email} already exists.`);
    }
    return existingUser !== null;  
};

const createUser = async (userData) => {
    const { email, first_name, last_name, password } = userData;

    // Check if user already exists
    const userExists = await isExistingUser(email);
    if (userExists) {
        logger.error(`Attempt to create a user that already exists: ${email}`);
        throw new Error('User with this email already exists');
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(48).toString('hex');  
    logger.info(`Creating new user: ${email}`);

    // Create new user
    const newUser = await User.create({
        email,
        first_name,
        last_name,
        password: hashedPassword,
        token  
    });

    logger.info(`User created successfully: ${newUser.email}`);
    
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