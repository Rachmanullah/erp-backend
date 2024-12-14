const { vendorService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllVendor = async (req, res) => {
    try {
        const data = await vendorService.findAllVendor();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetVendorById = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const data = await vendorService.findVendorByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateVendor = async (req, res) => {
    try {
        const data = req.body;
        const createdData = await vendorService.createVendor(data);

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

const HandlerUpdateVendor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await vendorService.findVendorByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const response = await vendorService.updateVendor(id, data);
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

const HandlerDeleteVendor = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await vendorService.findVendorByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await vendorService.deleteVendor(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllVendor,
    HandlerGetVendorById,
    HandlerCreateVendor,
    HandlerUpdateVendor,
    HandlerDeleteVendor,
};