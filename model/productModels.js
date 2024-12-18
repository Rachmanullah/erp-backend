const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const product = await prisma.product.findMany();
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
}

const findByID = async (productID) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id: productID
            }
        });
        return product;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}

const create = async (productData) => {
    try {
        const product = await prisma.product.create({
            data: productData
        });
        return product;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

const update = async (productID, productData) => {
    try {
        const product = await prisma.product.update({
            where: {
                id: productID
            },
            data: productData
        });
        return product;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}

const destroy = async (productID) => {
    try {
        const deletedProduct = await prisma.product.delete({
            where: {
                id: productID
            }
        });
        return deletedProduct;
    } catch (error) {
        console.error("Error deleting product by ID:", error);
        throw error;
    }
}

const updateStok = async (produkID, stokProduk) => {
    try {
        const produk = await prisma.product.update({
            where: {
                id: produkID
            },
            data: { stok: stokProduk }
        });
        return produk;
    } catch (error) {
        console.error("Error updating produk:", error);
        throw error;
    }
}

const checkLastReferencedProduk = async () => {
    try {
        const produk = await prisma.product.findFirst({
            orderBy: {
                referensi: 'desc',
            },
        });
        return produk;
    } catch (error) {
        console.error("Error checking last referenced order:", error);
        throw error;
    }
}

const getCountProduk = async () => {
    try {
        const count = await prisma.product.count();

        return count;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findAll,
    findByID,
    create,
    update,
    destroy,
    updateStok,
    checkLastReferencedProduk,
    getCountProduk,
}