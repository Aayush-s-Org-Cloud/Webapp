// models/EmailVerification.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure correct path
const User = require('./usermodel'); // Import User model

const EmailVerification = sequelize.define('EmailVerification', {
  userId: {
    type: DataTypes.UUID, // Assuming User ID is UUID
    allowNull: false,
    primaryKey: true, // Composite primary key if needed
    references: {
      model: User,
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

// Define association
EmailVerification.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(EmailVerification, { foreignKey: 'userId' });

module.exports = EmailVerification;