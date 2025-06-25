const User = require('../models/User');
const logger = require("../utils/logger");

// ✅ Récupérer le profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const userProfile = {
            userIdentifier: user.userIdentifier,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country,
            countryCode: user.countryCode,
            phone: user.phone,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            isIdentityVerified: user.isIdentityVerified,
            role: user.role
        };

        res.json(userProfile);
    } catch (error) {
        logger.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, country, phone } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les champs modifiables
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.country = country || user.country;
        user.phone = phone || user.phone;

        await user.save();

        res.json({ message: 'Profil mis à jour avec succès', user });
    } catch (error) {
        logger.error('Erreur lors de la mise à jour du profil :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
