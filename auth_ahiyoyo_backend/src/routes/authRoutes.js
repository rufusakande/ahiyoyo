const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const useragent = require("useragent");
const axios = require("axios");
const {verifyToken} = require("../middlewares/verifyToken");
const {
  sendVerificationEmail,
  sendLoginNotification,
  sendPasswordResetEmail,
  sendPasswordChangeConfirmation,
} = require("../services/emailService");

const router = express.Router();
const logger = require("../utils/logger");

// Inscription
router.post("/register", async (req, res) => {
  try {
    logger.info("🟢 Inscription en cours :", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({
          message:
            "Tous les champs (email, password) sont requis.",
        });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email déjà utilisé." });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un code de vérification email
    const emailVerificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Créer l'utilisateur
    const user = await User.create({
      email,
      password: hashedPassword,
      emailVerificationCode,
      emailVerificationExpires: expiresAt,
    });

    // Envoyer le mail de vérification immédiatement
    await sendVerificationEmail(email, emailVerificationCode);

    res.status(201).json({
      message: "Inscription réussie ! Code de vérification email envoyé.",
      userId: user.userIdentifier,
    });
  } catch (error) {
    logger.error("❌ Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res.status(400).json({ message: "Utilisateur non trouvé." });
    if (!user.isEmailVerified)
      return res
        .status(400)
        .json({
          message: "Veuillez vérifier votre email avant de vous connecter.",
        });
    if (!user.isPhoneVerified)
      return res
        .status(400)
        .json({
          message: "Veuillez vérifier votre téléphone avant de vous connecter.",
        });
    if (!user.isIdentityVerified) {
      if (user.isDocumentSubmitted) {
        return res
          .status(400)
          .json({
            message: "Votre document est soumis et en attente de vérification.",
          });
      }
      return res
        .status(400)
        .json({
          message: "Veuillez vérifier votre identité avant de vous connecter.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 🔍 Récupération des métadonnées
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = useragent.parse(req.headers["user-agent"]);
    const deviceInfo = `${userAgent.toString()}`;

    // 🌍 Obtenir la localisation de l'IP
    let location = { city: "Inconnu", country: "Inconnu", region: "Inconnu" };
    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`);
      if (response.data.status === "success") {
        location = {
          city: response.data.city,
          country: response.data.country,
          region: response.data.regionName,
        };
      }
    } catch (geoError) {
      logger.error("🌍 Erreur récupération localisation IP :", geoError);
    }

    // 📧 Envoyer email de connexion
    await sendLoginNotification(email, ip, location, deviceInfo);

    res.json({
      message: "Connexion réussie !",
      token,
    });
  } catch (error) {
    logger.error("❌ Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Vérification du statut des vérifications
router.post("/verification-status", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "L'email est requis pour vérifier le statut." 
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ 
        message: "Utilisateur non trouvé." 
      });
    }

    // Retourner le statut des vérifications
    res.json({
      email: user.email,
      verificationStatus: {
        isEmailVerified: user.isEmailVerified || false,
        isPhoneVerified: user.isPhoneVerified || false,
        isIdentityVerified: user.isIdentityVerified || false,
        isDocumentSubmitted: user.isDocumentSubmitted || false,
      },
      // Messages d'aide pour l'utilisateur
      nextSteps: getNextSteps(user)
    });

  } catch (error) {
    logger.error("❌ Erreur lors de la vérification du statut :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du statut." });
  }
});

// Fonction helper pour déterminer les prochaines étapes
function getNextSteps(user) {
  const steps = [];
  
  if (!user.isEmailVerified) {
    steps.push({
      type: 'email',
      message: 'Vérifiez votre adresse email',
      action: 'verification'
    });
  } else if (!user.isPhoneVerified) {
    steps.push({
      type: 'phone',
      message: 'Vérifiez votre numéro de téléphone',
      action: 'verification'
    });
  } else if (!user.isIdentityVerified) {
    if (user.isDocumentSubmitted) {
      steps.push({
        type: 'identity',
        message: 'Votre document est en cours de vérification',
        action: 'pending-review'
      });
    } else {
      steps.push({
        type: 'identity',
        message: 'Soumettez vos documents d\'identité',
        action: 'verification'
      });
    }
  }

  return steps;
}

// Route pour vérifier si l'utilisateur est admin
router.get("/verify-admin", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Vérifier si l'utilisateur a le rôle admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Accès refusé. Privilèges administrateur requis.",
        role: user.role 
      });
    }

    // Retourner les informations de l'admin
    res.json({
      message: "Accès administrateur confirmé.",
      role: user.role,
      user: {
        id: user.id,
        email: user.email,
        userIdentifier: user.userIdentifier,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error) {
    logger.error("❌ Erreur lors de la vérification admin :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification." });
  }
});

// 📧 ÉTAPE 1 : Demander la réinitialisation du mot de passe (envoyer le code)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "L'adresse email est requise."
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return res.status(200).json({
        message: "Si cette adresse email existe dans notre système, vous recevrez un code de vérification."
      });
    }

    // Générer un code de réinitialisation à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Sauvegarder le code dans la base de données
    await user.update({
      resetPasswordToken: resetCode,
      resetPasswordExpires: resetExpires
    });

    // Envoyer l'email avec le code
    await sendPasswordResetEmail(email, null, resetCode);

    logger.info(`📧 Code de réinitialisation envoyé pour: ${email}`);

    res.status(200).json({
      message: "Si cette adresse email existe dans notre système, vous recevrez un code de vérification."
    });

  } catch (error) {
    logger.error("❌ Erreur lors de la demande de réinitialisation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔐 ÉTAPE 2 : Vérifier le code et réinitialiser le mot de passe
router.post("/reset-password", async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    // Validation des champs obligatoires
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({
        message: "L'email, le code de vérification et le nouveau mot de passe sont requis."
      });
    }

    // Validation basique du mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères."
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ 
      where: { email } 
    });

    if (!user) {
      return res.status(400).json({
        message: "Email ou code de vérification incorrect."
      });
    }

    // Vérifier que le code existe et n'a pas expiré
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({
        message: "Aucune demande de réinitialisation en cours. Veuillez faire une nouvelle demande."
      });
    }

    // Vérifier l'expiration
    if (new Date() > user.resetPasswordExpires) {
      // Nettoyer les champs expirés
      await user.update({
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      
      return res.status(400).json({
        message: "Le code de vérification a expiré. Veuillez faire une nouvelle demande."
      });
    }

    // Vérifier le code
    if (user.resetPasswordToken !== resetCode) {
      return res.status(400).json({
        message: "Code de vérification incorrect."
      });
    }

    // Vérifier que le nouveau mot de passe n'est pas identique à l'ancien
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être différent de l'ancien."
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Mettre à jour le mot de passe et supprimer les codes de réinitialisation
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      updatedAt: new Date()
    });

    logger.info(`✅ Mot de passe réinitialisé avec succès pour: ${user.email}`);

    // Envoyer un email de confirmation
    try {
      await sendPasswordChangeConfirmation(user.email);
    } catch (emailError) {
      logger.error("❌ Erreur envoi email confirmation:", emailError);
      // On continue même si l'email échoue
    }

    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."
    });

  } catch (error) {
    logger.error("❌ Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 🔄 ÉTAPE 3 : Renvoyer un nouveau code (si l'ancien a expiré ou est perdu)
router.post("/resend-reset-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "L'adresse email est requise."
      });
    }

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(200).json({
        message: "Si cette adresse email existe dans notre système, vous recevrez un nouveau code."
      });
    }

    // Générer un nouveau code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Mettre à jour en base
    await user.update({
      resetPasswordToken: resetCode,
      resetPasswordExpires: resetExpires
    });

    // Envoyer le nouveau code
    await sendPasswordResetEmail(email, null, resetCode);

    logger.info(`🔄 Nouveau code de réinitialisation envoyé pour: ${email}`);

    res.status(200).json({
      message: "Un nouveau code de vérification a été envoyé."
    });

  } catch (error) {
    logger.error("❌ Erreur lors du renvoi du code :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📋 ROUTE POUR UTILISATEUR CONNECTÉ : Changer le mot de passe
router.post("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validation des champs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Le mot de passe actuel et le nouveau mot de passe sont requis."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit contenir au moins 8 caractères."
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: "Utilisateur non trouvé."
      });
    }

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Le mot de passe actuel est incorrect."
      });
    }

    // Vérifier que le nouveau mot de passe est différent
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "Le nouveau mot de passe doit être différent de l'ancien."
      });
    }

    // Hasher et sauvegarder le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await user.update({
      password: hashedPassword,
      updatedAt: new Date()
    });

    logger.info(`🔐 Mot de passe changé avec succès pour: ${user.email}`);

    // Envoyer un email de confirmation
    try {
      await sendPasswordChangeConfirmation(user.email);
    } catch (emailError) {
      logger.error("❌ Erreur envoi email confirmation:", emailError);
    }

    res.status(200).json({
      message: "Mot de passe modifié avec succès."
    });

  } catch (error) {
    logger.error("❌ Erreur lors du changement de mot de passe :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;