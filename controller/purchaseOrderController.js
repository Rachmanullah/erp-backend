const { purchaseOrderService, rfqService, billService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllPo = async (req, res) => {
    try {
        const data = await purchaseOrderService.findAllPo();
        const referensiRfqList = data.map((item) => item.referensi_rfq);
        const dataBill = await billService.findAllBill();

        const rfqMap = await Promise.all(
            referensiRfqList.map(async (rfqList) => {
                const rfqData = await rfqService.findRfqByReference(rfqList);
                if (rfqData.length > 0) {
                    return { referensi: rfqData[0].referensi, nama_vendor: rfqData[0].Vendor.nama_vendor };
                }
                return { referensi: rfqList, nama_vendor: null };
            })
        );

        const dataResponse = data.map((item) => {
            const rfq = rfqMap.find((rfq) => rfq.referensi === item.referensi_rfq);
            const referencesBill = dataBill.filter((item) => item.referensi_rfq === rfq.referensi);
            return {
                id: item.id,
                referensi_rfq: item.referensi_rfq,
                referensi_bill: referencesBill,
                nama_vendor: rfq ? rfq.nama_vendor : null,
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

const HandlerGetPoByID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await purchaseOrderService.findPoByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);

        const rfq = await rfqService.findRfqByReference(data.referensi_rfq);
        let nama_vendor = null;

        if (rfq.length > 0) {
            nama_vendor = rfq[0]?.Vendor?.nama_vendor || null; // Ambil nama vendor jika ada
        }

        const billReference = await billService.findBillByReferenceRfq(data.referensi_rfq);
        const dataResponse = {
            id: data.id,
            referensi_rfq: data.referensi_rfq,
            referensi_bill: billReference.referensi_bill,
            nama_vendor,
            confirmation_date: data.confirmation_date,
            total_pembayaran: data.total_pembayaran,
            arrival_date: data.arrival_date,
            status: data.status,
            Bahan: rfq.map((item) => ({
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
    HandlerCreatePo,
    HandlerUpdatePo,
    HandlerDeletePo,
}