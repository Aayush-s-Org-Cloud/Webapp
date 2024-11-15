const sequelize = require('../config/database');
const UserModel = require('./usermodel');
const ImageModel = require('./imagemodel');

const User = UserModel(sequelize);
const Image = ImageModel(sequelize);

// Define associations
User.hasOne(Image, {
    foreignKey: 'userId',
    as: 'image',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Image.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

// Remove EmailVerification-related code

module.exports = {
    sequelize,
    User,
    Image,
};