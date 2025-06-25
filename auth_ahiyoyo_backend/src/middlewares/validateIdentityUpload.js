const User = require('../models/User');

const validateIdentityUpload = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email requis." });

        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

        if (user.isIdentityVerified) {
            return res.status(400).json({ message: "Votre identité est déjà vérifiée, vous ne pouvez pas soumettre un autre document." });
        }

        if (user.isDocumentSubmitted) {
            return res.status(400).json({ message: "Votre document a déjà été soumis et est en attente de validation." });
        }

        req.user = user; // On stocke l'utilisateur dans `req` pour l'utiliser plus tard
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateIdentityUpload;
