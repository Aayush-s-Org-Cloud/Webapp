module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');
    
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            
        },
       
        accountCreated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true,
        },
        accountUpdated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true,
        }
    });
    
    return User;
};