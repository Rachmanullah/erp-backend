const express = require('express');
const router = express.Router();

const bahanRoutes = require('./bahanRoutes');
const productRoutes = require('./productRoutes');
const bomRoutes = require('./bomRoutes');
const orderRoutes = require('./orderRoutes');
const vendorRoutes = require('./vendorRoutes');

router.use('/bahan', bahanRoutes);
router.use('/product', productRoutes);
router.use('/bom', bomRoutes);
router.use('/order', orderRoutes);
router.use('/vendor', vendorRoutes);

module.exports = router;