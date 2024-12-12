const express = require('express');
const router = express.Router();

const bahanRoutes = require('./bahanRoutes');
const productRoutes = require('./productRoutes');

router.use('/bahan', bahanRoutes);
router.use('/product', productRoutes);

module.exports = router;