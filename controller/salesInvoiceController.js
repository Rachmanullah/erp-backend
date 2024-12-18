const { salesInvoiceService, salesOrderService, quotationService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllInvoice = async (req, res) => {
    try {
        const salesInvoice = await salesInvoiceService.findAllSalesInvoice();

        return responseHandler.success(res, salesInvoice, 'SuccessFuly', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetInvoiceByReferenceQuotation = async (req, res) => {
    try {
        const { referensi } = req.params;
        const dataInvoice = await salesInvoiceService.findSalesInvoiceByReferenceQuotation(referensi);
        if (!dataInvoice) return responseHandler.error(res, 'Data Not Found', 404);

        const dataSalesOrder = await salesOrderService.findSalesOrderByReferensiQuotation(referensi);
        if (!dataSalesOrder) return responseHandler.error(res, 'Data Purchase Order Not Found', 404);

        const dataQuotation = await quotationService.findQuotationByReference(referensi);
        let nama_customer = null;

        if (dataQuotation.length > 0) {
            nama_customer = dataQuotation[0]?.Customer?.nama_customer || null;
        }

        const dataResponse = {
            id: dataInvoice.id,
            referensi_quotation: dataInvoice.referensi_quotation,
            referensi_invoice: dataInvoice.referensi_invoice,
            nama_customer,
            confirmation_date: dataSalesOrder.confirmation_date,
            arrival_date: dataSalesOrder.arrival_date,
            accounting_date: dataInvoice.accounting_date,
            invoice_date: dataInvoice.invoice_date,
            payment_date: dataInvoice.payment_date,
            type_invoice: dataInvoice.type_invoice,
            total_pembayaran: dataInvoice.total_pembayaran,
            status: dataInvoice.status,
            Produk: dataQuotation.map((item) => ({
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

const HandlerUpdateStatusInvoice = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await salesInvoiceService.findSalesInvoiceById(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await salesInvoiceService.updateStatusSalesInvoice(id, data);

        const dataSalesOrder = await salesOrderService.findSalesOrderByReferensiQuotation(result.referensi_quotation);
        if (!dataSalesOrder) return responseHandler.error(res, 'Data Sales Order Not Found', 404);

        const dataQuotation = await quotationService.findQuotationByReference(result.referensi_quotation);
        let nama_customer = null;

        if (dataQuotation.length > 0) {
            nama_customer = dataQuotation[0]?.Customer?.nama_customer || null;
        }

        const dataResponse = {
            id: result.id,
            referensi_quotation: result.referensi_quotation,
            referensi_invoice: result.referensi_invoice,
            nama_customer,
            confirmation_date: dataSalesOrder.confirmation_date,
            arrival_date: dataSalesOrder.arrival_date,
            accounting_date: result.accounting_date,
            invoice_date: result.invoice_date,
            payment_date: result.payment_date,
            type_invoice: result.type_invoice,
            total_pembayaran: result.total_pembayaran,
            status: result.status,
            Produk: dataQuotation.map((item) => ({
                id_produk: item.Produk.id,
                nama_produk: item.Produk.nama_produk,
                harga_produk: item.Produk.harga_produk,
                jumlah_produk: item.jumlah_produk,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, dataResponse, 'update data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerUpdateInvoice = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const invoice = await salesInvoiceService.findSalesInvoiceById(id);
        if (!invoice) return responseHandler.error(res, 'invoice Not Found', 404);
        const isValidDate = (date) => !isNaN(new Date(date).getTime());
        const paymentDate = data.payment_date && isValidDate(data.payment_date)
            ? new Date(data.payment_date)
            : null;
        const updatedData = {
            ...data,
            payment_date: paymentDate
        }
        const result = await salesInvoiceService.updateSalesInvoice(id, updatedData);

        return responseHandler.success(res, result, 'Invoice updated successfully', 200);
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

module.exports = {
    HandlerGetAllInvoice,
    HandlerGetInvoiceByReferenceQuotation,
    HandlerUpdateStatusInvoice,
    HandlerUpdateInvoice
};