const bcrypt = require('bcrypt');
const sequelize = require('../config/database');   
const User = require('../models/usermodel')(sequelize);   

const createUser = async (userData) => {
    const { email, firstName, lastName, password } = userData;
    // password encryption 
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(User);  
    const newUser = await User.create({
        email,
        firstName,
        lastName,
        password: hashedPassword
    });

    return {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accountCreated: newUser.accountCreated,
        accountUpdated: newUser.accountUpdated
    };
};

module.exports = {
     
    createUser
};