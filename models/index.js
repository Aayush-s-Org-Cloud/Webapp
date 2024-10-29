const sequelize = require('../config/database');  // Import sequelize instance
const UserModel = require('./usermodel');         // Import user model definition
const ImageModel = require('./imagemodel');       // Import image model definition

// Initialize models
const User = UserModel(sequelize);
const Image = ImageModel(sequelize);

// Define associations if necessary
Image.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(Image, { foreignKey: 'user_id', as: 'images' });

// Sync models with the database
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Database synchronization failed:', error));

// Export models and sequelize instance
module.exports = {
    sequelize,
    User,
    Image,
};