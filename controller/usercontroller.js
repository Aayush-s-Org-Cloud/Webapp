const bcrypt = require('bcryptjs');
const userService = require('../services/user_service');
const User = require('../models/usermodel');
const validator = require('email-validator');
const logger = require('../logger'); // Ensure logger is properly imported

// For creating user
const createUser = async (request, response) => {
    const listedfields = ['email', 'first_name', 'last_name', 'password'];
    const requestfields = Object.keys(request.body);

    const nonlistedfield = requestfields.some(field => !listedfields.includes(field));
    if (nonlistedfield) {
        logger.info('Attempt to create user with invalid fields');
        return response.status(400).json();
    }
    const { email, first_name, last_name, password } = request.body;
    if (!email || !password || !first_name || !last_name) {
        logger.info('Missing required fields for user creation');
        return response.status(400).json();
    }
    if (!validator.validate(email)) {
        logger.info('Invalid email format attempt');
        return response.status(422).json({ error: 'Invalid email format' });
    }
    if (!/^[a-z0-9]+$/i.test(first_name) || !/^[a-z0-9]+$/i.test(last_name)) {
        logger.info('Invalid name format attempt');
        return response.status(422).json();
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        logger.info('Invalid password format attempt');
        return response.status(422).json();
    }
    try {
        const newUser = await userService.createUser(request.body);
        logger.info(`User created successfully: ${newUser.email}`);
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
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// For updating user
const updateUser = async (req, res) => {
    const { first_name, last_name, password } = req.body;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['first_name', 'last_name', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        logger.info('Invalid fields update attempt');
        return res.status(400).json();
    }
    if (first_name && !/^[a-z0-9]+$/i.test(first_name)) {
        logger.info('Invalid first name format attempt during update');
        return res.status(422).json();
    }
    if (last_name && !/^[a-z0-9]+$/i.test(last_name)) {
        logger.info('Invalid last name format attempt during update');
        return res.status(422).json();
    }
    if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        logger.info('Invalid password format attempt during update');
        return res.status(422).json();
    }
    try {
        const user = req.user;
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (password) user.password = await bcrypt.hash(password, 10);

        user.accountUpdated = new Date();
        await user.save();
        logger.info(`User updated successfully: ${user.email}`);
        res.setHeader('Cache-Control', 'no-cache');
        res.status(204).send();
    } catch (error) {
        logger.error("Failed to update user", { error: error.message });
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// For retrieving user information
const getUserInfo = async (req, res) => {
    if (req.method === 'GET' && (Object.keys(req.query).length !== 0 || Object.keys(req.body).length !== 0)) {
        logger.info('Invalid request for user info retrieval');
        return res.status(400).json();
    }
    if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 0) {
        logger.info('Content-Length should not be set for GET request');
        return res.status(400).send();
    }
    try {
        const user = req.user;
        logger.info(`Retrieving user info: ${user.email}`);
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