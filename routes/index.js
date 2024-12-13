const express = require('express');
const router = express.Router();

const bahanRoutes = require('./bahanRoutes');
const productRoutes = require('./productRoutes');
const bomRoutes = require('./bomRoutes');

router.use('/bahan', bahanRoutes);
router.use('/product', productRoutes);
router.use('/bom', bomRoutes);

module.exports = router;