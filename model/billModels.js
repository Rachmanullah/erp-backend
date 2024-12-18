const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const bill = await prisma.billPurchase.findMany();
        return bill;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}

const findByID = async (billID) => {
    try {
        const bill = await prisma.billPurchase.findUnique({
            where: {
                id: billID
            },
        });
        return bill;
    } catch (error) {
        console.error("Error fetching by id:", error);
        throw error;
    }
}

const findByReferensiRfq = async (rfqReferensi) => {
    try {
        const bill = await prisma.billPurchase.findUnique({
            where: {
                referensi_rfq: rfqReferensi
            },
        });
        return bill;
    } catch (error) {
        console.error("Error fetching bill by Referensi:", error);
        throw error;
    }
}

const checkLastReferencedBill = async () => {
    try {
        const bill = await prisma.billPurchase.findFirst({
            orderBy: {
                referensi_bill: 'desc',
            },
        });
        return bill;
    } catch (error) {
        console.error("Error checking last referenced bill:", error);
        throw error;
    }
}


const findByReferensiBill = async (billReferensi) => {
    try {
        const bill = await prisma.billPurchase.findUnique({
            where: {
                referensi_bill: billReferensi
            },
        });
        return bill;
    } catch (error) {
        console.error("Error fetching bill by Referensi:", error);
        throw error;
    }
}

const create = async (data) => {
    try {
        const bill = await prisma.billPurchase.create({
            data: data,
        });
        return bill;
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
}

const update = async (ID, data) => {
    try {
        const bill = await prisma.billPurchase.update({
            where: {
                id: ID,
            },
            data: data,
        });
        return bill;
    } catch (error) {
        console.error("Error update bill:", error);
        throw error;
    }
}

const destroy = async (ID) => {
    try {
        const deletedBill = await prisma.billPurchase.delete({
            where: {
                id: ID
            }
        });
        return deletedBill;
    } catch (error) {
        console.error("Error deleting bill by ID:", error);
        throw error;
    }
}

const destroybyReferensiRfq = async (referensiRfq) => {
    try {
        const deletedData = await prisma.billPurchase.delete({
            where: {
                referensi_rfq: referensiRfq
            }
        });
        return deletedData;
    } catch (error) {
        console.error("Error deleting purchase order by ID:", error);
        throw error;
    }
}

const updateStatusBill = async (referensi, statusBill) => {
    try {
        const updateStatus = await prisma.billPurchase.update({
            where: {
                referensi_rfq: referensi
            },
            data: { status: statusBill.status }
        });

        return updateStatus;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

module.exports = {
    findAll,
    findByID,
    findByReferensiRfq,
    findByReferensiBill,
    checkLastReferencedBill,
    create,
    update,
    destroy,
    destroybyReferensiRfq,
    updateStatusBill
}