const generateRFQTemplate = async (data) => {
    console.log("Generating RFQ Template with data:", data);
    return (`
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header img { width: 150px; }
          .company-info, .shipping-info { margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f4f4f4; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://via.placeholder.com/150" alt="Your Logo" />
        </div>
        <div class="company-info">
          <p><strong>My Company (San Francisco)</strong></p>
          <p>250 Executive Park Blvd, Suite 3400<br />San Francisco CA 94134<br />Indonesia</p>
          <p>Phone: 087841778740</p>
        </div>
        <div class="shipping-info">
          <p><strong>Shipping Address:</strong></p>
          <p>${data.nama_vendor}<br />${data.referensi}</p>
        </div>
        <h2>Request for Quotation ${data.referensi}</h2>
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
            ${data.Bahan.map(
        (item) => `
              <tr>
                <td>${item.nama_bahan}</td>
                <td>${item.jumlah_bahan}</td>
                <td>${item.biaya_bahan}</td>
                <td>${item.total_biaya}</td>
              </tr>
            `
    ).join("")}
          </tbody>
        </table>
        <div class="footer">
          <p>087841778740 | erp@tang.com | http://www.example.com</p>
        </div>
      </body>
    </html>
  `);
}
module.exports = generateRFQTemplate;