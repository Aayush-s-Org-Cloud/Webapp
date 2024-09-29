const bcrypt = require('bcrypt');
const crypto = require('crypto'); 
const sequelize = require('../config/database');   
const User = require('../models/usermodel')(sequelize);


const isExistingUser = async (email) => {
    const existingUser = await User.findOne({ 
        where: { email: email } 
    });
    return existingUser !== null;  
};

const createUser = async (userData) => {
    const { email, firstName, lastName, password } = userData;

    // if user already exists
    const userExists = await isExistingUser(email);
    if (userExists) {
        throw new Error('User with this email already exists');
    }

    // password hashing using bcrypt and salt rounds 
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(48).toString('hex');  
    // new user if user is not existing 
    const newUser = await User.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        token  
    });

    return {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        token, 
        accountCreated: newUser.accountCreated,
        accountUpdated: newUser.accountUpdated
    };
};

module.exports = {
    isExistingUser,
    createUser
};