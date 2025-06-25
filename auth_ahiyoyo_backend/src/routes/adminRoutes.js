const express = require('express');
const { 
  getAllUsers, 
  getUserById, 
  updateUserRole, 
  deleteUser, 
  updateUserInfo,
  getDashboardStats,
  getRequests,
  approveRequest,
  rejectRequest
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// ✅ Dashboard - Récupérer les statistiques
router.get('/dashboard/stats', authMiddleware, adminMiddleware, getDashboardStats);

// ✅ Gestion des demandes
router.get('/requests', authMiddleware, adminMiddleware, getRequests);
router.put('/requests/:id/approve', authMiddleware, adminMiddleware, approveRequest);
router.put('/requests/:id/reject', authMiddleware, adminMiddleware, rejectRequest);

// ✅ Récupérer tous les utilisateurs (Admin seulement)
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

// ✅ Récupérer un utilisateur par ID
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);

// ✅ Modifier le rôle d'un utilisateur (Admin seulement)
router.put('/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);

// ✅ Supprimer un utilisateur (Admin seulement)
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// ✅ Modifier les informations d'un utilisateur
router.put('/users/:id', authMiddleware, adminMiddleware, updateUserInfo);

module.exports = router;