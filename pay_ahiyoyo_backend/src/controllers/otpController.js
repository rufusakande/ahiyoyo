const User = require("../models/User");
const { sendOTP, verifyOTP } = require("../utils/otpService");

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Envoie un OTP par e-mail
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'e-mail de l'utilisateur
 *     responses:
 *       200:
 *         description: OTP envoyé avec succès
 *       400:
 *         description: Utilisateur déjà vérifié
 */
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // ❌ Empêcher l'envoi si l'utilisateur est déjà vérifié
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "L'utilisateur est déjà vérifié." });
    }

    // ✅ Envoyer un OTP
    const result = await sendOTP(email);
    res.status(result.success ? 200 : 400).json(result);
    
  } catch (error) {
    console.error("Erreur d'envoi d'OTP :", error);
    res.status(500).json({ success: false, message: "Erreur lors de l'envoi de l'OTP" });
  }
};
/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Vérifie un OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'e-mail de l'utilisateur
 *               otp:
 *                 type: string
 *                 description: Le code OTP reçu par e-mail
 *     responses:
 *       200:
 *         description: OTP vérifié avec succès
 *       400:
 *         description: OTP invalide ou expiré
 */
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // ❌ Empêcher la validation si l'utilisateur est déjà vérifié
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "L'utilisateur est déjà vérifié." });
    }

    // ✅ Vérifier l'OTP
    const result = await verifyOTP(email, otp);

    // Si l'OTP est valide, marquer l'utilisateur comme vérifié
    if (result.success) {
      await user.update({ isVerified: true });
    }

    res.status(result.success ? 200 : 400).json(result);
    
  } catch (error) {
    console.error("Erreur de vérification OTP :", error);
    res.status(500).json({ success: false, message: "Erreur lors de la vérification de l'OTP" });
  }
};