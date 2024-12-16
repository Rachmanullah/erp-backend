const { salesOrderService, quotationService, salesInvoiceService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllSalesOrder = async (req, res) => {
    try {
        const data = await salesOrderService.findAllSalesOrder();
        const referensiQuotationList = data.map((item) => item.referensi_quotation);
        const dataInvoice = await salesInvoiceService.findAllSalesInvoice();

        const quotationMap = await Promise.all(
            referensiQuotationList.map(async (quotationList) => {
                const quotationData = await quotationService.findQuotationByReference(quotationList);
                if (quotationData.length > 0) {
                    return { referensi: quotationData[0].referensi, nama_customer: quotationData[0].Customer.nama_customer };
                }
                return { referensi: quotationList, nama_customer: null };
            })
        );

        const dataResponse = data.map((item) => {
            const quotation = quotationMap.find((quotation) => quotation.referensi === item.referensi_quotation);
            const referencesInvoice = dataInvoice.filter((item) => item.referensi_quotation === quotation.referensi);
            return {
                id: item.id,
                referensi_quotation: item.referensi_quotation,
                referensi_invoice: referencesInvoice,
                nama_customer: quotation ? quotation.nama_customer : null,
                confirmation_date: item.confirmation_date,
                total_pembayaran: item.total_pembayaran,
                arrival_date: item.arrival_date,
                status: item.status,
            };
        });

        return responseHandler.success(res, dataResponse, 'get all data Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetSalesOrderByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await salesOrderService.findSalesOrderByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);

        const quotation = await quotationService.findQuotationByReference(data.referensi_rfq);
        let nama_customer = null;

        if (quotation.length > 0) {
            nama_customer = quotation[0]?.Customer?.nama_customer || null; // Ambil nama customer jika ada
        }

        const invoiceReference = await salesInvoiceService.findSalesInvoiceByReferenceQuotation(data.referensi_quotation);
        const dataResponse = {
            id: data.id,
            referensi_quotation: data.referensi_quotation,
            referensi_invoice: invoiceReference,
            nama_customer,
            confirmation_date: data.confirmation_date,
            total_pembayaran: data.total_pembayaran,
            arrival_date: data.arrival_date,
            status: data.status,
            Produk: quotation.map((item) => ({
                id_produk: item.Produk.id,
                nama_produk: item.Produk.nama_produk,
                harga_produk: item.Produk.harga_produk,
                jumlah_produk: item.jumlah_produk,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, dataResponse, 'Get data by ID success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateSalesOrder = async (req, res) => {
    try {
        const data = req.body;
        const createdData = await salesOrderService.createSalesOrder(data);

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

const HandlerUpdateSalesOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await salesOrderService.findSalesOrderByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const response = await salesOrderService.updateSalesOrder(id, data);
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

const HandlerDeleteSalesOrder = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkData = await salesOrderService.findSalesOrderByID(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await salesOrderService.deleteSalesOrder(id);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllSalesOrder,
    HandlerGetSalesOrderByID,
    HandlerCreateSalesOrder,
    HandlerUpdateSalesOrder,
    HandlerDeleteSalesOrder,
}