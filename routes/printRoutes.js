const express = require('express');
const { rfqController } = require('../controller');
const router = express.Router();
router.get('/rfq/:referensi', rfqController.HandlerPrintRfq);
module.exports = router;