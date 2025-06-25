const nodemailer = require('nodemailer');
require('dotenv').config();
const logger = require("../utils/logger");

// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true pour 465, false pour 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * ✉️ Envoie un email OTP avec un beau design pour vérifier l'adresse e-mail.
 */
const sendVerificationEmail = async (to, code) => {
    try {
        const mailOptions = {
            from: `"Ahiyoyo Auth" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: "Vérification de votre compte Ahiyoyo",
            text: `Votre code de vérification est : ${code}`,
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
                  ${code}
                </p>
                <p style="font-size: 14px; color: #aaa;">Ce code est valable pendant 10 minutes.</p>
              </div>
              <div style="text-align: center; font-size: 12px; color: #ccc; padding-top: 10px;">
                <p>Si vous n'avez pas demandé ce code, ignorez cet e-mail.</p>
                <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
              </div>
            </div>
          ` };

        await transporter.sendMail(mailOptions);
        logger.info(`📧 Email envoyé à ${to} voici le code${code}`);
    } catch (error) {
        logger.error("❌ Erreur lors de l'envoi de l'email :", error);
    }
};

/**
 * Envoi d'un email de notification de connexion
 * @param {string} email - Adresse email du destinataire
 * @param {string} ip - Adresse IP de connexion
 * @param {object} location - Objet contenant les infos de localisation
 * @param {string} deviceInfo - Infos sur l'appareil utilisé
 */
