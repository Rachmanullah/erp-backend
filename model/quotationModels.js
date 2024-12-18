const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const quotation = await prisma.salesQuotation.findMany({
            include: {
                Customer: true,
                Produk: {
                    select: {
                        id: true,
                        referensi: true,
                        nama_produk: true,
                        harga_produk: true,
                    }
                },
            }
        });
        return quotation;
    } catch (error) {
        console.error("Error fetching quotation:", error);
        throw error;
    }
}

const findByReferensi = async (referensi) => {
    try {
        const quotation = await prisma.salesQuotation.findMany({
            where: {
                referensi: referensi
            },
            include: {
                Customer: true,
                Produk: {
                    select: {
                        id: true,
                        referensi: true,
                        nama_produk: true,
                        harga_produk: true,
                    }
                },
            }
        });
        return quotation;
    } catch (error) {
        console.error("Error fetching quotation by Referensi:", error);
        throw error;
    }
}

const create = async (quotationData) => {
    try {
        const formattedData = quotationData.produk.map((item) => ({
            id_customer: parseInt(quotationData.id_customer),
            referensi: quotationData.referensi,
            order_date: new Date(quotationData.order_date),
            status: quotationData.status,
            id_produk: parseInt(item.id_produk),
            jumlah_produk: parseInt(item.jumlah_produk),
            total_biaya: parseInt(item.total_biaya),
        }));

        const quotation = await prisma.salesQuotation.createMany({
            data: formattedData,
            skipDuplicates: true,
        });
        return quotation;
    } catch (error) {
        console.error("Error creating quotation:", error);
        throw error;
    }
}

const update = async (referensi, quotationData) => {
    try {
        const updatedQuotation = await prisma.salesQuotation.updateMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_produk: parseInt(quotationData.id_produk, 10) },
                ],
            },
            data: {
                jumlah_produk: parseInt(quotationData.jumlah_produk, 10),
                total_biaya: parseInt(quotationData.total_biaya, 10),
            },
        });
        return updatedQuotation;
    } catch (error) {
        console.error('Error updating quotation:', error.message);
        throw error;
    }
};

const destroy = async (referensi) => {
    try {
        const deletedQuotation = await prisma.salesQuotation.deleteMany({
            where: {
                referensi: referensi
            }
        });
        return deletedQuotation;
    } catch (error) {
        console.error("Error deleting quotation by ID:", error);
        throw error;
    }
}

const destroyMany = async (referensi, produkID) => {
    try {
        await prisma.salesQuotation.deleteMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_produk: { in: produkID } },
                ],
            },
        });
        return true;
    } catch (error) {
        console.error('Error deleting quotation by referensi:', error);
        throw error;
    }
};

const updateStatusQuotation = async (referensi, statusQuotation) => {
    try {
        await prisma.salesQuotation.updateMany({
            where: {
                referensi: referensi
            },
            data: { status: statusQuotation.status }
        });

        // Ambil data yang sudah diperbarui
        const updatedOrders = await prisma.salesQuotation.findMany({
            where: {
                referensi: referensi
            },
            include: {
                Customer: true,
                Produk: {
                    select: {
                        id: true,
                        referensi: true,
                        nama_produk: true,
                        harga_produk: true,
                    }
                },
            }
        });

        return updatedOrders;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

const checkLastReferencedQuotation = async () => {
    try {
        const quotation = await prisma.salesQuotation.findFirst({
            orderBy: {
                referensi: 'desc',
            },
        });
        return quotation;
    } catch (error) {
        console.error("Error checking last referenced order:", error);
        throw error;
    }
}

module.exports = {
    findAll,
    findByReferensi,
    create,
    update,
    destroy,
    destroyMany,
    updateStatusQuotation,
    checkLastReferencedQuotation
}