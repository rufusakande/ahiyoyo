const User = require("../models/User");
const { sendAdminNotification, sendUserVerificationPendingEmail } = require("../utils/emailService"); 

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtenir des informations sur le profil utilisateur
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *       - WordPressToken: []
 *     responses:
 *       200:
 *         description: Données du profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     role:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     whatsappNumber:
 *                       type: string
 *                     alipayQR:
 *                       type: string
 *                     idDocument:
 *                       type: string
 *                     isVerified:
 *                       type: boolean
 *                     profileCompleted:
 *                       type: boolean
 *                     verificationStatus:
 *                       type: string
 *                       enum: [pending, approved, rejected]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
const getProfil = async (req, res) => {
    try {
        console.log(req.user);

        const user = await User.findOne({ where: { email: req.user.userData.email } });        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
        }

        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            phoneNumber: user.phoneNumber,
            whatsappNumber: user.whatsappNumber,
            alipayQR: user.alipayQR,
            idDocument: user.idDocument,
            isVerified: user.isVerified,
            profileCompleted: user.profileCompleted,
            verificationStatus: user.verificationStatus,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.json({
            message: `Profil de ${userData.firstName} ${userData.lastName}`,
            user: userData,
        });

    } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        res.status(500).json({ success: false, message: "Erreur serveur" });
    }
};



/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     summary: Modifier uniquement les numéros de téléphone et le QR Alipay
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *       - WordPressToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - whatsappNumber
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Numéro de téléphone
 *               whatsappNumber:
 *                 type: string
 *                 description: Numéro WhatsApp
 *               alipayQR:
 *                 type: string
 *                 description: URL du QR Code Alipay (facultatif)
 *     responses:
 *       200:
 *         description: Numéros et QR Alipay mis à jour avec succès
 *       400:
 *         description: Champs obligatoires manquants
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
const updateProfil = async (req, res) => {
    const { whatsappNumber, phoneNumber, alipayQR } = req.body;

    try {
        const user = await User.findOne({ where: { email: req.user.userData.email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await user.update({whatsappNumber, phoneNumber, alipayQR  });

        res.status(200).json({ message: 'Profil mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
};

/**
 * @swagger
 * /api/profile/submit-verification:
 *   post:
 *     summary: Soumettre les documents de vérification du profil
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *       - WordPressToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - whatsappNumber
 *               - idDocument
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'utilisateur
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur
 *               phoneNumber:
 *                 type: string
 *                 description: Numéro de téléphone de l'utilisateur
 *               whatsappNumber:
 *                 type: string
 *                 description: Numéro WhatsApp de l'utilisateur
 *               alipayQR:
 *                 type: string
 *                 description: URL du QR Code Alipay (facultatif)
 *               idDocument:
 *                 type: string
 *                 description: Lien vers la pièce d'identité de l'utilisateur (obligatoire)
 *     responses:
 *       200:
 *         description: Documents soumis pour vérification avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Documents envoyés pour vérification."
 *       400:
 *         description: Champs obligatoires manquants
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Les champs phoneNumber, whatsappNumber et idDocument sont obligatoires."
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token d'authentification manquant ou invalide."
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur non trouvé"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la soumission"
 */
const submitVerification = async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, whatsappNumber, idDocument, alipayQR } = req.body;

        const user = await User.findOne({ where: { email: req.user.userData.email} });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (!firstName || !lastName || !phoneNumber || !whatsappNumber || !idDocument) {
            return res.status(400).json({ message: "Les champs phoneNumber, whatsappNumber et idDocument sont obligatoires." });
        }

        await user.update({
            firstName,
            lastName,
            phoneNumber,
            whatsappNumber,
            idDocument,
            alipayQR,
            verificationStatus: "pending",
        });
        // Envoi d'email à l'admin pour notifier qu'un utilisateur a soumis ses documents
        const adminEmail = "pay.alipay@ahiyoyo.com"; // Mets l'email réel de l'admin
        await sendAdminNotification(adminEmail, user.email);

        // Envoi d'email à l'utilisateur pour lui indiquer que son profil est en attente
        await sendUserVerificationPendingEmail(user.email);


        res.json({ message: "Documents envoyés pour vérification." });
    } catch (error) {
        console.error("Erreur soumission:", error);
        res.status(500).json({ message: "Erreur lors de la soumission" });
    }
};


module.exports = { getProfil, updateProfil, submitVerification };
