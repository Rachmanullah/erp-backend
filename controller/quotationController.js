const { quotationService, customerService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllQuotation = async (req, res) => {
    try {
        const data = await quotationService.findAllQuotation();
        // Kelompokkan data berdasarkan referensi quotation
        const groupedData = data.reduce((result, item) => {
            // Cari kelompok berdasarkan referensi quotation
            const quotationIndex = result.findIndex(quotation => quotation.referensi === item.referensi);

            if (quotationIndex === -1) {
                // Jika belum ada, buat kelompok baru
                result.push({
                    id_quotation: item.id_quotation,
                    id_customer: item.id_customer,
                    referensi: item.referensi,
                    nama_customer: item.Customer.nama_customer,
                    order_date: item.order_date,
                    status: item.status,
                    produk: [
                        {
                            id_produk: item.Produk.id,
                            nama_produk: item.Produk.nama_produk,
                            harga_produk: item.Produk.harga_produk,
                            jumlah_produk: item.jumlah_produk,
                            total_biaya: item.total_biaya,
                        },
                    ],
                });
            } else {
                // Jika sudah ada, tambahkan produk ke kelompok yang sesuai
                result[quotationIndex].produk.push({
                    id_produk: item.Produk.id,
                    nama_produk: item.Produk.nama_produk,
                    harga_produk: item.Produk.harga_produk,
                    jumlah_produk: item.jumlah_produk,
                    total_biaya: item.total_biaya,
                });
            }

            return result;
        }, []);

        return responseHandler.success(res, groupedData, 'Get all data success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetQuotationByReference = async (req, res) => {
    try {
        const { referensi } = req.params;

        const data = await quotationService.findQuotationByReference(referensi);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        console.log(data)
        const formattedData = {
            id_customer: data[0].Customer.id_customer,
            referensi: data[0].referensi,
            nama_customer: data[0].Customer.nama_customer,
            order_date: data[0].order_date,
            status: data[0].status,
            Produk: data.map((item) => ({
                id_produk: item.Produk.id,
                nama_produk: item.Produk.nama_produk,
                harga_produk: item.Produk.harga_produk,
                jumlah_produk: item.jumlah_produk,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, formattedData, 'get data by reference Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateQuotation = async (req, res) => {
    try {
        const data = req.body;
        console.log('Request Data:', JSON.stringify(data, null, 2));

        const customer = await customerService.findCustomerByID(parseInt(data.id_customer));
        if (!customer) return responseHandler.error(res, 'Product Not Found', 404);

        const createdData = await quotationService.createQuotation(data);

        return responseHandler.success(res, createdData, 'Create Quotation Success', 201);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {});
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error.message);
            return responseHandler.error(res, 'Internal Server Error', 500);
        }
    }
};

const HandlerUpdateQuotation = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = req.body;

        if (!data || !Array.isArray(data.produk)) {
            return responseHandler.error(res, 'Invalid data format.', 400);
        }

        const customer = await customerService.findCustomerByID(parseInt(data.id_customer));
        if (!customer) return responseHandler.error(res, 'Product Not Found', 404);

        const result = await quotationService.updateQuotationByReferensi(referensi, data);

        return responseHandler.success(res, result, 'quotation updated successfully', 200);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const validationErrors = error.inner.reduce((acc, err) => {
                acc[err.path] = err.message;
                return acc;
            }, {});
            console.error('Validation Errors:', validationErrors);
            return responseHandler.error(res, validationErrors, 400);
        } else {
            console.error('Unexpected Error:', error.message);
            return responseHandler.error(res, 'Internal Server Error', 500);
        }
    }
};

const HandlerDeleteQuotation = async (req, res) => {
    try {
        const { referensi } = req.params;
        const checkData = await quotationService.findQuotationByReference(referensi);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await quotationService.deleteQuotation(referensi);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerUpdateStatusQuotation = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = req.body;

        const checkData = await quotationService.findQuotationByReference(referensi);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await quotationService.updateStatusQuotation(referensi, data);

        const formattedData = {
            id_customer: result[0].id_customer,
            referensi: result[0].referensi,
            nama_customer: result[0].Customer.nama_customer,
            order_date: result[0].order_date,
            status: result[0].status,
            Produk: result.map((item) => ({
                id_produk: item.Produk.id,
                nama_produk: item.Produk.nama_produk,
                harga_produk: item.Produk.harga_produk,
                jumlah_produk: item.jumlah_produk,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, formattedData, 'update data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllQuotation,
    HandlerGetQuotationByReference,
    HandlerCreateQuotation,
    HandlerUpdateQuotation,
    HandlerDeleteQuotation,
    HandlerUpdateStatusQuotation
}