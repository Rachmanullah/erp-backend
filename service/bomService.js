const { bomModels } = require("../model");
const { cleanBoMData } = require("../utils/cleanDataBom");
const { validateBoM } = require("../utils/validationHelper");

const findAllBoM = async () => {
    try {
        return await bomModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBoMByID = async (bomID) => {
    try {
        return await bomModels.findByID(bomID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBoMByReference = async (reference) => {
    try {
        return await bomModels.findByReference(reference);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createBoM = async (bomData) => {
    try {
        const cleanedData = cleanBoMData(bomData);
        await validateBoM.validate(cleanedData, { abortEarly: false });

        return await bomModels.create(cleanedData);
    } catch (error) {
        throw error;
    }
}

const updateBoM = async (bomID, bomData) => {
    try {
        const cleanedData = cleanBoMData(bomData);
        await validateBoM.validate(cleanedData, { abortEarly: false });

        const bom = {
            ...bomData,
            jumlah_produk: parseInt(bomData.jumlah_produk),
            jumlah_bahan: parseInt(bomData.jumlah_bahan),
            total_biaya_produk: parseInt(bomData.total_biaya_produk),
            total_biaya_bahan: parseInt(bomData.total_biaya_bahan),
        }
        return await bomModels.update(bomID, bom);
    } catch (error) {
        throw error;
    }
}

const deleteBoM = async (referensi) => {
    try {
        return await bomModels.destroy(referensi);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

const updateBoMByReferensi = async (referensi, bomData) => {
    try {
        const cleanedData = cleanBoMData(bomData);
        await validateBoM.validate(cleanedData, { abortEarly: false });

        const existingBoM = await bomModels.findByReference(referensi);
        if (!existingBoM) throw new Error('BoM Not Found');

        const formattedData = {
            id_produk: existingBoM[0].id_produk,
            referensi: existingBoM[0].referensi,
            jumlah_produk: existingBoM[0].jumlah_produk,
            total_biaya_produk: existingBoM[0].total_biaya_produk,
            bahan: existingBoM.map((item) => ({
                id_bahan: item.Bahan.id,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya_bahan: item.total_biaya_bahan,
            })),
        };
        const incomingBahan = bomData.bahan;
        const existingBahan = formattedData.bahan;

        const bahanToAdd = incomingBahan.filter(
            (newBahan) => !existingBahan.some((oldBahan) => oldBahan.id_bahan === newBahan.id_bahan)
        );
        const bahanToUpdate = incomingBahan.filter((newBahan) =>
            existingBahan.some((oldBahan) => oldBahan.id_bahan === newBahan.id_bahan)
        );
        const bahanToDelete = existingBahan.filter(
            (oldBahan) => !incomingBahan.some((newBahan) => newBahan.id_bahan === oldBahan.id_bahan)
        );

        if (bahanToAdd.length > 0) {
            console.log('Adding');
            const rawData = {
                ...formattedData,
                bahan: bahanToAdd
            }

            await bomModels.create(rawData);
        }
        if (bahanToUpdate.length > 0) {
            console.log('Updating');
            for (const bahan of bahanToUpdate) {
                // Ambil data bahan yang ingin diperbarui
                const rawData = {
                    id_produk: formattedData.id_produk,
                    referensi: formattedData.referensi,
                    jumlah_produk: formattedData.jumlah_produk,
                    total_biaya_produk: formattedData.total_biaya_produk,
                    id_bahan: bahan.id_bahan,
                    jumlah_bahan: bahan.jumlah_bahan,
                    total_biaya_bahan: bahan.total_biaya_bahan,
                };

                await bomModels.update(formattedData.referensi, rawData);
            }
        }

        if (bahanToDelete.length > 0) {
            console.log('Deleting');

            const bahanIDsToDelete = bahanToDelete.map((bahan) => bahan.id_bahan);

            await bomModels.destroyMany(formattedData.referensi, bahanIDsToDelete);
        }

        return true;
    } catch (error) {
        console.error('Error in updateBoMByReferensi:', error.message);
        throw error;
    }
};


module.exports = {
    findAllBoM,
    findBoMByID,
    findBoMByReference,
    updateBoMByReferensi,
    createBoM,
    updateBoM,
    deleteBoM,
}