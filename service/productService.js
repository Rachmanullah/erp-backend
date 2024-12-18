const { productModels } = require("../model");
const { validateProduct } = require("../utils/validationHelper");

const findAllProduct = async () => {
    try {
        return await productModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findProductByID = async (productID) => {
    try {
        return await productModels.findByID(productID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createProduct = async (productData) => {
    try {
        const subValidate = validateProduct.pick(['nama_produk', 'kategori', 'harga_produk', 'biaya_produksi', 'gambar_produk']);
        await subValidate.validate(productData, { abortEarly: false });
        const lastProduk = await productModels.checkLastReferencedProduk();

        let newReference = 'P-0001';
        if (lastProduk) {
            const lastReference = lastProduk.referensi;
            const match = lastReference.match(/P-(\d+)/);
            if (match) {
                const lastNumber = parseInt(match[1], 10);
                const nextNumber = lastNumber + 1;
                newReference = `P-${nextNumber.toString().padStart(4, '0')}`;
            }
        }
        const newProduct = {
            ...productData,
            referensi: newReference,
            harga_produk: parseInt(productData.harga_produk),
            biaya_produksi: parseInt(productData.biaya_produksi),
            stok: 0,
        }
        return await productModels.create(newProduct);
    } catch (error) {
        throw error;
    }
}

const updateProduct = async (productID, productData) => {
    try {
        const subValidate = validateProduct.pick(['nama_produk', 'kategori', 'harga_produk', 'biaya_produksi', 'gambar_produk']);
        await subValidate.validate(productData, { abortEarly: false });

        const product = {
            ...productData,
            harga_produk: parseInt(productData.harga_produk),
            biaya_produksi: parseInt(productData.biaya_produksi),
        }
        return await productModels.update(productID, product);
    } catch (error) {
        throw error;
    }
}

const deleteProduct = async (productID) => {
    try {
        return await productModels.destroy(productID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

const countProduk = async () => {
    try {
        return await productModels.getCountProduk()
    } catch (error) {
        throw new Error('Error: ' + error.message);
    }
}

module.exports = {
    findAllProduct,
    findProductByID,
    createProduct,
    updateProduct,
    deleteProduct,
    countProduk,
}