const express = require('express');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
const logger = require("../utils/logger");

const router = express.Router();

router.post('/verify', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email déjà vérifié." });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = expiresAt;

        await user.save();

        await sendVerificationEmail(email, verificationCode);

        res.json({ message: "Code de vérification envoyé !" });
    } catch (error) {
        logger.error("❌ Erreur vérification email:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//confirm-email
router.post('/confirm', async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        // Vérifier si le code a expiré
        if (user.emailVerificationExpires < new Date() && !user.isEmailVerified) {
            return res.status(400).json({ message: "Code expiré. Veuillez en demander un nouveau." });
        }

        if (user.emailVerificationCode !== code && !user.isEmailVerified) {
            return res.status(400).json({ message: "Code invalide." });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email déjà vérifié." });
        }

        // Marquer l'email comme vérifié
        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        user.emailVerificationExpires = null;

        await user.save();

        res.json({ message: "Email vérifié avec succès !" });

    } catch (error) {
        logger.error("❌ Erreur confirmation email:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;