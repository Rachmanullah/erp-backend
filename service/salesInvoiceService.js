const { salesInvoiceModels, salesOrderModels } = require("../model");

const findAllSalesInvoice = async () => {
    try {
        return await salesInvoiceModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findSalesInvoiceById = async (id) => {
    try {
        return await salesInvoiceModels.findByID(id);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findSalesInvoiceByReferenceQuotation = async (referenceQuotation) => {
    try {
        return await salesInvoiceModels.findByReferensiQuotation(referenceQuotation);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findSalesInvoiceByReferenceInvoice = async (referenceInvoice) => {
    try {
        return await salesInvoiceModels.findByReferensiInvoice(referenceInvoice);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createSalesInvoice = async (data) => {
    try {
        return await salesInvoiceModels.create(data);
    } catch (error) {
        throw new Error('Error creating data: ' + error.message);
    }
}

const updateSalesInvoice = async (id, data) => {
    try {
        return await salesInvoiceModels.update(id, data);
    } catch (error) {
        throw new Error('Error updating data: ' + error.message);
    }
}

const deleteSalesInvoice = async (id) => {
    try {
        const deletedSalesInvoice = await salesInvoiceModels.findByID(id);
        if (!deletedSalesInvoice) {
            throw new Error('Bill not found');
        }
        return await deletedSalesInvoice.destroy();
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

const updateStatusSalesInvoice = async (salesInvoiceID, updatedStatus) => {
    try {
        const invoiceData = await salesInvoiceModels.findByID(salesInvoiceID);
        if (!invoiceData) {
            throw new Error('Bill not found');
        }

        if (updatedStatus.status === 'Posted') {
            await salesInvoiceModels.update(salesInvoiceID, { invoice_date: new Date() });
        }

        if (updatedStatus.status === 'Paid') {
            await salesOrderModels.updateStatus(invoiceData.referensi_quotation, { status: 'Fully Invoiced' });
        }

        return await salesInvoiceModels.update(invoiceData.id, updatedStatus);
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

module.exports = {
    findAllSalesInvoice,
    findSalesInvoiceById,
    findSalesInvoiceByReferenceQuotation,
    findSalesInvoiceByReferenceInvoice,
    createSalesInvoice,
    updateSalesInvoice,
    deleteSalesInvoice,
    updateStatusSalesInvoice
}