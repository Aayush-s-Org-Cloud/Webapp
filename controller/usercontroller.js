const bcrypt = require('bcryptjs');
const userService = require('../services/user_service');
const User = require('../models/usermodel'); 
const validator = require('email-validator');
const logger = require('../logger');  
// For creating user
const createUser = async (request, response) => {
    const listedfields = ['email', 'first_name', 'last_name', 'password'];
    const requestfields = Object.keys(request.body);
    const nonlistedfield = requestfields.some(field => !listedfields.includes(field));

    if (nonlistedfield) {
        logger.info('Attempt to submit non-listed fields in createUser');
        return response.status(400).json();
    }

    const { email, first_name, last_name, password } = request.body;

    if (!email || !password || !first_name || !last_name) {
        logger.info('Missing required fields in createUser');
        return response.status(400).json();
    }

    if (!validator.validate(email)) {
        logger.info('Invalid email format in createUser');
        return response.status(422).json({ error: 'Invalid email format' });
    }

    const first_last_vali = /^[a-z0-9]+$/;
    if (!first_last_vali.test(first_name) || !first_last_vali.test(last_name)) {
        logger.info('First or last name validation failed in createUser');
        return response.status(422).json();
    }

    const passwordcondi = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordcondi.test(password)) {
        logger.info('Password validation failed in createUser');
        return response.status(422).json();
    }

    try {
        const newUser = await userService.createUser(request.body);
        logger.info(`New user created successfully: ${newUser.id}`);
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
        logger.error("Failed to create new user", { error: error.message });
        if (error.message === 'User with this email already exists') {
            return response.status(409).json();
        }
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// For updating user
const updateUser = async (req, res) => {
    const { first_name, last_name, password } = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['first_name', 'last_name', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        logger.info('Invalid update operation in updateUser');
        return res.status(400).json();
    }

    const nameValidation = /^[a-z0-9]+$/;
    if (first_name && !nameValidation.test(first_name) || last_name && !nameValidation.test(last_name)) {
        logger.info('Name validation failed in updateUser');
        return res.status(422).json();
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (password && !passwordRegex.test(password)) {
        logger.info('Password validation failed in updateUser');
        return res.status(422).json();
    }

    try {
        const user = req.user;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = await bcrypt.hash(password, 10);
        user.accountUpdated = new Date();
        await user.save();
        logger.info(`User updated successfully: ${user.id}`);
        res.setHeader('Cache-Control', 'no-cache');
        res.status(204).send();
    } catch (error) {
        logger.error("Failed to update user", { error: error.message });
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

function enforceJsonContentType(req, res, next) {
    if (req.method === 'PUT' || req.method === 'POST') {
        const contentType = req.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
            logger.info('Failed content type check in enforceJsonContentType');
            return res.status(400).json();
        }
    }
    next();
}

// For user information
const getUserInfo = async (req, res) => {
    if (req.method === 'GET' && (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !== 0)) {
        logger.info('Invalid query or body in getUserInfo');
        return res.status(400).json();
    }
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
        logger.info('Content length should be zero in getUserInfo');
        return res.status(400).send();
    }
    try {
        const user = req.user;
        logger.info(`User information retrieved successfully: ${user.id}`);
        res.setHeader('Cache-Control', 'no-cache');
        res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            accountCreated: user.accountCreated,
            accountUpdated: user.accountUpdated
        });
    } catch (error) {
        logger.error("Failed to retrieve user information", { error: error.message });
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    getUserInfo,
    updateUser,
    createUser,
    enforceJsonContentType
};