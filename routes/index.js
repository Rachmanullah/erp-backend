const express = require('express');
const router = express.Router();

const bahanRoutes = require('./bahanRoutes');
const productRoutes = require('./productRoutes');
const bomRoutes = require('./bomRoutes');
const orderRoutes = require('./orderRoutes');
const vendorRoutes = require('./vendorRoutes');
const rfqRoutes = require('./rfqRoutes');
const purchaseOrderRoutes = require('./purchaseOrderRoutes');
const billRoutes = require('./billRoutes');
const customerRoutes = require('./customerRoutes');
const quotationRoutes = require('./quotationRoutes');
const salesOrderRoutes = require('./salesOrderRoutes');
const salesInvoiceRoutes = require('./salesInvoiceRoutes');
const countRoutes = require('./countRoutes');
const printRoutes = require('./printRoutes');

router.use('/bahan', bahanRoutes);
router.use('/product', productRoutes);
router.use('/bom', bomRoutes);
router.use('/order', orderRoutes);
router.use('/vendor', vendorRoutes);
router.use('/rfq', rfqRoutes);
router.use('/purchaseOrder', purchaseOrderRoutes);
router.use('/bill', billRoutes);
router.use('/customer', customerRoutes);
router.use('/quotation', quotationRoutes);
router.use('/salesOrder', salesOrderRoutes);
router.use('/salesInvoice', salesInvoiceRoutes);
router.use('/count', countRoutes);
router.use('/print', printRoutes);

module.exports = router;