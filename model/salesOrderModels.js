const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const salesOrder = await prisma.salesOrder.findMany({});
        return salesOrder;
    } catch (error) {
        console.error("Error fetching sales order:", error);
        throw error;
    }
}

const findByID = async (salesOrderID) => {
    try {
        const salesOrder = await prisma.salesOrder.findUnique({
            where: {
                id: salesOrderID
            },
        });
        return salesOrder;
    } catch (error) {
        console.error("Error fetching sales order by Referensi:", error);
        throw error;
    }
}

const findByReferensiQuotation = async (quotationReferensi) => {
    try {
        const salesOrder = await prisma.salesOrder.findFirst({
            where: {
                referensi_quotation: quotationReferensi
            },
        });
        return salesOrder;
    } catch (error) {
        console.error("Error fetching sales order by Referensi:", error);
        throw error;
    }
}

const create = async (data) => {
    try {
        const salesOrder = await prisma.salesOrder.create({
            data: data,
        });
        return salesOrder;
    } catch (error) {
        console.error("Error creating sales order:", error);
        throw error;
    }
}

const update = async (ID, data) => {
    try {
        const salesOrder = await prisma.salesOrder.update({
            where: {
                id: ID,
            },
            data: data,
        });
        return salesOrder;
    } catch (error) {
        console.error("Error update sales order:", error);
        throw error;
    }
}

const updateStatus = async (referensiQuotation, data) => {
    try {
        const salesOrder = await prisma.salesOrder.update({
            where: {
                referensi_quotation: referensiQuotation,
            },
            data: data,
        });
        return salesOrder;
    } catch (error) {
        console.error("Error update sales order:", error);
        throw error;
    }
}

const destroy = async (ID) => {
    try {
        const deletedPO = await prisma.salesOrder.delete({
            where: {
                id: ID
            }
        });
        return deletedPO;
    } catch (error) {
        console.error("Error deleting sales order by ID:", error);
        throw error;
    }
}

const destroybyReferensiQuotation = async (referensiQuotation) => {
    try {
        const deleteData = await prisma.salesOrder.delete({
            where: {
                referensi_quotation: referensiQuotation
            }
        });
        return deleteData;
    } catch (error) {
        console.error("Error deleting purchase order by ID:", error);
        throw error;
    }
}


module.exports = {
    findAll,
    findByID,
    findByReferensiQuotation,
    create,
    update,
    destroy,
    destroybyReferensiQuotation,
    updateStatus
}