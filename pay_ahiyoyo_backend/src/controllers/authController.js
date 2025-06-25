const axios = require('axios');
const jwt = require('jsonwebtoken');
const { WP_URL, JWT_SECRET } = require('../config/config');
const User = require("../models/User");
const { sendOTP, verifyOTP } = require("../utils/otpService");


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentifier l'utilisateur avec les informations d'identification du site Ahiyoyo.com
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nom d'utilisateur ou e-mail ahiyoyo.com
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appToken:
 *                   type: string
 *                   description: Jeton JWT pour l'authentification API
 *                 wordpressToken:
 *                   type: string
 *                   description: Jeton JWT WordPress
 *       401:
 *         description: Informations d'identification non valides
 *       500:
 *         description: Server error
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Authentification avec WordPress
        const response = await axios.post(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
            username,
            password,
        });

        // Extraction des données de l'utilisateur
        const { token, user_email, user_nicename, user_display_name } = response.data;


        // Vérifier si l'utilisateur existe dans la base locale
        let user = await User.findOne({ where: { email: user_email } });

        if (!user) {
            // Créer un nouvel utilisateur
            user = await User.create({
                email: user_email,
                isVerified: false,
            });

            // Envoyer un OTP à l'utilisateur
            const otpResult = await sendOTP(user_email);
            if (!otpResult.success) {
                return res.status(500).json({ message: otpResult.message });
            }
            return res.json({
                message: "Un code OTP a été envoyé à votre e-mail.",
                // wordpressToken: token,
            });
        }

        // Vérifier si l'utilisateur a validé son email son email avec un OTP
        if (!user.isVerified) {
            const otpResult = await sendOTP(user_email);
            if (!otpResult.success) {
                return res.status(500).json({ message: otpResult.message });
            }

            return res.status(403).json({
                message: "Veuillez vérifier votre e-mail avant de continuer. Un nouvel OTP a été envoyé.",
            });
        }

        // Générer le jeton JWT pour l'API
        const appToken = jwt.sign({ username, email: user_email }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            appToken,
            wordpressToken: token,
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        res.status(401).json({
            message: "Informations d'identification non valides",
            error: error.response?.data?.message || "Erreur d'authentification",
        });
    }
};

// /**
//  * @swagger
//  * /api/auth/verify-email:
//  *   get:
//  *     summary: Vérifier l'e-mail après inscription
//  *     tags: [Authentication]
//  *     parameters:
//  *       - in: query
//  *         name: token
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Jeton de vérification envoyé par e-mail
//  *     responses:
//  *       200:
//  *         description: E-mail vérifié avec succès
//  *       400:
//  *         description: Lien invalide ou expiré
//  *       500:
//  *         description: Erreur interne du serveur
//  */
// const verifyEmail = async (req, res) => {
//     try {
//         const { token } = req.query;

//         const user = await User.findOne({ where: { emailVerificationToken: token } });

//         if (!user) {
//             return res.status(400).json({ message: "Lien de vérification invalide ou expiré." });
//         }

//         // Valider l'e-mail et supprimer le token
//         await user.update({ isEmailVerified: true, emailVerificationToken: null });

//         res.json({ message: "E-mail vérifié avec succès !" });
//     } catch (error) {
//         console.error("Erreur lors de la validation de l'e-mail:", error);
//         res.status(500).json({ message: "Erreur lors de la validation de l'e-mail" });
//     }
// };

module.exports = { login };
