const { purchaseOrderService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllPo = async (req, res) => {
    try {
        const data = await purchaseOrderService.findAllPo();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetPoByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await purchaseOrderService.findPoByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetPoByReferensiRfq = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = await purchaseOrderService.findPoByReferensiRfq(referensi);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreatePo = async (req, res) => {
    try {
        const data = req.body;
        const createdData = await purchaseOrderService.createPo(data);

        return responseHandler.success(res, createdData, 'create data Success', 201);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.assign(validationErrors, error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {}));
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error);
            return responseHandler.error(res, 'Internal Server Error', 500);
        }
    }
}

const HandlerUpdatePo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await purchaseOrderService.findPoByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const response = await purchaseOrderService.updatePo(id, data);
        return responseHandler.success(res, response, 'update data Success');

    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            Object.assign(validationErrors, error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {}));
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error);
            return responseHandler.error(res, 'Internal Server Error', 500);
        }
    }
}

const HandlerDeletePo = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await purchaseOrderService.findPoByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await purchaseOrderService.deletePo(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllPo,
    HandlerGetPoByID,
    HandlerGetPoByReferensiRfq,
    HandlerCreatePo,
    HandlerUpdatePo,
    HandlerDeletePo,
}