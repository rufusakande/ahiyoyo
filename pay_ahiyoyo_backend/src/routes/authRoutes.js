const express = require('express');
const { login } = require('../controllers/authController');
const { sendOTP, verifyOTP } = require("../controllers/otpController");

const router = express.Router();

router.post('/login', login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;