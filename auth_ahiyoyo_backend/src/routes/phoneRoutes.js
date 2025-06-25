const express = require("express");
const User = require("../models/User");
const Country = require("../models/Country");

const {
  sendWhatsAppVerification,
  verifyWhatsAppCode,
} = require("../services/twilioService");
const logger = require("../utils/logger");

const router = express.Router();

router.post("/verify", async (req, res) => {
  try {
    const { email, phone, country } = req.body;

    // ✅ Validation des champs requis en premier
    if (!email || !phone || !country) {
      return res.status(400).json({
        message: "Tous les champs (email, pays, phone) sont requis.",
      });
    }

    // ✅ Vérifier que le pays existe en base de données
    const countryData = await Country.findOne({ where: { name: country } });
    if (!countryData) {
      return res.status(400).json({ message: `Pays non autorisé.` });
    }

    // ✅ Chercher l'utilisateur par email
    const user = await User.findOne({ where: { email } });
    
    // ✅ Si l'utilisateur n'existe pas, le créer
    if (!user) {
      return res.status(400).json({ 
        message: "Utilisateur non trouvé. Veuillez d'abord créer un compte." 
      });
    }

    // ✅ Vérifier si ce numéro de téléphone est déjà utilisé par un autre utilisateur
    const existingPhone = await User.findOne({ 
      where: { 
        phone,
        email: { [require('sequelize').Op.ne]: email } // Exclure l'utilisateur actuel
      } 
    });

    if (existingPhone) {
      return res.status(400).json({ message: "Ce numéro de téléphone est déjà utilisé par un autre compte." });
    }

    // ✅ Vérifier si l'utilisateur actuel a déjà un téléphone vérifié
    if (user.isPhoneVerified && user.phone === phone) {
      return res.status(400).json({ 
        message: "Ce numéro de téléphone est déjà vérifié pour votre compte." 
      });
    }

    // ✅ Mettre à jour les informations de l'utilisateur
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await user.update({
      phone: phone,
      country: countryData.name,
      countryCode: countryData.countryCode,
      phoneVerificationExpires: expiresAt,
      isPhoneVerified: false // Reset la vérification si nouveau numéro
    });

    // ✅ Envoyer le code de vérification
    await sendWhatsAppVerification(phone);

    logger.info(`📱 Code de vérification envoyé à ${phone} pour l'utilisateur ${email}`);
    
    res.json({ message: "Code de vérification envoyé par SMS !" });

  } catch (error) {
    logger.error("❌ Erreur dans /verify:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post("/confirm", async (req, res) => {
  try {
    const { phone, code } = req.body;

    // ✅ Validation des champs
    if (!phone || !code) {
      return res.status(400).json({
        message: "Le numéro de téléphone et le code sont requis.",
      });
    }

    // ✅ Chercher l'utilisateur par téléphone
    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(400).json({ message: "Aucun utilisateur trouvé avec ce numéro." });
    }

    // ✅ Vérifier si le téléphone est déjà vérifié
    if (user.isPhoneVerified) {
      return res.status(400).json({ 
        message: "Ce numéro de téléphone est déjà vérifié." 
      });
    }

    // ✅ Vérifier l'expiration du code
    if (user.phoneVerificationExpires && user.phoneVerificationExpires < new Date()) {
      return res.status(400).json({ 
        message: "Code expiré. Veuillez en demander un nouveau." 
      });
    }

    // ✅ Vérifier le code avec Twilio
    const isVerified = await verifyWhatsAppCode(phone, code);
    
    if (!isVerified) {
      return res.status(400).json({ message: "Code invalide ou expiré." });
    }

    // ✅ Marquer le téléphone comme vérifié
    await user.update({
      isPhoneVerified: true,
      phoneVerificationExpires: null
    });

    logger.info(`✅ Téléphone ${phone} vérifié avec succès pour l'utilisateur ${user.email}`);
    
    res.json({ message: "Téléphone vérifié avec succès !" });

  } catch (error) {
    logger.error("❌ Erreur dans /confirm:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;