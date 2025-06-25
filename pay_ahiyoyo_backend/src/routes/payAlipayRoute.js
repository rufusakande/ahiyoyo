const express = require('express');
const router = express.Router();
const { 
  createPayAlipay, 
  getPayAlipayHistory,
  updatePayAlipay 
} = require('../controllers/payAlipayController');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.post('/', createPayAlipay);
router.get('/history', getPayAlipayHistory);
//router.put('/:id', updatePayAlipay);

module.exports = router;