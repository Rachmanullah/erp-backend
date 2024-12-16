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
    kategori: yup.string().required('Kategori produk harus diisi'),
    harga_produk: yup.number().positive('Harga produk harus lebih besar dari 0').required('Harga produk harus diisi'),
    biaya_produksi: yup.number().positive('Biaya produksi harus lebih besar dari 0').required('Biaya produksi harus diisi'),
    stok: yup.number().integer('Stok harus berupa angka bulat').min(0, 'Stok tidak boleh kurang dari 0').required('Stok harus diisi'),
    gambar_produk: yup.string().required('Gambar produk harus diisi'),
});

const validateBoM = yup.object({
    id_produk: yup.number().integer().required('ID produk harus diisi'),
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

const validateRfq = yup.object({
    id_vendor: yup.number().integer().required('ID vendor harus diisi'),
    deadline_order: yup.string().optional(),
    status: yup.string().oneOf(['RFQ', 'Send RFQ', 'Confirmed', 'Received', 'Purchase Order', 'Cancel', 'Return'], 'Status harus pilih salah satu').default('RFQ'),
    bahan: yup.array().of(
        yup.object({
            id_bahan: yup.number().integer().required('ID bahan harus diisi'),
            jumlah_bahan: yup.number().positive('Jumlah bahan harus lebih besar dari 0').integer().required('Jumlah bahan harus diisi'),
            total_biaya: yup.number().positive('Total biaya bahan harus lebih besar dari 0').required('Total biaya bahan harus diisi'),
        })
    ).required(),
});

const validatePO = yup.object({
    referensi_rfq: yup.string().required('referensi rfq harus di isi'),
    // type: yup.string().oneOf(['-', 'Cash', 'Bank'], 'type harus pilih salah satu').default('-'),
    total_pembayaran: yup.number().positive('jumlah pembayaran harus lebih besar dari 0').required('jumlah pembayaran harus di isi'),
    confirmation_date: yup.string().optional(),
    status: yup.string().oneOf(['Nothing to Bill', 'Waiting Bill', 'Fully Billed'], 'Status harus pilih salah satu').default('Nothing to Bill'),
})

const validateCustomer = yup.object({
    company_registrasi: yup.string().optional(),
    nama_customer: yup.string().required('Nama customer harus diisi'),
    type: yup.string().oneOf(['Individual', 'Company'], 'Status harus salah satu dari Individual, Company').required(),
    alamat: yup.string().required('Alamat customer harus diisi'),
    no_telp: yup.string().optional(),
    email: yup.string().email('Email customer harus valid').required('Email customer harus diisi'),
});

const validateQuotation = yup.object({
    id_customer: yup.number().integer().required('ID customer harus diisi'),
    order_date: yup.string().optional(),
    status: yup.string().oneOf(['Quotation', 'Quotation Sent', 'Delivery', 'Received', 'Sales Order', 'Cancel', 'Return'], 'Status harus pilih salah satu').default('Quotation'),
    produk: yup.array().of(
        yup.object({
            id_produk: yup.number().integer().required('ID produk harus diisi'),
            jumlah_produk: yup.number().positive('Jumlah produk harus lebih besar dari 0').integer().required('Jumlah produk harus diisi'),
            total_biaya: yup.number().positive('Total biaya produk harus lebih besar dari 0').required('Total biaya produk harus diisi'),
        })
    ).required(),
});

const validateSalesOrder = yup.object({
    referensi_quotation: yup.string().required('referensi quotation harus di isi'),
    // type: yup.string().oneOf(['-', 'Cash', 'Bank'], 'type harus pilih salah satu').default('-'),
    total_pembayaran: yup.number().positive('jumlah pembayaran harus lebih besar dari 0').required('jumlah pembayaran harus di isi'),
    confirmation_date: yup.string().optional(),
    status: yup.string().oneOf(['Nothing to Invoice', 'To Invoice', 'Fully Invoiced'], 'Status harus pilih salah satu').default('Nothing to Invoice'),
})


module.exports = {
    validateBahan,
    validateProduct,
    validateBoM,
    validateOrder,
    validateVendor,
    validateRfq,
    validatePO,
    validateCustomer,
    validateQuotation,
    validateSalesOrder,
};