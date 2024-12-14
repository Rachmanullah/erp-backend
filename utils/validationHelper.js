const yup = require('yup');

const validateBahan = yup.object({
    nama_bahan: yup.string().required('Nama bahan harus diisi'),
    biaya_bahan: yup.number().required('Biaya bahan harus diisi').required('Biaya bahan harus diisi'),
    harga_bahan: yup.number().positive('Harga bahan harus lebih besar dari 0').required('Harga bahan harus diisi'),
    stok: yup.number().integer('Stok harus berupa angka bulat').min(0, 'Stok tidak boleh kurang dari 0').required('Stok harus diisi'),
    gambar_bahan: yup.string().required('Gambar bahan harus diisi'),
});

const validateProduct = yup.object({
    nama_produk: yup.string().required('Nama produk harus diisi'),
    referensi: yup.string().optional(),
    kategori: yup.string().required('Kategori produk harus diisi'),
    harga_produk: yup.number().positive('Harga produk harus lebih besar dari 0').required('Harga produk harus diisi'),
    biaya_produksi: yup.number().positive('Biaya produksi harus lebih besar dari 0').required('Biaya produksi harus diisi'),
    stok: yup.number().integer('Stok harus berupa angka bulat').min(0, 'Stok tidak boleh kurang dari 0').required('Stok harus diisi'),
    gambar_produk: yup.string().required('Gambar produk harus diisi'),
});

const validateBoM = yup.object({
    id_produk: yup.number().integer().required('ID produk harus diisi'),
    referensi: yup.string().optional(),
    jumlah_produk: yup.number().positive('Jumlah produk harus lebih besar dari 0').integer().required('Jumlah produk harus diisi'),
    total_biaya_produk: yup.number().positive('Total biaya produk harus lebih besar dari 0').required('Total biaya produk harus diisi'),
    bahan: yup.array().of(
        yup.object({
            id_bahan: yup.number().integer().required('ID bahan harus diisi'),
            jumlah_bahan: yup.number().positive('Jumlah bahan harus lebih besar dari 0').integer().required('Jumlah bahan harus diisi'),
            total_biaya_bahan: yup.number().positive('Total biaya bahan harus lebih besar dari 0').required('Total biaya bahan harus diisi'),
        })
    ).required(),
});

const validateOrder = yup.object({
    id_produk: yup.number().integer().required('ID produk harus diisi'),
    referensi_bom: yup.string().required('Referensi BoM harus diisi'),
    jumlah_order: yup.number().positive('Jumlah order harus lebih besar dari 0').integer().required('Jumlah order harus diisi'),
    status: yup.string().oneOf(['Draft', 'Confirmed', 'Production', 'Done'], 'Status harus salah satu dari Draft, Confirmed, Production atau Done').default('Draft'),
});

const validateVendor = yup.object({
    company_registrasi: yup.string().optional(),
    nama_vendor: yup.string().required('Nama vendor harus diisi'),
    type: yup.string().oneOf(['Individual', 'Company'], 'Status harus salah satu dari Individual, Company').required(),
    alamat: yup.string().required('Alamat vendor harus diisi'),
    no_telp: yup.string().optional(),
    email: yup.string().email('Email vendor harus valid').required('Email vendor harus diisi'),
});


module.exports = {
    validateBahan,
    validateProduct,
    validateBoM,
    validateOrder,
    validateVendor,
};