const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const bahan = await prisma.bahan.findMany();
        return bahan;
    } catch (error) {
        console.error("Error fetching bahan:", error);
        throw error;
    }
}

const findByID = async (bahanID) => {
    try {
        const bahan = await prisma.bahan.findUnique({
            where: {
                id: bahanID
            }
        });
        return bahan;
    } catch (error) {
        console.error("Error fetching bahan by ID:", error);
        throw error;
    }
}

const create = async (bahanData) => {
    try {
        const bahan = await prisma.bahan.create({
            data: bahanData
        });
        return bahan;
    } catch (error) {
        console.error("Error creating bahan:", error);
        throw error;
    }
}

const update = async (bahanID, bahanData) => {
    try {
        const bahan = await prisma.bahan.update({
            where: {
                id: bahanID
            },
            data: bahanData
        });
        return bahan;
    } catch (error) {
        console.error("Error updating bahan:", error);
        throw error;
    }
}

const updateStok = async (bahanID, stokBahan) => {
    try {
        console.log(stokBahan)
        const bahan = await prisma.bahan.update({
            where: {
                id: bahanID
            },
            data: { stok: stokBahan }
        });
        return bahan;
    } catch (error) {
        console.error("Error updating bahan:", error);
        throw error;
    }
}

const destroy = async (bahanID) => {
    try {
        const deletedBahan = await prisma.bahan.delete({
            where: {
                id: bahanID
            }
        });
        return deletedBahan;
    } catch (error) {
        console.error("Error deleting bahan by ID:", error);
        throw error;
    }
}

module.exports = {
    findAll,
    findByID,
    create,
    update,
    destroy,
    updateStok
}