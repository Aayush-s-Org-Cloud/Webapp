const sequelize = require('../config/database');  
const UserModel = require('./usermodel');         
const ImageModel = require('./imagemodel');        
 
// Initialize models
const User = UserModel(sequelize);
const Image = ImageModel(sequelize); 

// Define associations
User.hasOne(Image, { 
    foreignKey: 'userId',   
    as: 'image', 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
}); 

Image.belongsTo(User, { 
    foreignKey: 'userId',  
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