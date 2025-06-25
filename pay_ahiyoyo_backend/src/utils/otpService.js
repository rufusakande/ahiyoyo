const crypto = require("crypto");
const User = require("../models/User");
const { sendVerificationEmail } = require("./emailService");

/**
 * Génère un OTP de 6 chiffres
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Envoie un OTP à l'utilisateur
 */
const sendOTP = async (email) => {
    try {
        const otpCode = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expire après 10 min

        // Met à jour l'utilisateur avec le nouvel OTP
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return { success: false, message: "Utilisateur non trouvé" };
        }

        await user.update({ otpCode, otpExpiresAt });

        // Envoi de l'email
        await sendVerificationEmail(email, otpCode);

        return { success: true, message: "OTP envoyé avec succès !" };
    } catch (error) {
        console.error("Erreur OTP:", error);
        return { success: false, message: "Erreur lors de l'envoi de l'OTP" };
    }
};

/**
 * Vérifie si l'OTP est valide
 */
const verifyOTP = async (email, otp) => {
    try {
        const user = await User.findOne({ where: { email } });

        if (!user || user.otpCode !== otp) {
            return { success: false, message: "OTP invalide" };
        }

        if (new Date() > user.otpExpiresAt) {
            return { success: false, message: "OTP expiré" };
        }

        // Marquer l'utilisateur comme vérifié
        await user.update({ isVerified: true, otpCode: null, otpExpiresAt: null });

        return { success: true, message: "OTP vérifié avec succès !" };
    } catch (error) {
        console.error("Erreur vérification OTP:", error);
        return { success: false, message: "Erreur lors de la vérification de l'OTP" };
    }
};

module.exports = { sendOTP, verifyOTP };

