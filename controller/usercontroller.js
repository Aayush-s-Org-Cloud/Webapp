const bcrypt = require('bcrypt');
const userService = require('../services/user_service');
const User = require('../models/usermodel'); 
//for creating user 
const createUser = async (request, response) => {
    const { email, firstName, lastName, password } = request.body;

    if (!email || !password || !firstName || !lastName) {
        return response.status(400).json({ error: 'Missing one or more required fields of user' });
    }

    try {
        const newUser = await userService.createUser(request.body);
        response.status(201).json({
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            token: newUser.token,
            accountCreated: newUser.accountCreated,
            accountUpdated: newUser.accountUpdated
        });
    } catch (error) {
        if (error.message === 'User with this email already exists') {
            return response.status(400).json('User with this email already exists');
        }

        console.error("Failed to create new user:", error);
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
// for updating user 
 const updateUser = async (req, res) => {
    const { firstName, lastName, password } = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Attempted to update invalid fields' });
    }
    try {
        const user = req.user; 
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (password) user.password = await bcrypt.hash(password, 10);

        user.accountUpdated = new Date();  
        await user.save();
        res.status(204).send();  
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
//for user information
const getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        const { id, firstName, lastName, email, accountCreated, accountUpdated } = user;

        // user information without password
        res.status(200).json({
            id,
            firstName,
            lastName,
            email,
            accountCreated,
            accountUpdated
        });
    } catch (error) {
        console.error("Failed to retrieve user information:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    getUserInfo,  
    updateUser,
    createUser
};
 