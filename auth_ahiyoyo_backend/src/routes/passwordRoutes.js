const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../services/emailService');
const { Op } = require('sequelize'); // Assure-toi d'importer Op depuis Sequelize
const logger = require("../utils/logger");

const router = express.Router();

//forgot-password'
router.post('/forgot', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        // Générer un token sécurisé pour la réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
        await user.save();

        // Envoyer l'email avec le lien de réinitialisation
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendResetPasswordEmail(email, resetLink);

        res.json({ message: "Un email de réinitialisation a été envoyé." });

    } catch (error) {
        logger.error("❌ Erreur lors de la demande de réinitialisation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//reset-password
router.post('/reset', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    [Op.gt]: Date.now()
                }
            }
        });

        if (!user) return res.status(400).json({ message: "Token invalide ou expiré." });

        // Hasher le nouveau mot de passe
        const bcrypt = require('bcryptjs');
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Mot de passe mis à jour avec succès !" });

    } catch (error) {
        logger.error("❌ Erreur réinitialisation mot de passe :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;
