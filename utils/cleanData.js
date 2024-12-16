const cleanBoMData = (data) => {
    return {
        ...data,
        jumlah_produk: parseFloat(data.jumlah_produk),
        total_biaya_produk: parseFloat(data.total_biaya_produk),
        bahan: data.bahan.map((item) => ({
            id_bahan: parseInt(item.id_bahan),
            jumlah_bahan: parseFloat(item.jumlah_bahan),
            total_biaya_bahan: parseFloat(item.total_biaya_bahan),
        })),
    };
};

const cleanRfqData = (data) => {
    return {
        ...data,
        id_vendor: parseInt(data.id_vendor),
        bahan: data.bahan.map((item) => ({
            id_bahan: parseInt(item.id_bahan),
            jumlah_bahan: parseFloat(item.jumlah_bahan),
            total_biaya: parseFloat(item.total_biaya),
        })),
    };
};

const cleanQuotationData = (data) => {
    return {
        ...data,
        id_customer: parseInt(data.id_customer),
        produk: data.produk.map((item) => ({
            id_produk: parseInt(item.id_produk),
            jumlah_produk: parseFloat(item.jumlah_produk),
            total_biaya: parseFloat(item.total_biaya),
        })),
    };
};

module.exports = {
    cleanBoMData,
    cleanRfqData,
    cleanQuotationData,
}