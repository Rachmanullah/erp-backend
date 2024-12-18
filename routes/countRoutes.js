const express = require('express');
const { productController, quotationController, salesInvoiceController } = require('../controller');
const upload = require('../utils/upload');
const router = express.Router();
router.get('/produk', productController.HandlerCountProduct);
router.get('/quotation', quotationController.HandlerCountQuotation);
router.get('/invoice', salesInvoiceController.HandlerGetTotalInvoce);
router.get('/top/invoice', salesInvoiceController.HandlerFindTopInvoiceByTotal);
router.get('/produk/MostFrequentProductId', quotationController.HandlerProdukTeratas);

module.exports = router;