const express = require('express');
const { billController } = require('../controller');
const router = express.Router();
router.get('/:referensi', billController.HandlerGetBillByReferenceRfq);
router.put('/status/:id', billController.HandlerUpdateStatusBill);
router.put('/:id', billController.HandlerUpdateBill);
module.exports = router;