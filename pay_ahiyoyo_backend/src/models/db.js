const { Sequelize } = require('sequelize');
require('dotenv').config(); // Charger les variables d'environnement

// Configuration de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // Utiliser l'adresse publique
    port: process.env.DB_PORT || 3306, // Par défaut, le port MySQL est 3306
    dialect: 'mysql',
    logging: false, // Désactivez les logs SQL pour éviter les spams dans la console
});

// Tester la connexion
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de données :', error);
    }
})();

module.exports = sequelize;
