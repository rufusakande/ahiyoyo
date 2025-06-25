'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userIdentifier: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      platform: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isEmailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isPhoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isIdentityVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      emailVerificationCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emailVerificationExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      phoneVerificationCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phoneVerificationExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      identityDocument: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isDocumentSubmitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      role: {
        type: Sequelize.STRING,
        defaultValue: 'user'
      },
      passwordResetToken: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      passwordResetCode: {
        type: Sequelize.VARCHAR(6),
        allowNull: true
      },
      passwordResetExpires: {
        type: Sequelize.DATETIME,
        allowNull: true
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resetPasswordCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resetPasswordExpires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
