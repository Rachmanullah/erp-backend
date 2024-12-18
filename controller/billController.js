const { billService, purchaseOrderService, rfqService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllBill = async (req, res) => {
    try {
        const bill = await billService.findAllBill();
        
        return responseHandler.success(res, bill, 'SuccessFuly', 200);
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetBillByReferenceRfq = async (req, res) => {
    try {
        const { referensi } = req.params;
        const dataBill = await billService.findBillByReferenceRfq(referensi);
        if (!dataBill) return responseHandler.error(res, 'Data Not Found', 404);

        const dataPO = await purchaseOrderService.findPoByReferensiRfq(referensi);
        if (!dataPO) return responseHandler.error(res, 'Data Purchase Order Not Found', 404);

        const dataRfq = await rfqService.findRfqByReference(referensi);
        let nama_vendor = null;

        if (dataRfq.length > 0) {
            nama_vendor = dataRfq[0]?.Vendor?.nama_vendor || null;
        }

        const dataResponse = {
            id: dataBill.id,
            referensi_rfq: dataBill.referensi_rfq,
            referensi_bill: dataBill.referensi_bill,
            nama_vendor,
            confirmation_date: dataPO.confirmation_date,
            arrival_date: dataPO.arrival_date,
            accounting_date: dataBill.accounting_date,
            bill_date: dataBill.bill_date,
            payment_date: dataBill.payment_date,
            type_bill: dataBill.type_bill,
            total_pembayaran: dataBill.total_pembayaran,
            status: dataBill.status,
            Bahan: dataRfq.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, dataResponse, 'Get data by ID success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerUpdateStatusBill = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const checkData = await billService.findBillById(id);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await billService.updateStatusBill(id, data);

        const dataPO = await purchaseOrderService.findPoByReferensiRfq(result.referensi_rfq);
        if (!dataPO) return responseHandler.error(res, 'Data Purchase Order Not Found', 404);

        const dataRfq = await rfqService.findRfqByReference(result.referensi_rfq);
        let nama_vendor = null;

        if (dataRfq.length > 0) {
            nama_vendor = dataRfq[0]?.Vendor?.nama_vendor || null;
        }

        const dataResponse = {
            id: result.id,
            referensi_rfq: result.referensi_rfq,
            referensi_bill: result.referensi_bill,
            nama_vendor,
            confirmation_date: dataPO.confirmation_date,
            arrival_date: dataPO.arrival_date,
            accounting_date: result.accounting_date,
            bill_date: result.bill_date,
            payment_date: result.payment_date,
            type_bill: result.type_bill,
            total_pembayaran: result.total_pembayaran,
            status: result.status,
            Bahan: dataRfq.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, dataResponse, 'update data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerUpdateBill = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const bill = await billService.findBillById(id);
        if (!bill) return responseHandler.error(res, 'Bill Not Found', 404);
        const isValidDate = (date) => !isNaN(new Date(date).getTime());
        const paymentDate = data.payment_date && isValidDate(data.payment_date)
            ? new Date(data.payment_date)
            : null;
        const updatedData = {
            ...data,
            payment_date: paymentDate
        }
        const result = await billService.updateBill(id, updatedData);

        return responseHandler.success(res, result, 'Bill updated successfully', 200);
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
    HandlerGetAllBill,
    HandlerGetBillByReferenceRfq,
    HandlerUpdateStatusBill,
    HandlerUpdateBill
};