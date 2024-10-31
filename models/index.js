// models/index.js
const sequelize = require('../config/database');   
const UserModel = require('./usermodel');          
const ImageModel = require('./imagemodel');        

const User = UserModel(sequelize);
const Image = ImageModel(sequelize);
 
User.hasOne(Image, { 
    foreignKey: 'id',   
    as: 'image', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
}); 

Image.belongsTo(User, { 
    foreignKey: 'id',  
    as: 'user' 
});

// Synchronize Models with Database
sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Database synchronization failed:', error));

module.exports = {
    sequelize,
    User,
    Image,
};