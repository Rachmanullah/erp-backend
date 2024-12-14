
const { bomService, productService, bahanService } = require("../service");
const responseHandler = require("../utils/responseHandler");

const HandlerGetAllBoM = async (req, res) => {
    try {
        const data = await bomService.findAllBoM();

        // Kelompokkan data berdasarkan referensi_bom
        const groupedData = data.reduce((result, item) => {
            // Cari kelompok berdasarkan referensi_bom
            const bomIndex = result.findIndex(bom => bom.referensi_bom === item.referensi);

            if (bomIndex === -1) {
                // Jika belum ada, buat kelompok baru
                result.push({
                    id_produk: item.id_produk,
                    referensi_bom: item.referensi,
                    referensi_produk: item.Product.referensi,
                    nama_produk: item.Product.nama_produk,
                    jumlah_produk: item.jumlah_produk,
                    total_biaya_produk: item.total_biaya_produk,
                    biaya_produksi: item.Product.biaya_produksi,
                    bahan: [
                        {
                            id_bahan: item.Bahan.id,
                            nama_bahan: item.Bahan.nama_bahan,
                            biaya_bahan: item.Bahan.biaya_bahan,
                            jumlah_bahan: item.jumlah_bahan,
                            total_biaya_bahan: item.total_biaya_bahan,
                        },
                    ],
                });
            } else {
                // Jika sudah ada, tambahkan bahan ke kelompok yang sesuai
                result[bomIndex].bahan.push({
                    id_bahan: item.Bahan.id,
                    nama_bahan: item.Bahan.nama_bahan,
                    biaya_bahan: item.Bahan.biaya_bahan,
                    jumlah_bahan: item.jumlah_bahan,
                    total_biaya_bahan: item.total_biaya_bahan,
                });
            }

            return result;
        }, []);

        return responseHandler.success(res, groupedData, 'Get all data success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
};


const HandlerGetBoMById = async (req, res) => {
    try {
        const { id } = parseInt(req.params.id);
        const data = await bomService.findBoMByID(id);
        if (!data) return responseHandler.error(res, 'Data Not Found', 404);
        return responseHandler.success(res, data, 'get data by id Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerGetBoMByReference = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = await bomService.findBoMByReference(referensi);

        if (!data) return responseHandler.error(res, 'Data Not Found', 404);

        const formattedData = {
            id_produk: data[0].id_produk,
            referensi_bom: data[0].referensi,
            referensi_produk: data[0].Product.referensi,
            nama_produk: data[0].Product.nama_produk,
            jumlah_produk: data[0].jumlah_produk,
            total_biaya_produk: data[0].total_biaya_produk,
            biaya_produksi: data[0].Product.biaya_produksi,
            bahan: data.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya_bahan: item.total_biaya_bahan,
            })),
        };

        return responseHandler.success(res, formattedData, 'get data by reference Success');
    } catch (error) {
        console.error('Error:', error.message);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

const HandlerCreateBoM = async (req, res) => {
    try {
        const data = req.body;
        console.log('Request Data:', JSON.stringify(data, null, 2));

        const product = await productService.findProductByID(parseInt(data.id_produk));
        if (!product) return responseHandler.error(res, 'Product Not Found', 404);

        const bahanPromises = data.bahan.map(async (item) => {
            const bahan = await bahanService.findBahanByID(parseInt(item.id_bahan));
            if (!bahan) throw new Error(`Bahan with ID ${item.id_bahan} not found`);
            return {
                id_bahan: bahan.id,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya_bahan: bahan.biaya_bahan * item.jumlah_bahan,
            };
        });

        let newBahan;
        try {
            newBahan = await Promise.all(bahanPromises);
        } catch (error) {
            console.error('Error Processing Bahan:', error.message);
            return responseHandler.error(res, error.message, 404);
        }

        const countTotalBiayaProduct = product.biaya_produksi * data.jumlah_produk;

        const bomData = {
            ...data,
            total_biaya_produk: countTotalBiayaProduct,
            bahan: newBahan,
        };

        const createdData = await bomService.createBoM(bomData);

        return responseHandler.success(res, createdData, 'Create BoM Success', 201);
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

const HandlerUpdateBoM = async (req, res) => {
    try {
        const { referensi } = req.params;
        const data = req.body;

        if (!data || !Array.isArray(data.bahan)) {
            return responseHandler.error(res, 'Invalid data format.', 400);
        }

        const existingBoM = await bomService.findBoMByReference(referensi);
        if (!existingBoM) {
            return responseHandler.error(res, 'BoM Not Found', 404);
        }

        const bahanPromises = data.bahan.map(async (item) => {
            const bahan = await bahanService.findBahanByID(parseInt(item.id_bahan));
            if (!bahan) {
                throw new Error(`Bahan with ID ${item.id_bahan} not found`);
            }
            return {
                id_bahan: bahan.id,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya_bahan: bahan.biaya_bahan * item.jumlah_bahan,
            };
        });

        let updatedBahan;
        try {
            updatedBahan = await Promise.all(bahanPromises);
        } catch (error) {
            console.error('Error Processing Bahan:', error.message);
            return responseHandler.error(res, error.message, 404);
        }

        const product = await productService.findProductByID(parseInt(data.id_produk));
        if (!product) {
            return responseHandler.error(res, 'Product Not Found', 404);
        }
        const countTotalBiayaProduct = product.biaya_produksi * data.jumlah_produk;

        const updatedBoMData = {
            ...data,
            total_biaya_produk: countTotalBiayaProduct,
            bahan: updatedBahan,
        };

        const result = await bomService.updateBoMByReferensi(referensi, updatedBoMData);

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

const HandlerDeleteBoM = async (req, res) => {
    try {
        const { referensi } = req.params;
        const checkData = await bomService.findBoMByReference(referensi);
        if (!checkData) return responseHandler.error(res, 'Data Not Found', 404);
        await bomService.deleteBoM(referensi);
        return responseHandler.success(res, null, 'delete data Success');
    } catch (error) {
        console.error('Unexpected Error:', error);
        return responseHandler.error(res, 'Internal Server Error', 500);
    }
}

module.exports = {
    HandlerGetAllBoM,
    HandlerGetBoMById,
    HandlerGetBoMByReference,
    HandlerCreateBoM,
    HandlerUpdateBoM,
    HandlerDeleteBoM,
}