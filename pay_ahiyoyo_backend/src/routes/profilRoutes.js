const express = require('express');
const router = express.Router();
const { getProfil, updateProfil, submitVerification } = require('../controllers/profilController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', getProfil);
router.put('/update', updateProfil);
router.post('/submit-verification', submitVerification); 

module.exports = router;