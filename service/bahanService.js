const { bahanModels } = require("../model");
const { validateBahan } = require("../utils/validationHelper");

const findAllBahan = async () => {
    try {
        return await bahanModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBahanByID = async (bahanID) => {
    try {
        return await bahanModels.findByID(bahanID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createBahan = async (bahanData) => {
    try {
        const subValidate = validateBahan.pick(['nama_bahan', 'harga_bahan', 'biaya_bahan', 'gambar_bahan']);
        await subValidate.validate(bahanData, { abortEarly: false });
        const newBahan = {
            ...bahanData,
            biaya_bahan: parseInt(bahanData.biaya_bahan),
            harga_bahan: parseInt(bahanData.harga_bahan),
        }

        return await bahanModels.create(newBahan);
    } catch (error) {
        throw error;
    }
}

const updateBahan = async (bahanID, bahanData) => {
    try {
        const subValidate = validateBahan.pick(['nama_bahan', 'harga_bahan', 'biaya_bahan', 'gambar_bahan']);
        await subValidate.validate(bahanData, { abortEarly: false });
        const bahan = {
            ...bahanData,
            biaya_bahan: parseInt(bahanData.biaya_bahan),
            harga_bahan: parseInt(bahanData.harga_bahan),
        }
        return await bahanModels.update(bahanID, bahan);
    } catch (error) {
        throw error;
    }
}

const deleteBahan = async (bahanID) => {
    try {
        return await bahanModels.destroy(bahanID);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

module.exports = {
    findAllBahan,
    findBahanByID,
    createBahan,
    updateBahan,
    deleteBahan,
}