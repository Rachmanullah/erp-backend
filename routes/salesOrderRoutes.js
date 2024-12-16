const express = require('express');
const { salesOrderController } = require('../controller');
const router = express.Router();
router.get('/', salesOrderController.HandlerGetAllSalesOrder);
router.get('/:id', salesOrderController.HandlerGetSalesOrderByID);
router.post('/', salesOrderController.HandlerCreateSalesOrder);
router.put('/:id', salesOrderController.HandlerUpdateSalesOrder);
router.delete('/:id', salesOrderController.HandlerDeleteSalesOrder);
module.exports = router;