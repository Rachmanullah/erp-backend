const { bahanService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllBahan = async (req, res) => {
    try {
        const data = await bahanService.findAllBahan();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetBahanById = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const data = await bahanService.findBahanByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateBahan = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            const imageUrl = `/images/${req.file.filename}`;
            data.gambar_bahan = imageUrl;
        }
        const createdData = await bahanService.createBahan(data);

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

const HandlerUpdateBahan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await bahanService.findBahanByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        if (req.file) {
            data.gambar_bahan = `/images/${req.file.filename}`;
        } else {
            data.gambar_bahan = checkData.gambar_bahan; // Tetap gunakan gambar lama
        }
        const response = await bahanService.updateBahan(id, data);
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

const HandlerDeleteBahan = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await bahanService.findBahanByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await bahanService.deleteBahan(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllBahan,
    HandlerGetBahanById,
    HandlerCreateBahan,
    HandlerUpdateBahan,
    HandlerDeleteBahan,
}