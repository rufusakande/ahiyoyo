const express = require('express');
const router = express.Router();
const { webhookFeexpay } = require('../webhook/webhookFeexpay');

router.post('/', webhookFeexpay);

module.exports = router;