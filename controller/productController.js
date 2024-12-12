const { productService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllProduct = async (req, res) => {
    try {
        const data = await productService.findAllProduct();
        return responseHandler.success(res, data, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetProductById = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const data = await productService.findProductByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateProduct = async (req, res) => {
    try {
        const data = req.body;
        if (req.file) {
            const imageUrl = `/images/${req.file.filename}`;
            data.gambar_produk = imageUrl;
        }

        const createdData = await productService.createProduct(data);

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

const HandlerUpdateProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await productService.findProductByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        // Jika ada file gambar baru, tambahkan ke data; jika tidak, gunakan gambar yang sudah ada
        if (req.file) {
            data.gambar_produk = `/images/${req.file.filename}`;
        } else {
            data.gambar_produk = checkData.gambar_produk; // Tetap gunakan gambar lama
        }
        const response = await productService.updateProduct(id, data);
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

const HandlerDeleteProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await productService.findProductByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await productService.deleteProduct(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllProduct,
    HandlerGetProductById,
    HandlerCreateProduct,
    HandlerUpdateProduct,
    HandlerDeleteProduct,
}