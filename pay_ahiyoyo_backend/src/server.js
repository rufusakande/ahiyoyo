require('dotenv').config(); // Charger les variables d'environnement
const app = require('./app');
const { sequelize } = require('./models'); // Importer Sequelize

// Synchroniser les modèles avec la base de données
(async () => {
    try {
        await sequelize.sync({ alter: true }); // alter: true pour mettre à jour les tables sans perte de données
        console.log('Modèles synchronisés avec la base de données.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation des modèles :', error);
        process.exit(1); // Arrêter l'application si la synchronisation échoue
    }
})();

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
