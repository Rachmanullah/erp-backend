
const { rfqService, vendorService, bahanService } = require("../service");
const createPDF = require("../utils/generatePdf");
const responseHandler = require("../utils/responseHandler");
const fs = require("fs");

const HandlerGetAllRfq = async (req, res) => {
    try {
        const data = await rfqService.findAllRfq();
        // Kelompokkan data berdasarkan referensi rfq
        const groupedData = data.reduce((result, item) => {
            // Cari kelompok berdasarkan referensi rfq
            const rfqIndex = result.findIndex(rfq => rfq.referensi === item.referensi);

            if (rfqIndex === -1) {
                // Jika belum ada, buat kelompok baru
                result.push({
                    id_vendor: item.id_vendor,
                    referensi: item.referensi,
                    nama_vendor: item.Vendor.nama_vendor,
                    deadline_order: item.deadline_order,
                    status: item.status,
                    bahan: [
                        {
                            id_bahan: item.Bahan.id,
                            nama_bahan: item.Bahan.nama_bahan,
                            biaya_bahan: item.Bahan.biaya_bahan,
                            jumlah_bahan: item.jumlah_bahan,
                            total_biaya: item.total_biaya,
                        },
                    ],
                });
            } else {
                // Jika sudah ada, tambahkan bahan ke kelompok yang sesuai
                result[rfqIndex].bahan.push({
                    id_bahan: item.Bahan.id,
                    nama_bahan: item.Bahan.nama_bahan,
                    biaya_bahan: item.Bahan.biaya_bahan,
                    jumlah_bahan: item.jumlah_bahan,
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

const HandlerGetRfqByReference = async (req, res) => {
    try {
        const { referensi } = req.params;

        const data = await rfqService.findRfqByReference(referensi);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);

        const formattedData = {
            id_vendor: data[0].id_vendor,
            referensi: data[0].referensi,
            nama_vendor: data[0].Vendor.nama_vendor,
            deadline_order: data[0].deadline_order,
            status: data[0].status,
            Bahan: data.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, formattedData, 'get data by reference Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateRfq = async (req, res) => {
    try {
        const data = req.body;
        console.log('Request Data:', JSON.stringify(data, null, 2));

        const vendor = await vendorService.findVendorByID(parseInt(data.id_vendor));
        if (!vendor) return responseHandler.error(res, 'Product Not Found', 404);

        const createdData = await rfqService.createRfq(data);

        return responseHandler.success(res, createdData, 'Create RFQ Success', 201);
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

const HandlerUpdateRfq = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = req.body;

        if (!data || !Array.isArray(data.bahan)) {
            return responseHandler.error(res, 'Invalid data format.', 400);
        }

        const vendor = await vendorService.findVendorByID(parseInt(data.id_vendor));
        if (!vendor) return responseHandler.error(res, 'Product Not Found', 404);

        const result = await rfqService.updateRfqByReferensi(referensi, data);

        return responseHandler.success(res, result, 'BoM updated successfully', 200);
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

const HandlerDeleteRfq = async (req, res) => {
    try {
        const { referensi } = req.params;
        const checkData = await rfqService.findRfqByReference(referensi);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await rfqService.deleteRfq(referensi);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerUpdateStatusRfq = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = req.body;

        const checkData = await rfqService.findRfqByReference(referensi);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);

        const result = await rfqService.updateStatusRfq(referensi, data);

        const formattedData = {
            id_vendor: result[0].id_vendor,
            referensi: result[0].referensi,
            nama_vendor: result[0].Vendor.nama_vendor,
            deadline_order: result[0].deadline_order,
            status: result[0].status,
            Bahan: result.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        return responseHandler.success(res, formattedData, 'update data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerPrintRfq = async (req, res) => {
    try {
        const { referensi } = req.params;

        const data = await rfqService.findRfqByReference(referensi);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);

        const formattedData = {
            id_vendor: data[0].id_vendor,
            referensi: data[0].referensi,
            nama_vendor: data[0].Vendor.nama_vendor,
            deadline_order: data[0].deadline_order,
            status: data[0].status,
            Bahan: data.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        // Generate PDF
        const pdfBuffer = await createPDF(formattedData);
        console.log("PDF Buffer Length:", pdfBuffer.length);
        // fs.writeFileSync(`./RFQ #${formattedData.referensi}.pdf`, pdfBuffer);
        // Kirimkan PDF ke response
        // Encode PDF buffer to Base64
        const pdfBase64 = pdfBuffer.toString('base64');

        // Send response with JSON containing formattedData and PDF
        res.json({
            success: true,
            message: "PDF generated successfully",
            data: formattedData,
            pdf: pdfBase64,
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllRfq,
    HandlerGetRfqByReference,
    HandlerCreateRfq,
    HandlerUpdateRfq,
    HandlerDeleteRfq,
    HandlerUpdateStatusRfq,
    HandlerPrintRfq
}