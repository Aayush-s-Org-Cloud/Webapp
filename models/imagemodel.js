// models/imagemodel.js
const { validate } = require('email-validator');
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            validate: {
                isUUID: 4  
            },
            references: {
                model: 'User',  
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        key: {   
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate:{
                isUrl: true
            }
        },
        upload_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    }, 
    {
        tableName: 'Images',
        freezeTableName: true
    });

    return Image;
};