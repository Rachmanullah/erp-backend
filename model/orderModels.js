const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const order = await prisma.order.findMany({
            include: {
                Product: {
                    select: {
                        id: true,
                        nama_produk: true,
                        referensi: true,
                        harga_produk: true,
                        biaya_produksi: true,
                        stok: true
                    }
                }
            }
        });
        return order;
    } catch (error) {
        console.error("Error fetching bahan:", error);
        throw error;
    }
}

const findByID = async (orderID) => {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: orderID
            },
            include: {
                Product: {
                    select: {
                        id: true,
                        nama_produk: true,
                        referensi: true,
                        harga_produk: true,
                        biaya_produksi: true,
                        stok: true
                    }
                }
            }
        });
        return order;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
}

const checkLastReferencedOrder = async () => {
    try {
        const order = await prisma.order.findFirst({
            orderBy: {
                referensi: 'desc',
            },
        });
        return order;
    } catch (error) {
        console.error("Error checking last referenced order:", error);
        throw error;
    }
}

const create = async (orderData) => {
    try {
        const order = await prisma.order.create({
            data: orderData
        });
        return order;
    } catch (error) {
        console.error("Error creating bahan:", error);
        throw error;
    }
}

const update = async (orderID, orderData) => {
    try {
        const order = await prisma.order.update({
            where: {
                id: orderID
            },
            data: orderData
        });
        return order;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
}

const updateStatusOrder = async (orderID, statusOrder) => {
    try {
        const order = await prisma.order.update({
            where: {
                id: orderID
            },
            data: { status: statusOrder }
        });
        return order;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
}

const destroy = async (orderID) => {
    try {
        const deletedOrder = await prisma.order.delete({
            where: {
                id: orderID
            }
        });
        return deletedOrder;
    } catch (error) {
        console.error("Error deleting order by ID:", error);
        throw error;
    }
}

module.exports = {
    findAll,
    findByID,
    checkLastReferencedOrder,
    create,
    update,
    updateStatusOrder,
    destroy,
}