const twilio = require("twilio");
require("dotenv").config();
const logger = require("../utils/logger");

// ✅ Validation des variables d'environnement
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_SERVICE_SID) {
    logger.error("❌ Variables d'environnement Twilio manquantes");
    throw new Error("Configuration Twilio incomplète");
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppVerification = async (phone) => {
    try {
        // ✅ Validation du format du numéro
        if (!phone || !phone.startsWith('+')) {
            throw new Error("Format de numéro invalide. Le numéro doit commencer par +");
        }

        logger.info(`📱 Tentative d'envoi SMS à ${phone}`);

        const verification = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verifications.create({
                channel: "sms", // ✅ Utilise SMS au lieu de WhatsApp pour plus de compatibilité
                to: phone
            });

        logger.info(`✅ Code SMS envoyé à ${phone} - SID: ${verification.sid}`);
        return verification;

    } catch (error) {
        logger.error(`❌ Erreur envoi SMS à ${phone}:`, {
            message: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
        throw new Error(`Impossible d'envoyer le code de vérification: ${error.message}`);
    }
};

const verifyWhatsAppCode = async (phone, code) => {
    try {
        // ✅ Validation des paramètres
        if (!phone || !code) {
            throw new Error("Numéro de téléphone et code requis");
        }

        if (!phone.startsWith('+')) {
            throw new Error("Format de numéro invalide");
        }

        logger.info(`🔍 Vérification du code pour ${phone}`);

        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: phone,
                code: code.toString().trim() // ✅ S'assurer que le code est une string
            });

        logger.info(`📋 Résultat vérification pour ${phone}:`, {
            status: verificationCheck.status,
            sid: verificationCheck.sid
        });

        return verificationCheck.status === "approved";

    } catch (error) {
        logger.error(`❌ Erreur vérification code pour ${phone}:`, {
            message: error.message,
            code: error.code,
            moreInfo: error.moreInfo
        });
        return false;
    }
};

// ✅ Fonction utilitaire pour tester la configuration Twilio
const testTwilioConnection = async () => {
    try {
        const service = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).fetch();
        logger.info(`✅ Connexion Twilio OK - Service: ${service.friendlyName}`);
        return true;
    } catch (error) {
        logger.error("❌ Échec connexion Twilio:", error.message);
        return false;
    }
};

module.exports = { 
    sendWhatsAppVerification, 
    verifyWhatsAppCode,
    testTwilioConnection 
};