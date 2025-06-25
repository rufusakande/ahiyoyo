const User = require("../models/User");
const logger = require("../utils/logger");
const { Op } = require('sequelize');
const {
  sendApprovalNotification,
  sendRejectionNotification
} = require('../services/emailService');

// ✅ Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });
    res.json(users);
  } catch (error) {
    logger.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    logger.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupérer les statistiques du tableau de bord
exports.getDashboardStats = async (req, res) => {
  try {
    // Nombre total d'utilisateurs/clients
    const totalUsers = await User.count({
      where: {
        role: 'user'
      }
    });

    // Demandes en attente (documents soumis mais non vérifiés)
    const pendingRequests = await User.count({
      where: {
        isDocumentSubmitted: true,
        isIdentityVerified: false
      }
    });

    // Utilisateurs vérifiés ce mois
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const verifiedThisMonth = await User.count({
      where: {
        isIdentityVerified: true,
        updatedAt: {
          [Op.gte]: currentMonth
        }
      }
    });

    // Demandes rejetées (documents soumis mais pas vérifiés depuis plus de 7 jours)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const rejectedRequests = await User.count({
      where: {
        isDocumentSubmitted: true,
        isIdentityVerified: false,
        updatedAt: {
          [Op.lt]: weekAgo
        }
      }
    });

    // Nouvelles inscriptions cette semaine
    const newRegistrations = await User.count({
      where: {
        createdAt: {
          [Op.gte]: weekAgo
        }
      }
    });

    // Statistiques par pays
    const usersByCountry = await User.findAll({
      attributes: [
        'country',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      where: {
        country: {
          [Op.not]: null
        }
      },
      group: ['country'],
      raw: true
    });

    res.json({
      totalUsers,
      pendingRequests,
      verifiedThisMonth,
      rejectedRequests,
      newRegistrations,
      usersByCountry
    });
  } catch (error) {
    logger.error("Erreur lors de la récupération des statistiques :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Récupérer les demandes avec filtrage
exports.getRequests = async (req, res) => {
  try {
    const { 
      status = 'all', 
      country, 
      page = 1, 
      limit = 10,
      search 
    } = req.query;

    let whereCondition = {};

    // Filtrage par statut
    switch (status) {
      case 'pending':
        whereCondition.isDocumentSubmitted = true;
        whereCondition.isIdentityVerified = false;
        break;
      case 'verified':
        whereCondition.isIdentityVerified = true;
        break;
      case 'unverified':
        whereCondition.isDocumentSubmitted = false;
        break;
      case 'all':
      default:
        break;
    }

    // Filtrage par pays
    if (country && country !== 'all') {
      whereCondition.country = country;
    }

    // Recherche par nom, email ou identifiant
    if (search) {
      whereCondition[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { userIdentifier: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      where: whereCondition,
      attributes: {
        exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      requests: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalRequests: count
    });
  } catch (error) {
    logger.error("Erreur lors de la récupération des demandes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Valider une demande d'identité
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNote } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.isDocumentSubmitted) {
      return res.status(400).json({
        message: "Aucun document n'a été soumis pour cet utilisateur"
      });
    }

    // Valider la demande
    user.isIdentityVerified = true;
    await user.save();

    // ✅ Envoyer l'email de validation
    try {
      await sendApprovalNotification(user.email, user.userIdentifier, adminNote);
      logger.info(`📧 Email d'approbation envoyé à ${user.email}`);
    } catch (emailError) {
      logger.error("❌ Erreur envoi email d'approbation :", emailError);
      // Continue même si l'email échoue, la validation est faite
    }

    // Log de l'action admin
    logger.info(`✅ Demande approuvée par admin pour l'utilisateur ${user.userIdentifier}`, {
      adminId: req.user.id,
      userId: user.id,
      adminNote: adminNote || 'Aucune note',
      emailSent: true
    });

    res.json({
      message: "Demande approuvée avec succès et email envoyé",
      user: {
        id: user.id,
        userIdentifier: user.userIdentifier,
        email: user.email,
        isIdentityVerified: user.isIdentityVerified
      }
    });
  } catch (error) {
    logger.error("Erreur lors de l'approbation de la demande :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Rejeter une demande d'identité
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason, adminNote } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({
        message: "La raison du rejet est obligatoire"
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.isDocumentSubmitted) {
      return res.status(400).json({
        message: "Aucun document n'a été soumis pour cet utilisateur"
      });
    }

    // Rejeter la demande - remettre les statuts à false
    user.isIdentityVerified = false;
    user.isDocumentSubmitted = false;
    user.identityDocument = null; // Supprimer le document rejeté
    await user.save();

    // ❌ Envoyer l'email de rejet
    try {
      await sendRejectionNotification(user.email, user.userIdentifier, rejectionReason, adminNote);
      logger.info(`📧 Email de rejet envoyé à ${user.email}`);
    } catch (emailError) {
      logger.error("❌ Erreur envoi email de rejet :", emailError);
      // Continue même si l'email échoue, le rejet est fait
    }

    // Log de l'action admin
    logger.info(`❌ Demande rejetée par admin pour l'utilisateur ${user.userIdentifier}`, {
      adminId: req.user.id,
      userId: user.id,
      rejectionReason,
      adminNote: adminNote || 'Aucune note',
      emailSent: true
    });

    res.json({
      message: "Demande rejetée avec succès et email envoyé",
      user: {
        id: user.id,
        userIdentifier: user.userIdentifier,
        email: user.email,
        isIdentityVerified: user.isIdentityVerified,
        isDocumentSubmitted: user.isDocumentSubmitted
      },
      rejectionReason
    });
  } catch (error) {
    logger.error("Erreur lors du rejet de la demande :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Modifier le rôle d'un utilisateur
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Rôle mis à jour avec succès", user });
  } catch (error) {
    logger.error("Erreur lors de la mise à jour du rôle :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    await user.destroy();

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    logger.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Modifier les informations d'un utilisateur
exports.updateUserInfo = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      role,
      isEmailVerified,
      isPhoneVerified,
      isIdentityVerified,
    } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // 📌 Vérifier si l'email ou le téléphone sont déjà utilisés par un autre utilisateur
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res
          .status(400)
          .json({ message: "Ce numéro de téléphone est déjà utilisé" });
      }
      user.phone = phone;
      user.isPhoneVerified = false; // Nécessite une nouvelle vérification
    }

    // 📌 Mise à jour des autres champs
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.country = country || user.country;
    user.role = role || user.role;

    // 📌 Mise à jour des statuts de vérification
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) user.isPhoneVerified = isPhoneVerified;
    if (isIdentityVerified !== undefined)
      user.isIdentityVerified = isIdentityVerified;

    await user.save();

    res.json({
      message: "Informations de l'utilisateur mises à jour avec succès",
      user,
    });
  } catch (error) {
    logger.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};