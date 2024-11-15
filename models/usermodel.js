module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');
    //user table 
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            readOnly: true
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
        verified: {   
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
            field: 'verified',
        },
        verificationToken: {  
            type: DataTypes.STRING,
            allowNull: true,
            field: 'verification_token',
        },
        verificationTokenExpiresAt: {  
            type: DataTypes.DATE,
            allowNull: true,
            field: 'verification_token_expires_at',
        },
        accountCreated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true
        },
        accountUpdated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true
        }
    }, {  
        tableName: 'User',  
        freezeTableName: true,
        timestamps: false, 
    });
    
    return User;
};