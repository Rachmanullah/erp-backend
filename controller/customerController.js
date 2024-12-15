const { customerService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllCustomer = async (req, res) => {
    try {
        const data = await customerService.findAllCustomer();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetCustomerById = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const data = await customerService.findCustomerByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateCustomer = async (req, res) => {
    try {
        const data = req.body;
        const createdData = await customerService.createCustomer(data);

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

const HandlerUpdateCustomer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await customerService.findCustomerByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const response = await customerService.updateCustomer(id, data);
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

const HandlerDeleteCustomer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await customerService.findCustomerByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await customerService.deleteCustomer(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllCustomer,
    HandlerGetCustomerById,
    HandlerCreateCustomer,
    HandlerUpdateCustomer,
    HandlerDeleteCustomer,
};