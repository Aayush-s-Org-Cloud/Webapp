// models/EmailVerification.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EmailVerification = sequelize.define('EmailVerification', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'User',
                key: 'id',
            },
            onDelete: 'CASCADE',
            field: 'user_id',
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'expires_at',
        },
        emailSent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'email_sent',
        },
    }, {
        tableName: 'email_verifications',
        timestamps: false,
    });

    return EmailVerification;
};