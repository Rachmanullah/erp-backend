const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const rfq = await prisma.rfq.findMany({
            include: {
                Vendor: true,
                Bahan: {
                    select: {
                        id: true,
                        nama_bahan: true,
                        biaya_bahan: true,
                        harga_bahan: true,
                    }
                },
            }
        });
        return rfq;
    } catch (error) {
        console.error("Error fetching rfq:", error);
        throw error;
    }
}

const findByReferensi = async (rfqReferensi) => {
    try {
        const rfq = await prisma.rfq.findMany({
            where: {
                referensi: rfqReferensi
            },
            include: {
                Vendor: true,
                Bahan: {
                    select: {
                        id: true,
                        nama_bahan: true,
                        biaya_bahan: true,
                        harga_bahan: true,
                    }
                },
            }
        });
        return rfq;
    } catch (error) {
        console.error("Error fetching rfq by Referensi:", error);
        throw error;
    }
}

const create = async (rfqData) => {
    try {
        const formattedData = rfqData.bahan.map((item) => ({
            id_vendor: parseInt(rfqData.id_vendor),
            referensi: rfqData.referensi,
            deadline_order: new Date(rfqData.deadline_order.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })),
            status: rfqData.status,
            id_bahan: parseInt(item.id_bahan),
            jumlah_bahan: parseInt(item.jumlah_bahan),
            total_biaya: parseInt(item.total_biaya),
        }));

        const rfq = await prisma.rfq.createMany({
            data: formattedData,
            skipDuplicates: true,
        });
        return rfq;
    } catch (error) {
        console.error("Error creating rfq:", error);
        throw error;
    }
}

const update = async (referensi, rfqData) => {
    try {
        const updatedRfq = await prisma.rfq.updateMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_bahan: parseInt(rfqData.id_bahan, 10) },
                ],
            },
            data: {
                jumlah_bahan: parseInt(rfqData.jumlah_bahan, 10),
                total_biaya: parseInt(rfqData.total_biaya, 10),
            },
        });
        return updatedRfq;
    } catch (error) {
        console.error('Error updating rfq:', error.message);
        throw error;
    }
};

const destroy = async (referensiRfq) => {
    try {
        const deletedRfq = await prisma.rfq.deleteMany({
            where: {
                referensi: referensiRfq
            }
        });
        return deletedRfq;
    } catch (error) {
        console.error("Error deleting rfq by ID:", error);
        throw error;
    }
}

const destroyMany = async (referensi, bahanIDs) => {
    try {
        await prisma.rfq.deleteMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_bahan: { in: bahanIDs } },
                ],
            },
        });
        return true;
    } catch (error) {
        console.error('Error deleting rfq by referensi:', error);
        throw error;
    }
};

const updateStatusRfq = async (referensiRFQ, statusRfq) => {
    try {
        console.log(statusRfq.status)
        await prisma.rfq.updateMany({
            where: {
                referensi: referensiRFQ
            },
            data: { status: statusRfq.status }
        });

        // Ambil data yang sudah diperbarui
        const updatedOrders = await prisma.rfq.findMany({
            where: {
                referensi: referensiRFQ
            },
            include: {
                Vendor: true,
                Bahan: {
                    select: {
                        id: true,
                        nama_bahan: true,
                        biaya_bahan: true,
                        harga_bahan: true,
                    }
                }
            }
        });

        return updatedOrders;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

const checkLastReferencedRfq = async () => {
    try {
        const rfq = await prisma.rfq.findFirst({
            orderBy: {
                referensi: 'desc',
            },
        });
        return rfq;
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
    updateStatusRfq,
    checkLastReferencedRfq,
}