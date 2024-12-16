const { salesOrderModels } = require("../model");
const { validateSalesOrder } = require("../utils/validationHelper");

const findAllSalesOrder = async () => {
    try {
        return await salesOrderModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findSalesOrderByID = async (salesOrderID) => {
    try {
        return await salesOrderModels.findByID(salesOrderID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findSalesOrderByReferensiQuotation = async (referensiQuotation) => {
    try {
        return await salesOrderModels.findByReferensiQuotation(referensiQuotation);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createSalesOrder = async (DataSalesOrder) => {
    try {
        await validateSalesOrder.validate(DataSalesOrder, { abortEarly: false });
        return await salesOrderModels.create(DataSalesOrder);
    } catch (error) {
        throw error;
    }
}

const updateSalesOrder = async (salesOrderID, DataSalesOrder) => {
    try {
        await validateSalesOrder.validate(DataSalesOrder, { abortEarly: false });
        return await salesOrderModels.update(salesOrderID, DataSalesOrder);
    } catch (error) {
        throw error;
    }
}

const deleteSalesOrder = async (salesOrderID) => {
    try {
        return await salesOrderModels.destroy(salesOrderID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllSalesOrder,
    findSalesOrderByID,
    findSalesOrderByReferensiQuotation,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
}