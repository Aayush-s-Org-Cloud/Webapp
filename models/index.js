const sequelize = require('../config/database');   
const UserModel = require('./usermodel');          
const ImageModel = require('./imagemodel');        
const User = UserModel(sequelize);
const Image = ImageModel(sequelize);
User.hasOne(Image, { foreignKey: 'user_id', as: 'image', onDelete: 'CASCADE' }); 
Image.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

 
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Database synchronization failed:', error));

module.exports = {
    sequelize,
    User,
    Image,
};