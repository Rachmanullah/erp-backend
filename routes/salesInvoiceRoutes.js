const express = require('express');
const { salesInvoiceController } = require('../controller');
const router = express.Router();
router.get('/:referensi', salesInvoiceController.HandlerGetInvoiceByReferenceQuotation);
router.put('/status/:id', salesInvoiceController.HandlerUpdateStatusInvoice);
router.put('/:id', salesInvoiceController.HandlerUpdateInvoice);
module.exports = router;