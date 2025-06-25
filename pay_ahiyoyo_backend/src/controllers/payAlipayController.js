const PayAlipay = require('../models/PayAlipay');
const User = require('../models/User');
const FeexpayClass = require('../services/FeexpayClass');
const { isValidFileType } = require('../utils/fileValidator');
require('dotenv').config();

const feexpay = new FeexpayClass();

/**
 * @swagger
 * /api/pay-alipay:
 *   post:
 *     summary: Créer un paiement Alipay
 *     description: Enregistre un paiement Alipay pour l'utilisateur connecté.
 *     tags: [Transactions]
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
 *               - amountXOF
 *               - amountRMB
 *               - exchangeRate
 *               - paymentNetwork
 *               - paymentNumber
 *               - alipayQRCode
 *               - document
 *             properties:
 *               amountXOF:
 *                 type: number
 *                 format: float
 *                 example: 50000
 *               amountRMB:
 *                 type: number
 *                 format: float
 *                 example: 600
 *               exchangeRate:
 *                 type: number
 *                 format: float
 *                 example: 83.33
 *               paymentNetwork:
 *                 type: string
 *                 example: "mtn"
 *               paymentNumber:
 *                 type: string
 *                 example: "123456789"
 *               alipayQRCode:
 *                 type: string
 *                 example: "https://example.com/qrcode.png"
 *               reason:
 *                 type: string
 *                 example: "Paiement pour service"
 *               document:
 *                 type: string
 *                 example: "facture.pdf"
 *     responses:
 *       201:
 *         description: Paiement créé avec succès.
 *       400:
 *         description: Erreur dans la requête.
 *       500:
 *         description: Erreur serveur.
 */
const createPayAlipay = async (req, res) => {
  try {
    // Récupérer l'utilisateur connecté depuis `req.user`
    const { userId, firstName, lastName, email } = req.user.userData;
    const description ="Pay Alipay AHIYOYO";
    const {
      amountXOF,
      amountRMB,
      exchangeRate,
      paymentNetwork,
      paymentNumber,
      alipayQRCode,
      reason,
      document
    } = req.body;

    // Vérifier si les fichiers sont valides
    if (!document || !isValidFileType(document)) {
      return res.status(400).json({
        success: false,
        message: 'Reason must be a valid file type (PDF, Word, PNG, or JPEG)'
      });
    }

    // Vérification des champs obligatoires
    if (!amountXOF || !amountRMB || !exchangeRate || !paymentNetwork || !paymentNumber || !alipayQRCode || !document) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    // Création du paiement
    const newPayment = await PayAlipay.create({
      userId,
      firstName,
      lastName,
      email,
      amountXOF,
      amountRMB,
      exchangeRate,
      paymentNetwork,
      paymentNumber,
      alipayQRCode,
      reason,
      document
    });
    try {
      // Initialiser le paiement mobile money avec Feexpay
      const mobilePayment = await feexpay.paiementLocal(
        amountXOF,
        paymentNumber,
        paymentNetwork.toUpperCase(), // Convertir en majuscules pour correspondre au format attendu
        `${firstName} ${lastName}`,
        email,
        JSON.stringify({ paymentId: newPayment.id }), // Ajouter des informations de callback
        description,
        newPayment.id // Utiliser l'ID du paiement comme référence personnalisée
      );

      // Mettre à jour le paiement avec la référence Feexpay
      await newPayment.update({
        AgrePayReference: mobilePayment,
        AgreType: "FEEXPAY"
      });

      // Vérifier le statut initial du paiement
      const paymentStatus = await feexpay.getPaiementStatus(mobilePayment);
console.log(mobilePayment);
      return res.status(201).json({
        message: "Paiement initié avec succès.",
        data: {
          ...newPayment.toJSON(),
          feexpayStatus: paymentStatus.status
        }
      });

    } catch (paymentError) {
      // En cas d'erreur avec Feexpay, mettre à jour le statut du paiement
      await newPayment.update({
        status: 'FAILED',
        errorMessage: paymentError.message
      });

      throw paymentError; // Relancer l'erreur pour la gestion globale
    }

    return res.status(201).json({ message: "Paiement créé avec succès.", data: newPayment });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

/**
 * @swagger
 * /api/pay-alipay/history:
 *   get:
 *     summary: Obtenir l'historique des paiements Alipay d'un utilisateur
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *       - WordPressToken: []
 *     responses:
 *       200:
 *         description: Historique récupéré avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Historique des paiements récupéré."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PayAlipay'
 *       400:
 *         description: Paramètre `userId` manquant.
 *       500:
 *         description: Erreur serveur.
 */
const getPayAlipayHistory = async (req, res) => {
  try {
    const { userId } = req.user.userData;

    if (!userId) {
      return res.status(400).json({ message: "L'identifiant utilisateur est requis." });
    }

    const payments = await PayAlipay.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ message: "Historique des paiements récupéré.", data: payments });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur.", error: error.message });
  }
};

module.exports = {
  createPayAlipay,
  getPayAlipayHistory,
};
