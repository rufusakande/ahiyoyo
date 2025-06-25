const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./src/config/db');
const logger = require("./src/utils/logger");

// Import des routes
const authRoutes = require('./src/routes/authRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const phoneRoutes = require('./src/routes/phoneRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const passwordRoutes = require('./src/routes/passwordRoutes');
const countryRoutes = require('./src/routes/countryRoutes'); 
const profileRoutes = require('./src/routes/profileRoutes'); 
const adminRoutes = require('./src/routes/adminRoutes'); 
const { testTwilioConnection } = require('./src/services/twilioService');

const app = express();
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/phone', phoneRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/countries', countryRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/admin-kcazar', adminRoutes);

// Synchronisation de la base de données
//sequelize.sync({ alter: true }).then(() => logger.info('📦 Base de données synchronisée.'));
sequelize.sync()
    .then(() => logger.info("📦 Base de données synchronisée !"))
    .catch(err => logger.error("❌ Erreur de synchronisation :", err));


// Au démarrage du serveur
testTwilioConnection();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://0.0.0.0:${PORT}`);
  });