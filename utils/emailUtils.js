const nodemailer = require('nodemailer');

// Konfigurasi transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Email Anda
        pass: process.env.EMAIL_PASS, // App-Specific Password Anda
    },
});

/**
 * Fungsi untuk mengirim email notifikasi RFQ dengan format tabel HTML
 * @param {string} referensiRfq - Referensi RFQ
 * @param {Array} rfqBahan - List bahan ({ nama_bahan, jumlah_bahan, biaya_bahan, total_biaya })
 * @param {number} totalPembayaran - Total pembayaran RFQ
 * @param {string} toEmail - Email penerima (vendor)
 * @param {object} vendorInfo - Informasi vendor ({ nama, alamat, kota, negara, telepon, vat })
 */
const sendRfqEmail = async (referensiRfq, rfqBahan, totalPembayaran, toEmail, vendorInfo) => {
    try {
        // Format body email dengan tabel HTML
        const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Request for Quotation</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
        }
        .header, .address { 
            margin-bottom: 20px; 
        }
        .header p, .address p { 
            margin: 2px 0; 
        }
        .bold { 
            font-weight: bold; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px; 
        }
        table, th, td { 
            border: 1px solid #ddd; 
        }
        th, td { 
            padding: 8px; 
            text-align: left; 
        }
        th { 
            background-color: #f2f2f2; 
        }
        .title { 
            font-size: 24px; 
            margin-bottom: 10px; 
        }
        .total { 
            font-size: 18px; 
            margin-top: 10px; 
            text-align: right;
        }
        .footer { 
            margin-top: 30px; 
            font-size: 14px; 
            color: #777; 
        }
    </style>
</head>
<body>
    <!-- Salam -->
    <p>Dear ${vendorInfo.nama_vendor},</p>

    <!-- Pesan Pembuka -->
    <p>Here is in attachment a request for quotation <strong>#${referensiRfq}</strong> from <strong>Rachman Sport</strong> (San Francisco).</p>

    <!-- Informasi Perusahaan -->
    <div class="header">
        <p><strong>Rachman Sport</strong></p>
        <p>Jl. Contoh No. 123</p>
        <p>Malang, Jawa Timur</p>
        <p>Indonesia</p>
    </div>

    <!-- Informasi Vendor -->
    <div class="address">
        <p class="bold">${vendorInfo.nama_vendor}</p>
        <p>${vendorInfo.alamat}</p>
        <p>☎ ${vendorInfo.no_telp}</p>
    </div>

    <!-- Judul -->
    <div class="title">Request for Quotation #${referensiRfq}</div>

    <!-- Tabel Bahan -->
    <table>
        <thead>
            <tr>
                <th>Nama Bahan</th>
                <th>Jumlah</th>
                <th>Biaya</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${rfqBahan
                .map(
                    (bahan) =>
                        `<tr>
                            <td>${bahan.nama_bahan}</td>
                            <td>${bahan.jumlah_bahan}</td>
                            <td>Rp ${parseFloat(bahan.biaya_bahan).toLocaleString()}</td>
                            <td>Rp ${parseFloat(bahan.total_biaya).toLocaleString()}</td>
                        </tr>`
                )
                .join('')}
        </tbody>
    </table>

    <!-- Total Pembayaran -->
    <p class="total">Total Pembayaran: <strong>Rp ${parseFloat(totalPembayaran).toLocaleString()}</strong></p>

    <!-- Penutup -->
    <div class="footer">
        <p>If you have any questions, please do not hesitate to contact us.</p>
        <p>Best regards,</p>
        <p>--<br>Admin</p>
    </div>
</body>
</html>
`;


        // Konfigurasi email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email pengirim
            to: toEmail, // Email vendor
            subject: `Request for Quotation ${referensiRfq}`,
            html: emailBody,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${toEmail}`);
    } catch (error) {
        console.error('Gagal mengirim email:', error.message);
        throw error;
    }
};

/**
 * Fungsi untuk mengirim email notifikasi Quotation dengan format tabel HTML
 * @param {string} referensiQuotation - Referensi Quotation
 * @param {Array} produk - List produk ({ nama_produk, jumlah_produk, harga_produk, total_biaya })
 * @param {number} totalPembayaran - Total pembayaran Quotation
 * @param {string} toEmail - Email penerima (customer)
 * @param {object} customerInfo - Informasi customer ({ nama, alamat, kota, telepon})
 */
const sendQuotationEmail = async (referensiQuotation, produk, totalPembayaran, toEmail, customerInfo) => {
    try {
        // Format body email dengan tabel HTML
        const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .container {
            width: 90%;
            max-width: 700px;
            margin: 20px auto;
            background-color: #ffffff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 15px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
        }
        .content {
            padding: 20px;
        }
        .content p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .total {
            text-align: right;
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
        }
        .footer {
            background-color: #4CAF50;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <!-- Container Utama -->
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>

        <!-- Konten -->
        <div class="content">
            <!-- Salam -->
            <p>Hello, ${customerInfo.nama_customer}</p>
            <p>
                Your order <strong>${produk[0]?.referensi}</strong> amounting in 
                <strong>Rp ${parseFloat(totalPembayaran).toLocaleString()}</strong> has been confirmed.
            </p>
            <p>Thank you for your trust!</p>


            <div class="title">Quotation #${referensiQuotation}</div>
            <!-- Tabel Produk -->
            <table>
                <thead>
                    <tr>
                        <th>Nama Produk</th>
                        <th>Jumlah</th>
                        <th>Harga</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${produk
                .map(
                    (item) =>
                        `<tr>
                                    <td>[${item.referensi}] ${item.nama_produk}</td>
                                    <td>${item.jumlah_produk}</td>
                                    <td>Rp ${parseFloat(item.harga_produk).toLocaleString()}</td>
                                    <td>Rp ${parseFloat(item.total_biaya).toLocaleString()}</td>
                                </tr>`
                )
                .join('')}
                </tbody>
            </table>

            <!-- Total Pembayaran -->
            <p class="total">Total Pembayaran: Rp ${parseFloat(totalPembayaran).toLocaleString()}</p>

            <!-- Penutup -->
            <p>Do not hesitate to contact us if you have any questions.</p>

            <p>--<br>Admin</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            &copy; 2024 Rachman Sport | All Rights Reserved
        </div>
    </div>
</body>
</html>
`;


        // Konfigurasi email
        const mailOptions = {
            from: process.env.EMAIL_USER, // Email pengirim
            to: toEmail, // Email vendor
            subject: `Quotation #${referensiQuotation}`,
            html: emailBody,
        };

        // Kirim email
        await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${toEmail}`);
    } catch (error) {
        console.error('Gagal mengirim email:', error.message);
        throw error;
    }
};

module.exports = {
    sendRfqEmail,
    sendQuotationEmail
};
