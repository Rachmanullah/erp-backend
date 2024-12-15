const { billModels, purchaseOrderModels } = require("../model");

const findAllBill = async () => {
    try {
        return await billModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBillById = async (id) => {
    try {
        return await billModels.findByID(id);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBillByReferenceRfq = async (referenceRfq) => {
    try {
        return await billModels.findByReferensiRfq(referenceRfq);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findBillByReferenceBill = async (referenceBill) => {
    try {
        return await billModels.findByReferensiBill(referenceBill);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createBill = async (data) => {
    try {
        return await billModels.create(data);
    } catch (error) {
        throw new Error('Error creating data: ' + error.message);
    }
}

const updateBill = async (id, data) => {
    try {
        return await billModels.update(id, data);
    } catch (error) {
        throw new Error('Error updating data: ' + error.message);
    }
}

const deleteBill = async (id) => {
    try {
        const deletedBill = await billModels.findByID(id);
        if (!deletedBill) {
            throw new Error('Bill not found');
        }
        return await deletedBill.destroy();
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

const updateStatusBill = async (billID, updatedStatus) => {
    try {
        const billData = await billModels.findByID(billID);
        if (!billData) {
            throw new Error('Bill not found');
        }

        if (updatedStatus.status === 'Posted') {
            await billModels.update(billID, { bill_date: new Date() });
        }

        if (updatedStatus.status === 'Paid') {
            await purchaseOrderModels.updateStatus(billData.referensi_rfq, { status: 'Fully Billed' });
        }

        return await billModels.update(billData.id, updatedStatus);
    } catch (error) {
        console.error("Error:", error.message);
        throw error;
    }
}

module.exports = {
    findAllBill,
    findBillById,
    findBillByReferenceRfq,
    findBillByReferenceBill,
    createBill,
    updateBill,
    deleteBill,
    updateStatusBill
}