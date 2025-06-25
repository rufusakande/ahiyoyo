const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Route pour récupérer le profil de l'utilisateur connecté
router.get('/me', authMiddleware, getProfile);

// ✅ Route pour mettre à jour le profil de l'utilisateur
//router.put('/me', authMiddleware, updateProfile);

module.exports = router;
