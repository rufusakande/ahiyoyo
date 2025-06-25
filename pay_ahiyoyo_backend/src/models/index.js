const sequelize = require('./db');
const User = require('./User');
const PayAlipay = require('./PayAlipay');

// Associer les modèles
//Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
//User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });

module.exports = { sequelize, User, PayAlipay };
