const sequelize = require('../config/database');  
const UserModel = require('./usermodel');         
const ImageModel = require('./imagemodel');        
const EmailVerificationModel = require('./EmailVerification'); 

// Initialize models
const User = UserModel(sequelize);
const Image = ImageModel(sequelize);
const EmailVerification = EmailVerificationModel(sequelize);

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

EmailVerification.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(EmailVerification, { foreignKey: 'userId' });

// Synchronize Models with Database
sequelize.sync({ force: true })
    .then(() => console.log('Database synchronized'))
    .catch((error) => console.error('Database synchronization failed:', error));

module.exports = {
    sequelize,
    User,
    Image,
    EmailVerification,
};