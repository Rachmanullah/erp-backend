const { orderService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllOrder = async (req, res) => {
    try {
        const data = await orderService.findAllOrder();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetOrderById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await orderService.findOrderByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateOrder = async (req, res) => {
    try {
        const data = req.body;
        const result = await orderService.createOrder(data);
        return responseHandler.success(res, result, 'create data Success');
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

const HandlerUpdateOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await orderService.findOrderByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await orderService.updateOrder(id, data);
        return responseHandler.success(res, result, 'update data Success');
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

const HandlerUpdateStatusOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await orderService.findOrderByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await orderService.updateStatusOrder(id, data);
        return responseHandler.success(res, result, 'update data Success');
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

const HandlerDeleteOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await orderService.findOrderByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await orderService.deleteOrder(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllOrder,
    HandlerGetOrderById,
    HandlerCreateOrder,
    HandlerUpdateOrder,
    HandlerUpdateStatusOrder,
    HandlerDeleteOrder,
}