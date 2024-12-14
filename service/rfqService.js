const { rfqModels, bahanModels } = require("../model");
const { cleanRfqData } = require("../utils/cleanData");
const { validateRfq } = require("../utils/validationHelper");

const findAllRfq = async () => {
    try {
        return await rfqModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findRfqByReference = async (reference) => {
    try {
        return await rfqModels.findByReferensi(reference);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createRfq = async (RfqData) => {
    try {
        const cleanedData = cleanRfqData(RfqData);
        await validateRfq.validate(cleanedData, { abortEarly: false });
        console.log(cleanedData)
        const data = {
            ...cleanedData,
            status: "RFQ"
        }
        return await rfqModels.create(data);
    } catch (error) {
        throw error;
    }
}

const updateRfqByReferensi = async (referensi, RfqData) => {
    try {
        const cleanedData = cleanRfqData(RfqData);
        await validateRfq.validate(cleanedData, { abortEarly: false });

        const existingRfq = await rfqModels.findByReferensi(referensi);
        if (!existingRfq) throw new Error('rfq Not Found');

        const formattedData = {
            id_vendor: existingRfq[0].id_vendor,
            referensi: existingRfq[0].referensi,
            nama_vendor: existingRfq[0].Vendor.nama_vendor,
            deadline_order: existingRfq[0].deadline_order,
            status: existingRfq[0].status,
            bahan: existingRfq.map((item) => ({
                id_bahan: item.Bahan.id,
                nama_bahan: item.Bahan.nama_bahan,
                biaya_bahan: item.Bahan.biaya_bahan,
                jumlah_bahan: item.jumlah_bahan,
                total_biaya: item.total_biaya,
            })),
        };

        const incomingBahan = RfqData.bahan;
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

        console.log('bahanToAdd', bahanToAdd);
        console.log('bahanToupdate', bahanToUpdate);
        console.log('bahanToDelete', bahanToDelete);

        if (bahanToAdd.length > 0) {
            console.log('Adding');
            const rawData = {
                ...formattedData,
                bahan: bahanToAdd
            }

            await rfqModels.create(rawData);
        }
        if (bahanToUpdate.length > 0) {
            console.log('Updating');
            for (const bahan of bahanToUpdate) {
                // Ambil data bahan yang ingin diperbarui
                const rawData = {
                    id_vendor: parseInt(formattedData.id_vendor),
                    referensi: formattedData.referensi,
                    deadline_order: new Date(formattedData.deadline_order.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })),
                    status: formattedData.status,
                    id_bahan: parseInt(bahan.id_bahan),
                    jumlah_bahan: parseInt(bahan.jumlah_bahan),
                    total_biaya: parseInt(bahan.total_biaya),
                };

                await rfqModels.update(formattedData.referensi, rawData);
            }
        }

        if (bahanToDelete.length > 0) {
            console.log('Deleting');

            const bahanIDsToDelete = bahanToDelete.map((bahan) => bahan.id_bahan);

            await rfqModels.destroyMany(formattedData.referensi, bahanIDsToDelete);
        }

        return true;
    } catch (error) {
        console.error('Error in updateBoMByReferensi:', error.message);
        throw error;
    }
};

const updateStatusRfq = async (referensiRfq, updatedStatus) => {
    try {
        // Validasi status
        await validateRfq.validateAt('status', updatedStatus);

        // Ambil data RFQ berdasarkan referensi
        const rfqData = await rfqModels.findByReferensi(referensiRfq);

        // Mapping data RFQ ke format yang diperlukan
        const rfqBahan = rfqData.map((item) => ({
            id_bahan: item.Bahan.id,
            nama_bahan: item.Bahan.nama_bahan,
            biaya_bahan: item.Bahan.biaya_bahan,
            jumlah_bahan: item.jumlah_bahan,
            total_biaya: item.total_biaya,
        }));

        // Jika status adalah 'Validated'
        if (updatedStatus.status === 'Validated') {
            for (const bahan of rfqBahan) {
                // Ambil stok bahan saat ini
                const currentBahan = await bahanModels.findByID(bahan.id_bahan);

                if (!currentBahan) {
                    throw new Error(`Bahan dengan ID ${bahan.id_bahan} tidak ditemukan.`);
                }

                // Log nilai sebelum operasi
                console.log("currentBahan.jumlah_bahan:", currentBahan.jumlah_bahan);
                console.log("bahan.jumlah_bahan:", bahan.jumlah_bahan);

                // Hitung jumlah bahan baru
                const updatedJumlahBahan =
                    (Number(currentBahan.jumlah_bahan) || 0) + (Number(bahan.jumlah_bahan) || 0);

                // Log hasil perhitungan
                console.log(`Bahan: ${currentBahan.nama_bahan}, Jumlah Baru: ${updatedJumlahBahan}`);

                // Perbarui stok bahan
                await bahanModels.updateStok(bahan.id_bahan, updatedJumlahBahan);
            }

        }

        // Jika status adalah 'Return'
        if (updatedStatus.status === 'Return') {
            for (const bahan of rfqBahan) {
                // Ambil stok bahan saat ini
                const currentBahan = await bahanModels.findByID(bahan.id_bahan);

                if (!currentBahan) {
                    throw new Error(`Bahan dengan ID ${bahan.id_bahan} tidak ditemukan.`);
                }

                // Hitung jumlah bahan yang dikembalikan
                const updatedJumlahBahan =
                    (Number(currentBahan.stok) || 0) - (Number(bahan.jumlah_bahan) || 0);

                // // Perbarui stok bahan
                await bahanModels.updateStok(bahan.id_bahan, updatedJumlahBahan);
            }
        }

        // Update status RFQ
        return await rfqModels.updateStatusRfq(referensiRfq, updatedStatus);
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

const deleteRfq = async (referensi) => {
    try {
        return await rfqModels.destroy(referensi);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}


module.exports = {
    findAllRfq,
    findRfqByReference,
    createRfq,
    updateRfqByReferensi,
    deleteRfq,
    updateStatusRfq
};