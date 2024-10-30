const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Image = sequelize.define('Image', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
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
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',  
                key: 'id',  
            }
        }
    }, {
        tableName: 'Images',
        freezeTableName: true
    });

    return Image;
};