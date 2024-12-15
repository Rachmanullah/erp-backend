const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.findMany({});
        return purchaseOrder;
    } catch (error) {
        console.error("Error fetching purchase order:", error);
        throw error;
    }
}

const findByID = async (purchaseOrderID) => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            where: {
                id: purchaseOrderID
            },
        });
        return purchaseOrder;
    } catch (error) {
        console.error("Error fetching purchase order by Referensi:", error);
        throw error;
    }
}

const findByReferensiRfq = async (rfqReferensi) => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.findFirst({
            where: {
                referensi_rfq: rfqReferensi
            },
        });
        return purchaseOrder;
    } catch (error) {
        console.error("Error fetching purchase order by Referensi:", error);
        throw error;
    }
}

const create = async (data) => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.create({
            data: data,
        });
        return purchaseOrder;
    } catch (error) {
        console.error("Error creating purchase order:", error);
        throw error;
    }
}

const update = async (ID, data) => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.update({
            where: {
                id: ID,
            },
            data: data,
        });
        return purchaseOrder;
    } catch (error) {
        console.error("Error update purchase order:", error);
        throw error;
    }
}

const updateStatus = async (referensiRfq, data) => {
    try {
        const purchaseOrder = await prisma.purchaseOrder.update({
            where: {
                referensi_rfq: referensiRfq,
            },
            data: data,
        });
        return purchaseOrder;
    } catch (error) {
        console.error("Error update purchase order:", error);
        throw error;
    }
}

const destroy = async (ID) => {
    try {
        const deletedPO = await prisma.purchaseOrder.delete({
            where: {
                id: ID
            }
        });
        return deletedPO;
    } catch (error) {
        console.error("Error deleting purchase order by ID:", error);
        throw error;
    }
}

const destroybyReferensiRfq = async (referensiRfq) => {
    try {
        const deletedPO = await prisma.purchaseOrder.delete({
            where: {
                referensi_rfq: referensiRfq
            }
        });
        return deletedPO;
    } catch (error) {
        console.error("Error deleting purchase order by ID:", error);
        throw error;
    }
}


module.exports = {
    findAll,
    findByID,
    findByReferensiRfq,
    create,
    update,
    destroy,
    destroybyReferensiRfq,
    updateStatus
}