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
module.exports = {
    cleanBoMData,
}