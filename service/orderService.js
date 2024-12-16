const { orderModels, bomModels, bahanModels, productModels } = require("../model");
const { validateOrder } = require("../utils/validationHelper");

const findAllOrder = async () => {
    try {
        return await orderModels.findAll();
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const findOrderByID = async (orderID) => {
    try {
        return await orderModels.findByID(orderID);
    } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
}

const createOrder = async (orderData) => {
    try {
        await validateOrder.validate(orderData, { abortEarly: false });

        // Ambil referensi terakhir dari database
        const lastOrder = await orderModels.checkLastReferencedOrder();

        let newReference = 'MO-0001'; // Default jika tidak ada order sebelumnya
        if (lastOrder) {
            const lastReference = lastOrder.referensi;
            const match = lastReference.match(/MO-(\d+)/); // Ekstrak angka dari referensi terakhir
            if (match) {
                const lastNumber = parseInt(match[1], 10); // Convert angka terakhir ke integer
                const nextNumber = lastNumber + 1; // Tambahkan 1 untuk referensi baru
                newReference = `MO-${nextNumber.toString().padStart(4, '0')}`; // Format jadi MO/XXXX
            }
        }

        const newOrder = {
            ...orderData,
            id_produk: parseInt(orderData.id_produk),
            referensi: newReference,
            jumlah_order: parseInt(orderData.jumlah_order),
            status: "Draft"
        };

        return await orderModels.create(newOrder);
    } catch (error) {
        throw error;
    }
}

const updateOrder = async (orderID, updatedData) => {
    try {
        await validateOrder.validate(updatedData, { abortEarly: false });
        const updatedOrder = {
            ...updatedData,
            jumlah_order: parseInt(updatedData.jumlah_order),
        }
        return await orderModels.update(orderID, updatedOrder);

    } catch (error) {
        throw error;
    }
}

const updateStatusOrder = async (orderID, updatedStatus) => {
    try {
        await validateOrder.validateAt('status', updatedStatus);

        if (updatedStatus.status === 'Production') {
            const order = await orderModels.findByID(orderID);
            if (!order) throw new Error('Order not found');

            // proses mengurangi stok bahan
            const bomDetails = await bomModels.findByReference(order.referensi_bom);
            if (!bomDetails || bomDetails.length === 0) {
                throw new Error('BoM not found for the product');
            }

            for (const bom of bomDetails) {
                const bahan = await bahanModels.findByID(bom.id_bahan);
                if (!bahan) throw new Error(`Bahan with ID ${bom.id_bahan} not found`);

                const bahanToConsume = bom.jumlah_bahan * order.jumlah_order; // Jumlah bahan yang diperlukan
                if (bahan.stok < bahanToConsume) {
                    throw new Error(
                        `Insufficient stock for bahan ${bahan.name}. Required: ${bahanToConsume}, Available: ${bahan.stok}`
                    );
                }

                // Kurangi stok bahan
                const newStok = bahan.stok - bahanToConsume;
                await bahanModels.update(bom.id_bahan, { stok: newStok });
            }

            // menambahkan stok produk ke tabel produk
            const product = await productModels.findByID(order.id_produk);
            if (!product) throw new Error('Product not found');
            const newStok = product.stok + order.jumlah_order;
            await productModels.update(order.id_produk, { stok: newStok });
        }

        return await orderModels.update(orderID, updatedStatus);

    } catch (error) {
        throw error;
    }
}

const deleteOrder = async (orderID) => {
    try {
        return await orderModels.destroy(orderID);
    } catch (error) {
        throw new Error('Error deleting data: ' + error.message);
    }
}

module.exports = {
    findAllOrder,
    findOrderByID,
    createOrder,
    updateOrder,
    updateStatusOrder,
    deleteOrder,
}