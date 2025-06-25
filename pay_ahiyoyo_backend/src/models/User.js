const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db');

class User extends Model { }

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING, // Stocke l'URL de l'image de profil
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'moderator'),
      defaultValue: 'user', // Par défaut, chaque nouvel utilisateur est un "user"
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
   //   unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
     // unique: true,
    },
    otpCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alipayQR: {
      type: DataTypes.STRING, // Stocke l'URL de l'image du QR code
      allowNull: true,
    },
    idDocument: {
      type: DataTypes.STRING, // Stocke l'URL de l'image du document
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'pay_users',
    timestamps: true,
  }
);

module.exports = User;
