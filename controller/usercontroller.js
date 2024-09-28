const userService = require('../services/user_service');

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
            accountCreated: newUser.accountCreated,
            accountUpdated: newUser.accountUpdated
        });
    } catch (error) {
        console.error("Failed to create new user:", error);
        response.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    createUser
};