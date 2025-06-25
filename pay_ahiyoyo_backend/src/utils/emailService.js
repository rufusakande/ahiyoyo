const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Serveur SMTP
  port: process.env.SMTP_PORT, // Port SMTP sécurisé (SSL)
  secure: true, // true pour SSL, false pour TLS (port 587)
  auth: {
    user: process.env.EMAIL_USER, // Adresse de l'expéditeur
    pass: process.env.EMAIL_PASS, // Mot de passe SMTP
  },
});

/**
 * ✉️ Envoie un email à l'admin pour l'informer d'une vérification en attente.
 */
const sendAdminNotification = async (adminEmail, userEmail) => {
  const mailOptions = {
    from: '"Pay Ahiyoyo" <no-reply@ahiyoyo.com>',
    to: adminEmail,
    subject: "⚠️ Vérification utilisateur requise",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px; border-radius: 10px; color: #333;">
        <h2 style="color: #d9534f;">🔍 Vérification d'utilisateur requise</h2>
        <p>Bonjour Admin,</p>
        <p>L'utilisateur <strong>${userEmail}</strong> vient de s'inscrire et son profil nécessite une vérification.</p>
        <p>Merci de procéder à la vérification dès que possible.</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Ahiyoyo - Tous droits réservés.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à l'admin (${adminEmail})`);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email à l'admin :", error);
  }
};

/**
 * ✉️ Envoie un email à l'utilisateur pour lui notifier que son profil est en cours de vérification.
 */
const sendUserVerificationPendingEmail = async (userEmail) => {
  const mailOptions = {
    from: '"Pay Ahiyoyo" <no-reply@ahiyoyo.com>',
    to: userEmail,
    subject: "📩 Vérification de votre compte en cours",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #fff; padding: 20px; border-radius: 10px; color: #333;">
        <h2 style="color: #337ab7;">🔎 Votre profil est en cours de vérification</h2>
        <p>Bonjour,</p>
        <p>Merci de vous être inscrit sur Ahiyoyo. Votre profil est actuellement en cours de vérification.</p>
        <p>Cela peut prendre jusqu'à <strong>48 heures</strong>. Vous recevrez un email dès que la validation sera complétée.</p>
        <p>Merci de votre patience !</p>
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} Ahiyoyo - Tous droits réservés.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de vérification en attente envoyé à ${userEmail}`);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email à l'utilisateur :", error);
  }
};

/**
 * ✉️ Envoie un email OTP avec un beau design pour vérifier l'adresse e-mail.
 */
const sendVerificationEmail = async (userEmail, otpCode) => {
  const mailOptions = {
    from: '"Pay Ahiyoyo" <no-reply@ahiyoyo.com>',
    to: userEmail,
    subject: "🔐 Vérification de votre e-mail",
    replyTo: "no-reply@ahiyoyo.com",
    headers: {
      "X-No-Reply": "true",
    },
    html: `
      <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
        <div style="text-align: center; padding: 10px 0;">
          <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
        </div>
        <div style="background: #fdc354; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">
          🔐 Votre code de vérification
        </div>
        <div style="padding: 20px; text-align: center;">
          <p style="font-size: 16px;">Bonjour,</p>
          <p style="font-size: 16px;">Utilisez le code OTP ci-dessous pour vérifier votre adresse e-mail :</p>
          <p style="font-size: 24px; font-weight: bold; color: #fdc354; background: #222; padding: 10px; border-radius: 5px; display: inline-block;">
            ${otpCode}
          </p>
          <p style="font-size: 14px; color: #aaa;">Ce code est valable pendant 10 minutes.</p>
        </div>
        <div style="text-align: center; font-size: 12px; color: #ccc; padding-top: 10px;">
          <p>Si vous n'avez pas demandé ce code, ignorez cet e-mail.</p>
          <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP envoyé avec succès à ${userEmail}`);
  } catch (error) {
    console.error("❌ Erreur d'envoi d'email OTP :", error);
  }
};

module.exports = { sendAdminNotification, sendUserVerificationPendingEmail, sendVerificationEmail };
