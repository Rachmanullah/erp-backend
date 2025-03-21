const express = require('express');
const { purchaseOrderController } = require('../controller');
const router = express.Router();
router.get('/', purchaseOrderController.HandlerGetAllPo);
router.get('/:id', purchaseOrderController.HandlerGetPoByID);
router.post('/', purchaseOrderController.HandlerCreatePo);
router.put('/:id', purchaseOrderController.HandlerUpdatePo);
router.delete('/:id', purchaseOrderController.HandlerDeletePo);
module.exports = router;