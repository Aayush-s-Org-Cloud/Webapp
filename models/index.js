const sequelize = require('../config/database');   
const UserModel = require('./usermodel');          
const ImageModel = require('./imagemodel');        
const User = UserModel(sequelize);
const Image = ImageModel(sequelize);

 
Image.belongsTo(User, { foreignKey: 'id', as: 'user' });
User.hasOne(Image, { foreignKey: 'id', as: 'image' });

 
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Database synchronization failed:', error));

module.exports = {
    sequelize,
    User,
    Image,
};