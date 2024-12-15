const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const customer = await prisma.customer.findMany();
        return customer;
    } catch (error) {
        console.error("Error fetching customer:", error);
        throw error;
    }
}

const findByID = async (customerID) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                id: customerID
            }
        });
        return customer;
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error;
    }
}

const create = async (customerData) => {
    try {
        const customer = await prisma.customer.create({
            data: customerData
        });
        return customer;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
}

const update = async (customerID, customerData) => {
    try {
        const customer = await prisma.customer.update({
            where: {
                id: customerID
            },
            data: customerData
        });
        return customer;
    } catch (error) {
        console.error("Error updating customer:", error);
        throw error;
    }
}

const destroy = async (customerID) => {
    try {
        const deletedcustomer = await prisma.customer.delete({
            where: {
                id: customerID
            }
        });
        return deletedcustomer;
    } catch (error) {
        console.error("Error deleting customer by ID:", error);
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