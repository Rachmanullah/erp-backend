const { quotationModels, productModels, salesOrderModels, salesInvoiceModels, customerModels } = require("../model");
const { cleanQuotationData } = require("../utils/cleanData");
const { sendQuotationEmail } = require("../utils/emailUtils");
const { validateQuotation } = require("../utils/validationHelper");

const findAllQuotation = async () => {
    try {
        return await quotationModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findQuotationByReference = async (reference) => {
    try {
        return await quotationModels.findByReferensi(reference);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createQuotation = async (quotationData) => {
    try {
        const cleanedData = cleanQuotationData(quotationData);
        await validateQuotation.validate(cleanedData, { abortEarly: false });
        const lastOrder = await quotationModels.checkLastReferencedQuotation();
        let newReference = 'SQ-0001'; // Default jika tidak ada order sebelumnya
        if (lastOrder) {
            const lastReference = lastOrder.referensi;
            const match = lastReference.match(/SQ-(\d+)/); // Ekstrak angka dari referensi terakhir
            if (match) {
                const lastNumber = parseInt(match[1], 10); // Convert angka terakhir ke integer
                const nextNumber = lastNumber + 1; // Tambahkan 1 untuk referensi baru
                newReference = `SQ-${nextNumber.toString().padStart(4, '0')}`; // Format jadi MO/XXXX
            }
        }
        const data = {
            ...cleanedData,
            status: "Quotation",
            referensi: newReference,
        }
        return await quotationModels.create(data);
    } catch (error) {
        throw error;
    }
}

const updateQuotationByReferensi = async (referensi, quotationData) => {
    try {
        const cleanedData = cleanQuotationData(quotationData);
        await validateQuotation.validate(cleanedData, { abortEarly: false });

        const existingQuotation = await quotationModels.findByReferensi(referensi);
        if (!existingQuotation) throw new Error('rfq Not Found');

        const formattedData = {
            id_customer: existingQuotation[0].id_customer,
            referensi: existingQuotation[0].referensi,
            nama_customer: existingQuotation[0].Customer.nama_customer,
            order_date: existingQuotation[0].order_date,
            status: existingQuotation[0].status,
            produk: existingQuotation.map((item) => ({
                id_produk: item.Produk.id,
                nama_produk: item.Produk.nama_produk,
                harga_produk: item.Produk.harga_produk,
                jumlah_produk: item.jumlah_produk,
                total_biaya: item.total_biaya,
            })),
        };

        const incomingProduk = quotationData.produk;
        const existingProduk = formattedData.produk;

        const produkToAdd = incomingProduk.filter(
            (newProduk) => !existingProduk.some((oldProduk) => oldProduk.id_produk === newProduk.id_produk)
        );
        const produkToUpdate = incomingProduk.filter((newProduk) =>
            existingProduk.some((oldProduk) => oldProduk.id_produk === newProduk.id_produk)
        );
        const produkToDelete = existingProduk.filter(
            (oldProduk) => !incomingProduk.some((newProduk) => newProduk.id_produk === oldProduk.id_produk)
        );

        if (produkToAdd.length > 0) {
            console.log('Adding');
            const rawData = {
                ...formattedData,
                produk: produkToAdd
            }

            await quotationModels.create(rawData);
        }
        if (produkToUpdate.length > 0) {
            console.log('Updating');
            for (const produk of produkToUpdate) {
                // Ambil data produk yang ingin diperbarui
                const rawData = {
                    id_customer: parseInt(formattedData.id_customer),
                    referensi: formattedData.referensi,
                    order_date: new Date(formattedData.order_date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })),
                    status: formattedData.status,
                    id_produk: parseInt(produk.id_produk),
                    jumlah_produk: parseInt(produk.jumlah_produk),
                    total_biaya: parseInt(produk.total_biaya),
                };

                await quotationModels.update(formattedData.referensi, rawData);
            }
        }

        if (produkToDelete.length > 0) {
            console.log('Deleting');

            const produkIDsToDelete = produkToDelete.map((produk) => produk.id_produk);

            await quotationModels.destroyMany(formattedData.referensi, produkIDsToDelete);
        }

        return true;
    } catch (error) {
        console.error('Error in updateQuotation:', error.message);
        throw error;
    }
};

const updateStatusQuotation = async (referensiQuotation, updatedStatus) => {
    try {
        // Validasi status
        await validateQuotation.validateAt('status', updatedStatus);

        // Ambil data QUotation berdasarkan referensi
        const quotationData = await quotationModels.findByReferensi(referensiQuotation);

        // Mapping data Quotation ke format yang diperlukan
        const quotationProduk = quotationData.map((item) => ({
            id_produk: item.Produk.id,
            referensi: item.referensi,
            nama_produk: item.Produk.nama_produk,
            harga_produk: item.Produk.harga_produk,
            jumlah_produk: item.jumlah_produk,
            total_biaya: item.total_biaya,
        }));

        const customerInfo = await customerModels.findByID(quotationData[0].id_customer);

        if (updatedStatus.status === 'Quotation Sent') {
            let totalPembayaran = 0;

            for (const produk of quotationProduk) {
                totalPembayaran += Number(produk.total_biaya) || 0;
            }

            sendQuotationEmail(referensiQuotation, quotationProduk, totalPembayaran, customerInfo.email, customerInfo)
        }


        //status Received
        if (updatedStatus.status === 'Delivery') {

            let totalPembayaran = 0;

            for (const produk of quotationProduk) {
                totalPembayaran += Number(produk.total_biaya) || 0;
            }

            const dataSalesOrder = {
                referensi_quotation: referensiQuotation,
                confirmation_date: new Date(),
                total_pembayaran: parseInt(totalPembayaran),
                status: "Nothing to Invoice",
            }

            await salesOrderModels.create(dataSalesOrder);

            const lastInvoice = await salesInvoiceModels.checkLastReferencedinvoice();
            let nextNumber = 1;
            const today = new Date().toISOString().split('T')[0];
            if (lastInvoice) {
                const lastReferensi = lastInvoice.referensi_invoice;
                const lastNumber = parseInt(lastReferensi.split('/').pop()); // Ambil nomor terakhir
                nextNumber = lastNumber + 1;
            }

            const referensiInvoice = `INV/${today}/${nextNumber}`;
            const dataInvoice = {
                referensi_quotation: referensiQuotation,
                referensi_invoice: referensiInvoice,
                accounting_date: new Date(),
                total_pembayaran: parseInt(totalPembayaran),
                status: "Draft",
            }

            await salesInvoiceModels.create(dataInvoice);
        }

        //status Received
        if (updatedStatus.status === 'Received') {
            const salesOrder = await salesOrderModels.findByReferensiQuotation(referensiQuotation);
            await salesOrderModels.update(salesOrder.id, { arrival_date: new Date() });
        }

        // Jika status adalah 'Sales Order'
        if (updatedStatus.status === 'Sales Order') {
            let totalPembayaran = 0;
            for (const produk of quotationProduk) {
                // Ambil stok produk saat ini
                const currentProduk = await productModels.findByID(produk.id_produk);

                if (!currentProduk) {
                    throw new Error(`produk dengan ID ${produk.id_produk} tidak ditemukan.`);
                }

                // Hitung jumlah produk baru
                const updatedJumlahProduk = (Number(currentProduk.stok) || 0) - (Number(produk.jumlah_produk) || 0);

                // Perbarui stok produk
                await productModels.updateStok(produk.id_produk, updatedJumlahProduk);

                totalPembayaran += Number(produk.total_biaya) || 0;
            }
            const salesOrder = await salesOrderModels.findByReferensiQuotation(referensiQuotation);
            await salesOrderModels.update(salesOrder.id, { status: 'To Invoice' });
        }

        if (updatedStatus.status === 'Cancel') {
            await salesInvoiceModels.updateStatusInvoice(referensiQuotation, { status: "Cancel" });
            await salesOrderModels.updateStatus(referensiQuotation, { status: "Cancel" });
        }

        // Jika status adalah 'Return'
        if (updatedStatus.status === 'Return') {
            for (const produk of quotationProduk) {
                // Ambil stok bahan saat ini
                const currentProduk = await productModels.findByID(produk.id_produk);

                if (!currentProduk) {
                    throw new Error(`produk dengan ID ${produk.id_produk} tidak ditemukan.`);
                }

                // Hitung jumlah produk yang dikembalikan
                const updatedJumlahProduk =
                    (Number(currentProduk.stok) || 0) + (Number(produk.jumlah_produk) || 0);

                // // Perbarui stok produk
                await productModels.updateStok(produk.id_produk, updatedJumlahProduk);
            }

            await salesInvoiceModels.updateStatusInvoice(referensiQuotation, { status: "Draft" });
            await salesOrderModels.updateStatus(referensiQuotation, { status: "To Invoice" });
        }

        // Update status Quotation
        return await quotationModels.updateStatusQuotation(referensiQuotation, updatedStatus);
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
};

const deleteQuotation = async (referensi) => {
    try {
        const salesOrder = await salesOrderModels.findByReferensiQuotation(referensi);
        salesOrder && await salesOrderModels.destroybyReferensiQuotation(referensi);
        return await quotationModels.destroy(referensi);
    } catch (error) {
        throw new Error('Error delete data: ' + error.message);
    }
}

const countQuotation = async () => {
    try {
        return await quotationModels.getCountQuotation()
    } catch (error) {
        throw new Error('Error: ' + error.message);
    }
}

const getProdukTeratas = async () => {
    try {
        return await quotationModels.getMostFrequentProductId();
    } catch (error) {
        throw new Error('Error: ' + error.message);
    }
}

module.exports = {
    findAllQuotation,
    findQuotationByReference,
    createQuotation,
    updateQuotationByReferensi,
    deleteQuotation,
    updateStatusQuotation,
    countQuotation,
    getProdukTeratas,
};