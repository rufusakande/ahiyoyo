const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsAppCode = async (phone, code) => {
    try {
        await client.messages.create({
            body: `Votre code de vérification est : ${code}`,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${phone}`
        });
        logger.info(`📲 Code WhatsApp envoyé à ${phone}`);
    } catch (error) {
        logger.error("❌ Erreur lors de l'envoi du code WhatsApp :", error);
    }
};

module.exports = sendWhatsAppCode;
