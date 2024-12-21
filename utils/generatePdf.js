const puppeteer = require("puppeteer");

const generateRFQTemplate = async (data) => {
    console.log("Generating RFQ Template with data:", data); // Debug log
    const template = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: #333;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #ddd;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header img {
        width: 70px; /* Mengubah ukuran logo menjadi 70px */
        height: auto;
      }
      .header .company-name {
        text-align: right;
        font-size: 18px;
        font-weight: bold;
      }
      .header .company-name p {
        margin: 0;
      }
      .content {
        margin-bottom: 20px;
      }
      .content p {
        margin: 5px 0;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .table th, .table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      .table th {
        background-color: #f9f9f9;
        color: #555;
      }
      .table tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        font-size: 12px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <!-- Header -->
    <div class="header">
      <img src="http://localhost:3000/favicon.ico" alt="Logo" />
      <div class="company-name">
        <p>CV. RachmanSport</p>
        <p>Jl. Contoh No. 123, Malang, Jawa Timur</p>
        <p>Indonesia</p>
        <p>Phone: 087841778740</p>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <p><strong>Vendor:</strong> ${data.nama_vendor}</p>
      <p><strong>Order Reference:</strong> ${data.referensi}</p>
      <p><strong>Order Date:</strong> ${new Date(data.deadline_order).toLocaleDateString()}</p>
    </div>

    <!-- Table -->
    <h2>Request for Quotation</h2>
    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${data.Bahan && data.Bahan.length > 0
            ? data.Bahan.map(
                (item) => `
                <tr>
                  <td>${item.nama_bahan}</td>
                  <td>${item.jumlah_bahan}</td>
                  <td>${item.biaya_bahan.toLocaleString()}</td>
                  <td>${item.total_biaya.toLocaleString()}</td>
                </tr>
              `
            ).join("")
            : `<tr><td colspan="4">No data available</td></tr>`
        }
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <p>087841778740 | rachmanSport@gmail.com | https://erp-frontend-navy.vercel.app</p>
    </div>
  </body>
</html>
`;

    console.log("Generated Template:", template); // Debug log
    return template;
};


const createPDF = async (data) => {
    try {
        const browser = await puppeteer.launch({
            headless: true, // Mode headless
            args: ["--no-sandbox", "--disable-setuid-sandbox"], // Tambahkan opsi untuk lingkungan tertentu
        });
        const page = await browser.newPage();

        const htmlContent = await generateRFQTemplate(data);
        console.log("HTML Content:", htmlContent);
        console.log("Setting HTML content for PDF...");

        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        console.log("HTML content successfully set!");
        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                left: "10mm",
                right: "10mm",
            },
        });
        console.log("PDF generated successfully!");
        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};


module.exports = createPDF;