const sendLoginNotification = async (email, ip, location, deviceInfo) => {
  try {
      const mailOptions = {
          from: `"Ahiyoyo Sécurité" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "⚠️ Nouvelle Connexion à votre compte Ahiyoyo",
          html: `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
              <div style="text-align: center; padding: 10px;">
                  <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
              </div>
              <div style="background: #fdc354; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: black;">
                  ⚠️ Nouvelle Connexion Détectée
              </div>
              <div style="padding: 20px; text-align: left; background: #111; border-radius: 10px; margin-top: 10px;">
                  <p style="font-size: 16px;">Bonjour,</p>
                  <p>Une nouvelle connexion a été détectée sur votre compte :</p>
                  <ul style="font-size: 16px; padding-left: 20px;">
                      <li><strong>📍 Localisation :</strong> ${location.city}, ${location.region}, ${location.country}</li>
                      <li><strong>🌍 Adresse IP :</strong> ${ip}</li>
                      <li><strong>🖥️ Appareil :</strong> ${deviceInfo}</li>
                      <li><strong>🕒 Date :</strong> ${new Date().toLocaleString()}</li>
                  </ul>
                  <p style="text-align: center; margin-top: 20px;">
                      <a href="https://ahiyoyo.com/reset-password" style="background: #fdc354; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                          🔒 Changer mon mot de passe
                      </a>
                  </p>
              </div>
              <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 10px;">
                  <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
              </div>
          </div>
          `
      };

      await transporter.sendMail(mailOptions);
      logger.info("✅ E-mail de connexion envoyé à", email);
  } catch (error) {
      logger.error("❌ Erreur envoi email connexion :", error);
  }
};



const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
      from: `"Ahiyoyo Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Réinitialisation de votre mot de passe",
      html: `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
              <div style="text-align: center; padding: 10px;">
                  <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
              </div>
              <div style="background: #fdc354; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: black;">
                  🔑 Réinitialisation de Mot de Passe
              </div>
              <div style="padding: 20px; text-align: center; background: #111; border-radius: 10px; margin-top: 10px;">
                  <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                  <p>
                      <a href="${resetLink}" style="background: #fdc354; color: black; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold;">
                          🔄 Réinitialiser mon mot de passe
                      </a>
                  </p>
                  <p>Ce lien est valable 1 heure.</p>
              </div>
              <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 10px;">
                  <p>Si vous n'avez pas demandé ce changement, ignorez cet e-mail.</p>
                  <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
              </div>
          </div>
      `
  };

  await transporter.sendMail(mailOptions);
};

// ✅ Fonction sendPasswordResetEmail corrigée pour accepter 3 paramètres
const sendPasswordResetEmail = async (email, resetToken, resetCode) => {
  try {
    // URL de réinitialisation (adapte selon ton frontend)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"Ahiyoyo Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Réinitialisation de votre mot de passe',
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px; margin-bottom: 10px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Réinitialisation de mot de passe</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Bonjour,</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        transition: transform 0.2s;">
                🔓 Réinitialiser mon mot de passe
              </a>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">💡 Code de vérification (alternative)</h3>
              <p style="margin-bottom: 10px;">Si le lien ne fonctionne pas, utilisez ce code :</p>
              <div style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #333;">
                ${resetCode}
              </div>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                ⚠️ <strong>Important :</strong> Ce lien est valide pendant <strong>15 minutes</strong> seulement.
              </p>
            </div>

            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border: 1px solid #f5c6cb; margin: 20px 0;">
              <p style="margin: 0; color: #721c24;">
                🛡️ <strong>Sécurité :</strong> Si vous n'avez pas demandé cette réinitialisation, ignorez ce message. Votre compte reste sécurisé.
              </p>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666; text-align: center; margin: 0;">
              Cet email a été envoyé automatiquement, merci de ne pas y répondre.<br>
              © ${new Date().getFullYear()} Ahiyoyo - Tous droits réservés
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Réinitialisation de votre mot de passe
        
        Bonjour,
        
        Vous avez demandé la réinitialisation de votre mot de passe.
        
        Cliquez sur ce lien pour procéder : ${resetUrl}
        
        Ou utilisez ce code de vérification : ${resetCode}
        
        Ce lien est valide pendant 15 minutes seulement.
        
        Si vous n'avez pas demandé cette réinitialisation, ignorez ce message.
        
        Cordialement,
        L'équipe Ahiyoyo
      `
    };

    await transporter.sendMail(mailOptions);
    
    logger.info(`📧 Email de réinitialisation envoyé à: ${email}`);
    return true;

  } catch (error) {
    logger.error('❌ Erreur envoi email réinitialisation:', error);
    throw error;
  }
};

// ✅ NOUVELLE FONCTION : Email de confirmation de changement de mot de passe
const sendPasswordChangeConfirmation = async (email) => {
  try {
    const mailOptions = {
      from: `"Ahiyoyo Sécurité" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Votre mot de passe a été modifié',
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
          <div style="text-align: center; padding: 10px;">
            <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
          </div>
          
          <div style="background: #28a745; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: white;">
            ✅ Mot de passe modifié avec succès
          </div>
          
          <div style="padding: 20px; text-align: left; background: #111; border-radius: 10px; margin-top: 10px;">
            <p style="font-size: 16px;">Bonjour,</p>
            
            <p style="font-size: 16px;">
              Votre mot de passe vient d'être modifié avec succès.
            </p>
            
            <div style="background: #1a5f3f; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>📅 Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                <li><strong>📧 Compte :</strong> ${email}</li>
                <li><strong>🔒 Action :</strong> Réinitialisation de mot de passe</li>
              </ul>
            </div>
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #721c24;">
                🚨 <strong>Si ce n'était pas vous :</strong> Contactez immédiatement notre support à support@ahiyoyo.com
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ahiyoyo.com/login" 
                 style="background: #28a745; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        font-weight: bold;
                        display: inline-block;">
                🔐 Se connecter maintenant
              </a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 15px;">
            <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Email de confirmation changement mot de passe envoyé à ${email}`);
    return true;
  } catch (error) {
    logger.error("❌ Erreur envoi email confirmation :", error);
    throw error;
  }
};

/**
 * ✅ Envoie un email de confirmation lorsqu'une demande d'identité est approuvée
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} userIdentifier - Identifiant de l'utilisateur
 * @param {string} adminNote - Note optionnelle de l'admin
 */
const sendApprovalNotification = async (email, userIdentifier, adminNote = null) => {
  try {
    const mailOptions = {
      from: `"Ahiyoyo Vérification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Votre demande d'identité a été approuvée",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
          <div style="text-align: center; padding: 10px;">
            <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
          </div>
          
          <div style="background: #28a745; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: white;">
            ✅ Demande d'Identité Approuvée
          </div>
          
          <div style="padding: 20px; text-align: left; background: #111; border-radius: 10px; margin-top: 10px;">
            <p style="font-size: 16px;">Bonjour <strong>${userIdentifier}</strong>,</p>
            
            <p style="font-size: 16px; color: #28a745;">
              🎉 <strong>Excellente nouvelle !</strong> Votre demande de vérification d'identité a été approuvée avec succès.
            </p>
            
            <div style="background: #1a5f3f; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #28a745;">📋 Détails de l'approbation</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Status :</strong> <span style="color: #28a745;">Vérifié ✓</span></li>
                <li><strong>Date de validation :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                <li><strong>Compte :</strong> ${userIdentifier}</li>
              </ul>
              ${adminNote ? `
                <div style="background: #333; padding: 10px; border-radius: 5px; margin-top: 15px;">
                  <p style="margin: 0; font-size: 14px; color: #fdc354;"><strong>📝 Note de l'équipe :</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">${adminNote}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="background: #1a4b5f; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fdc354;">
              <h3 style="margin-top: 0; color: #fdc354;">🔓 Accès débloqué</h3>
              <p style="margin: 0; font-size: 14px;">
                Votre compte est maintenant entièrement vérifié. Vous avez désormais accès à toutes les fonctionnalités de la plateforme Ahiyoyo.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ahiyoyo.com/dashboard" 
                 style="background: #28a745; 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        font-weight: bold;
                        display: inline-block;">
                🚀 Accéder à mon compte
              </a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 15px;">
            <p>Merci de votre confiance !</p>
            <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`✅ Email d'approbation envoyé à ${email} pour l'utilisateur ${userIdentifier}`);
    return true;
  } catch (error) {
    logger.error("❌ Erreur envoi email d'approbation :", error);
    throw error;
  }
};

/**
 * ❌ Envoie un email de rejet lorsqu'une demande d'identité est rejetée
 * @param {string} email - Adresse email de l'utilisateur
 * @param {string} userIdentifier - Identifiant de l'utilisateur
 * @param {string} rejectionReason - Raison du rejet
 * @param {string} adminNote - Note optionnelle de l'admin
 */
const sendRejectionNotification = async (email, userIdentifier, rejectionReason, adminNote = null) => {
  try {
    const mailOptions = {
      from: `"Ahiyoyo Vérification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "❌ Votre demande d'identité nécessite une correction",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #000; padding: 20px; border-radius: 10px; color: white;">
          <div style="text-align: center; padding: 10px;">
            <img src="https://ahiyoyo.com/wp-content/uploads/2022/04/ahiyoyo-3.png" alt="Ahiyoyo Logo" style="max-width: 180px;">
          </div>
          
          <div style="background: #dc3545; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold; color: white;">
            ❌ Demande d'Identité en Attente de Correction
          </div>
          
          <div style="padding: 20px; text-align: left; background: #111; border-radius: 10px; margin-top: 10px;">
            <p style="font-size: 16px;">Bonjour <strong>${userIdentifier}</strong>,</p>
            
            <p style="font-size: 16px;">
              Nous avons examiné votre demande de vérification d'identité, mais nous ne pouvons pas l'approuver dans l'état actuel.
            </p>
            
            <div style="background: #5f1a1a; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3 style="margin-top: 0; color: #dc3545;">🔍 Raison du rejet</h3>
              <div style="background: #333; padding: 15px; border-radius: 5px;">
                <p style="margin: 0; font-size: 16px; color: #ff6b6b; font-weight: bold;">
                  ${rejectionReason}
                </p>
              </div>
              ${adminNote ? `
                <div style="background: #2a2a2a; padding: 10px; border-radius: 5px; margin-top: 15px;">
                  <p style="margin: 0; font-size: 14px; color: #fdc354;"><strong>📝 Note de l'équipe :</strong></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">${adminNote}</p>
                </div>
              ` : ''}
            </div>
            
            <div style="background: #1a4b5f; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #fdc354;">
              <h3 style="margin-top: 0; color: #fdc354;">🔄 Prochaines étapes</h3>
              <ol style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
                <li>Consultez la raison du rejet ci-dessus</li>
                <li>Préparez un nouveau document conforme aux exigences</li>
                <li>Soumettez votre nouvelle demande via votre espace personnel</li>
                <li>Notre équipe l'examinera dans les plus brefs délais</li>
              </ol>
            </div>
            
            <div style="background: #2d5a3d; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <h3 style="margin-top: 0; color: #28a745;">💡 Conseils pour votre prochaine soumission</h3>
              <ul style="margin: 10px 0; padding-left: 20px; font-size: 14px;">
                <li>Assurez-vous que le document soit lisible et de bonne qualité</li>
                <li>Vérifiez que toutes les informations sont visibles</li>
                <li>Utilisez un éclairage approprié lors de la prise de photo</li>
                <li>Le document doit être valide et non expiré</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ahiyoyo.com/verification" 
                 style="background: #fdc354; 
                        color: black; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-size: 16px; 
                        font-weight: bold;
                        display: inline-block;">
                📤 Soumettre un nouveau document
              </a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #aaa; padding-top: 15px;">
            <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
            <p>&copy; ${new Date().getFullYear()} Ahiyoyo. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    logger.info(`❌ Email de rejet envoyé à ${email} pour l'utilisateur ${userIdentifier}. Raison: ${rejectionReason}`);
    return true;
  } catch (error) {
    logger.error("❌ Erreur envoi email de rejet :", error);
    throw error;
  }
};

module.exports = {sendVerificationEmail, sendLoginNotification, sendResetPasswordEmail, sendPasswordResetEmail, sendPasswordChangeConfirmation, sendApprovalNotification, sendRejectionNotification};