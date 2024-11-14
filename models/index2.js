// models/index.js

const sequelize = require('../config/database');
const UserModel = require('./usermodel');
const EmailVerificationModel = require('./EmailVerification');

// Initialize models
const User = UserModel(sequelize);
const EmailVerification = EmailVerificationModel(sequelize);

// Define associations
EmailVerification.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(EmailVerification, { foreignKey: 'userId' });

// Export models and sequelize instance
module.exports = {
    User,
    EmailVerification,
    sequelize,
};