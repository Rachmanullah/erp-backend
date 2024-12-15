const express = require('express');
const { customerController } = require('../controller');
const router = express.Router();
router.get('/', customerController.HandlerGetAllCustomer);
router.get('/:id', customerController.HandlerGetCustomerById);
router.post('/', customerController.HandlerCreateCustomer);
router.put('/:id', customerController.HandlerUpdateCustomer);
router.delete('/:id', customerController.HandlerDeleteCustomer);
module.exports = router;