const { purchaseOrderModels } = require("../model");
const { validatePO } = require("../utils/validationHelper");

const findAllPo = async () => {
    try {
        return await purchaseOrderModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findPoByID = async (purchaseOrderID) => {
    try {
        return await purchaseOrderModels.findByID(purchaseOrderID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findPoByReferensiRfq = async (referensiRfq) => {
    try {
        return await purchaseOrderModels.findByReferensiRfq(referensiRfq);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createPo = async (DataPo) => {
    try {
        await validatePO.validate(DataPo, { abortEarly: false });
        return await purchaseOrderModels.create(DataPo);
    } catch (error) {
        throw error;
    }
}

const updatePo = async (purchaseOrderID, DataPo) => {
    try {
        await validatePO.validate(DataPo, { abortEarly: false });
        return await purchaseOrderModels.update(purchaseOrderID, DataPo);
    } catch (error) {
        throw error;
    }
}

const deletePo = async (purchaseOrderID) => {
    try {
        return await purchaseOrderModels.destroy(purchaseOrderID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllPo,
    findPoByID,
    findPoByReferensiRfq,
    createPo,
    updatePo,
    deletePo,
}