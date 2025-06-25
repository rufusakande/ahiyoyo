const { DataTypes, Model } = require('sequelize');
const sequelize = require('./db');
const { isValidFileType } = require('../utils/fileValidator');

class PayAlipay extends Model { }

PayAlipay.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      //   comment: "Prénom du payeur",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      //    comment: "Nom de famille du payeur",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountXOF: {
      type: DataTypes.FLOAT,
      allowNull: false,
      //   comment: "Montant en Franc CFA",
    },
    amountRMB: {
      type: DataTypes.FLOAT,
      allowNull: false,
      //    comment: "Montant en RMB (Yuan chinois)",
    },
    exchangeRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
      // comment: "Taux de change utilisé pour la conversion",
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    paymentNetwork: {
      type: DataTypes.STRING,
      allowNull: false,
      //  comment: "Réseau utilisé pour le paiement (ex: mtn, moov)",
    },
    paymentNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      //   comment: "Numéro de transaction Alipay",
    },
    AgreType: {
      type: DataTypes.STRING,
      allowNull: true,
      //   comment: "TYPE D'agrégateur",
    },
    AgrePayReference: {
      type: DataTypes.STRING,
      allowNull: true,
      //   comment: "Reference de payement agregateur",
    },
    statusPayement: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    alipayQRCode: {
      type: DataTypes.STRING,
      allowNull: false,
      //  comment: "Lien ou chemin vers le QR Code Alipay",
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
      //   comment: "Motif du paiement",
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValidFile(value) {
          if (!isValidFileType(value)) {
            throw new Error('Reason must be a valid file type (PDF, Word, PNG, or JPEG)');
          }
        }
      }
    },

  },
  {
    sequelize,
    tableName: 'pay_alipay_payments',
    timestamps: true,
  }
);

module.exports = PayAlipay;