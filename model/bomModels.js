const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const dataBoM = await prisma.boM.findMany({
            include: {
                Product: {
                    select: {
                        id: true,
                        nama_produk: true,
                        referensi: true,
                        harga_produk: true,
                        biaya_produksi: true,
                    }
                },
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
        return dataBoM;
    } catch (error) {
        console.error("Error fetching BoM:", error);
        throw error;
    }
}

const findByID = async (bomID) => {
    try {
        const dataBoM = await prisma.boM.findUnique({
            where: {
                id: bomID
            },
            include: {
                Product: {
                    select: {
                        id: true,
                        nama_produk: true,
                        referensi: true,
                        harga_produk: true,
                        biaya_produksi: true,
                    }
                },
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
        return dataBoM;
    } catch (error) {
        console.error("Error fetching BoM by ID:", error);
        throw error;
    }
}

const findByReference = async (referenceBom) => {
    try {
        const dataBoM = await prisma.boM.findMany({
            where: {
                referensi: referenceBom
            },
            include: {
                Product: {
                    select: {
                        id: true,
                        nama_produk: true,
                        referensi: true,
                        harga_produk: true,
                        biaya_produksi: true,
                    }
                },
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
        return dataBoM;
    } catch (error) {
        console.error("Error fetching BoM by reference:", error);
        throw error;
    }
}

const create = async (bomData) => {
    try {
        const formattedData = bomData.bahan.map((item) => ({
            id_produk: parseInt(bomData.id_produk),
            referensi: bomData.referensi,
            jumlah_produk: parseInt(bomData.jumlah_produk),
            total_biaya_produk: parseInt(bomData.total_biaya_produk),
            id_bahan: parseInt(item.id_bahan),
            jumlah_bahan: parseInt(item.jumlah_bahan),
            total_biaya_bahan: parseInt(item.total_biaya_bahan),
        }));

        const createBoM = await prisma.boM.createMany({
            data: formattedData,
            skipDuplicates: true,
        });

        return createBoM;
    } catch (error) {
        console.error("Error creating BoM:", error);
        throw error;
    }
};

const update = async (referensi, bomData) => {
    try {
        const updatedBoM = await prisma.boM.updateMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_bahan: parseInt(bomData.id_bahan, 10) },
                ],
            },
            data: {
                jumlah_bahan: parseInt(bomData.jumlah_bahan, 10),
                total_biaya_bahan: parseInt(bomData.total_biaya_bahan, 10),
                total_biaya_produk: parseInt(bomData.total_biaya_produk, 10),
            },
        });
        return updatedBoM;
    } catch (error) {
        console.error('Error updating BoM:', error.message);
        throw error;
    }
};

const destroy = async (referensiBom) => {
    try {
        const deletedBoM = await prisma.boM.deleteMany({
            where: {
                referensi: referensiBom
            }
        });
        return deletedBoM;
    } catch (error) {
        console.error("Error deleting BoM by ID:", error);
        throw error;
    }
}

const destroyMany = async (referensi, bahanIDs) => {
    try {
        await prisma.boM.deleteMany({
            where: {
                AND: [
                    { referensi: referensi },
                    { id_bahan: { in: bahanIDs } },
                ],
            },
        });
        return true;
    } catch (error) {
        console.error('Error deleting BoM by referensi:', error);
        throw error;
    }
};

const checkLastReferencedBom = async () => {
    try {
        const BoMdata = await prisma.boM.findFirst({
            orderBy: {
                referensi: 'desc',
            },
        });
        return BoMdata;
    } catch (error) {
        console.error("Error checking last referenced bom:", error);
        throw error;
    }
}

module.exports = {
    findAll,
    findByID,
    findByReference,
    create,
    update,
    destroy,
    destroyMany,
    checkLastReferencedBom
}