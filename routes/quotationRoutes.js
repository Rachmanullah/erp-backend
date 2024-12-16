const express = require('express');
const { quotationController } = require('../controller');
const router = express.Router();
router.get('/', quotationController.HandlerGetAllQuotation);
router.get('/:referensi', quotationController.HandlerGetQuotationByReference);
router.post('/', quotationController.HandlerCreateQuotation);
router.put('/:referensi', quotationController.HandlerUpdateQuotation);
router.put('/status/:referensi', quotationController.HandlerUpdateStatusQuotation);
router.delete('/:referensi', quotationController.HandlerDeleteQuotation);
module.exports = router;