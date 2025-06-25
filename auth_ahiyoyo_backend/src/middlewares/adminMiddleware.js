const User = require('../models/User');
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({ message: 'Accès interdit' });
        }

        const user = await User.findByPk(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        }

        next(); // Passe à la route suivante si l'utilisateur est admin
    } catch (error) {
        logger.error('Erreur Middleware Admin:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
