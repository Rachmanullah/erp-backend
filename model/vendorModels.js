const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const vendor = await prisma.vendor.findMany();
        return vendor;
    } catch (error) {
        console.error("Error fetching vendor:", error);
        throw error;
    }
}

const findByID = async (vendorID) => {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: {
                id: vendorID
            }
        });
        return vendor;
    } catch (error) {
        console.error("Error fetching vendor by ID:", error);
        throw error;
    }
}

const create = async (vendorData) => {
    try {
        const vendor = await prisma.vendor.create({
            data: vendorData
        });
        return vendor;
    } catch (error) {
        console.error("Error creating vendor:", error);
        throw error;
    }
}

const update = async (vendorID, vendorData) => {
    try {
        const vendor = await prisma.vendor.update({
            where: {
                id: vendorID
            },
            data: vendorData
        });
        return vendor;
    } catch (error) {
        console.error("Error updating vendor:", error);
        throw error;
    }
}

const destroy = async (vendorID) => {
    try {
        const deletedVendor = await prisma.vendor.delete({
            where: {
                id: vendorID
            }
        });
        return deletedVendor;
    } catch (error) {
        console.error("Error deleting vendor by ID:", error);
        throw error;
    }
}

module.exports = {
    findAll,
    findByID,
    create,
    update,
    destroy,
}