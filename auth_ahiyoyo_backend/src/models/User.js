const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const crypto = require('crypto'); 

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userIdentifier: {  
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    firstName: {  
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {  
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {  
        type: DataTypes.STRING,
        allowNull: true
    },
    countryCode: {  // 🇧🇯 Code du pays (BJ, TG, CI)
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, // ✔️ Email vérifié
    isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, // ✔️ Téléphone vérifié
    isIdentityVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, // ✔️ Document vérifié
    emailVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    emailVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    phoneVerificationCode: {
        type: DataTypes.STRING,
        allowNull: true
    }, 
    phoneVerificationExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    identityDocument: {
        type: DataTypes.STRING,
        allowNull: true, 
    },
    isDocumentSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }, 
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user'
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

// ✅ Générer un identifiant unique avant la création de l'utilisateur
User.beforeCreate(async (user) => {
    user.userIdentifier = await generateUserIdentifier(user);
});

// ✅ Fonction pour générer un identifiant unique et stylisé
async function generateUserIdentifier(user) {
    const date = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // Format YYMMDD
    const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 caractères aléatoires
    return `U-AHIYOYO-${date}-${randomCode}`;
}

module.exports = User;
