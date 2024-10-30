// models/imagemodel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'User',  
                key: 'id',  
            },
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
            allowNull: false
        },
        upload_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
         
    }, {
        tableName: 'Images',
        freezeTableName: true
    });

    return Image;
};