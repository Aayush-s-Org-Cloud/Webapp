const bcrypt = require('bcryptjs');
const userService = require('../services/user_service');
const User = require('../models/usermodel'); 
const validator = require('email-validator');
//for creating user 
const createUser = async (request, response) => {
    const listedfields = ['email', 'first_name', 'last_name', 'password','accountCreated','accountUpdated'];
    const requestfields = Object.keys(request.body);

    const nonlistedfield = requestfields.some(field => !listedfields.includes(field));
    if (nonlistedfield) {
        return response.status(400).json();
    }
    const { email, first_name, last_name, password } = request.body;
    if (!email || !password || !first_name || !last_name) {
        return response.status(400).json();
    }
    if (!validator.validate(email)) {
        return response.status(422).json({ error: 'Invalid email format' });
    }
    const first_last_vali = /^[a-z0-9]+$/;
    if (!first_last_vali.test(first_name) || !first_last_vali.test(last_name)) {
        return response.status(422).json();
    }
    const passwordcondi = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordcondi.test(password)) {
        return response.status(422).json();
    }
    try {
        const newUser = await userService.createUser(request.body);
        response.setHeader('Cache-Control', 'no-cache');
        response.status(201).json({
            id: newUser.id,
            email: newUser.email,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
           
            accountCreated: newUser.accountCreated,
            accountUpdated: newUser.accountUpdated
        });
    } catch (error) {
        if (error.message === 'User with this email already exists') {
            return response.status(409).json();
        }

        console.error("Failed to create new user:", error);
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
    
};
// for updating user 
 const updateUser = async (req, res) => {
    const { first_name, last_name, password } = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['first_name', 'last_name', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    
    
    if (!isValidOperation) {
        return res.status(403).json();
    }
    const nameValidation = /^[a-z0-9]+$/;
    if (first_name && !nameValidation.test(first_name)) {
        return res.status(422).json();
    }
    if (last_name && !nameValidation.test(last_name)) {
        return res.status(422).json();
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordRegex.test(password)) {
        return res.status(422).json();
    }
    
    try {
        const user = req.user; 
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = await bcrypt.hash(password, 10);

        user.accountUpdated = new Date();  
        await user.save();
        res.setHeader('Cache-Control', 'no-cache');
        res.status(204).send();  
    } catch (error) {
        console.error("Failed to update user:", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }

};
function enforceJsonContentType(req, res, next) {
    // Check if the request is a PUT request
    if (req.method === 'PUT','POST') {
        // Ensure the content type is 'application/json'
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            return res.status(400).json();
        }
    }
    next();
}
//for user information
const getUserInfo = async (req, res) => {
    if (req.method === 'GET' && (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !== 0)) {
        return res.status(400).json();
    }
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
        return res.status(400).send();  
      }
    try {
        const user = req.user;
        const { id, first_name, last_name, email, accountCreated, accountUpdated } = user;
        res.setHeader('Cache-Control', 'no-cache');
        // user information without password
        res.status(200).json({
            id,
            first_name,
            last_name,
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
    createUser,
    enforceJsonContentType
};
 