// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {sendVerificationEmail, sendLoginNotification } = require('../services/emailService');
const sendWhatsAppCode = require('../services/whatsappService');
const { sendWhatsAppVerification, verifyWhatsAppCode } = require("../services/twilioService");
const { upload } = require('../services/fileService');  // Importer le service d'upload
const axios = require("axios");
const useragent = require("useragent");


require('dotenv').config();

const router = express.Router();



// Inscription
router.post('/register', async (req, res) => {
    try {
        console.log("🟢 Inscription en cours :", req.body);
        const { email, phone, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) return res.status(400).json({ message: "Email déjà utilisé." });

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Générer un code de vérification email
        const emailVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Créer l'utilisateur
        const user = await User.create({ 
            email, 
            phone, 
            password: hashedPassword,
            emailVerificationCode
        });

        // Envoyer le mail de vérification immédiatement
        await sendVerificationEmail(email, emailVerificationCode);

        res.status(201).json({ 
            message: "Inscription réussie ! Code de vérification email envoyé.", 
            userId: user.id 
        });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });
        if (!user.isEmailVerified) return res.status(400).json({ message: "Veuillez vérifier votre email avant de vous connecter." });
        if (!user.isPhoneVerified) return res.status(400).json({ message: "Veuillez vérifier votre téléphone avant de vous connecter." });
        if (!user.isIdentityVerified) {
            if (user.isDocumentSubmitted) {
                return res.status(400).json({ message: "Votre document est soumis et en attente de vérification." });
            }
            return res.status(400).json({ message: "Veuillez vérifier votre identité avant de vous connecter." });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });

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
            console.error("🌍 Erreur récupération localisation IP :", geoError);
        }

        // 📧 Envoyer email de connexion
        await sendLoginNotification(email, ip, location, deviceInfo);

        res.json({ message: "Connexion réussie !", token });
    } catch (error) {
        console.error("❌ Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});



// verify-email
router.post('/verify-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.emailVerificationCode = verificationCode;
        await user.save();

        
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email déjà vérifié." });
        }

        // Envoi du mail
        await sendVerificationEmail(email, verificationCode);

        res.json({ message: "Code de vérification envoyé !" });
    } catch (error) {
        console.error("❌ Erreur vérification email:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//confirm-email
router.post('/confirm-email', async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        if (user.emailVerificationCode !== code && !user.isEmailVerified) {
            return res.status(400).json({ message: "Code invalide." });
        } 
        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email déjà vérifié." });
        }

        // Marquer l'email comme vérifié
        user.isEmailVerified = true;
        user.emailVerificationCode = null;
        await user.save();

        res.json({ message: "Email vérifié avec succès !" });

    } catch (error) {
        console.error("❌ Erreur confirmation email:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//verify-phone
router.post("/verify-phone", async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ where: { phone } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });
        if (!user.isEmailVerified) return res.status(400).json({ message: "Veuillez vérifier votre email d'abord." });

        if (user.isPhoneVerified) {
            return res.status(400).json({ message: "Téléphone déjà vérifié." });
        }

        await sendWhatsAppVerification(phone);

        res.json({ message: "Code WhatsApp envoyé !" });
    } catch (error) {
        console.error("❌ Erreur envoi WhatsApp:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


//confirm-phone
router.post("/confirm-phone", async (req, res) => {
    try {
        const { phone, code } = req.body;
        const user = await User.findOne({ where: { phone } });

        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

        if (user.isPhoneVerified) {
            return res.status(400).json({ message: "Téléphone déjà vérifié." });
        }

        const isVerified = await verifyWhatsAppCode(phone, code);
        if (!isVerified) return res.status(400).json({ message: "Code invalide ou expiré." });

        user.isPhoneVerified = true;
        await user.save();

        res.json({ message: "Téléphone vérifié avec succès !" });
    } catch (error) {
        console.error("❌ Erreur vérification WhatsApp:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});



// Route pour uploader un fichier
router.post('/upload-identity', upload.single('document'), async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }

        if (!user.isEmailVerified || !user.isPhoneVerified) {
            return res.status(400).json({ message: "Veuillez vérifier votre email et votre téléphone avant d'envoyer un document." });
        }

        if (user.isIdentityVerified) {
            return res.status(400).json({ message: "Votre identité a déjà été vérifiée." });
        }

        if (user.isDocumentSubmitted) {
            return res.status(400).json({ message: "Votre document a déjà été soumis." });
        }

        // Vérifiez si un fichier a bien été envoyé
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier n'a été envoyé." });
        }

        // Sauvegarder le document
        user.isDocumentSubmitted = true;
        user.identityDocument = req.file.path;  // Le chemin du fichier téléchargé
        await user.save();

        res.json({ message: "Document soumis avec succès !" });
    } catch (error) {
        console.error("❌ Erreur upload document:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;
