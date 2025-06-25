const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Country = sequelize.define('Country', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneCode: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    timestamps: true
});

module.exports = Country;
