const invoiceTemplate = (order) => {
  // Ensure safe data extraction
  const notes = order?.order_response?.notes?.[0] || {};
  const guests = notes?.guests || {};

  // Amount calculation
  const subtotal = (order.amount || order?.order_response?.amount / 100 || 0);
  const gstRate = 0.18; // 18% GST
  const gstAmount = Math.round(subtotal * gstRate);
  const totalWithoutGST = subtotal - gstAmount;

  // Safe date formatting
  const billDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB')
    : 'N/A';
  const billTime = order.createdAt
    ? new Date(order.createdAt).toLocaleTimeString('en-GB')
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .invoice-container {
      background-color: #fff;
      max-width: 800px;
      margin: auto;
      padding: 30px;
      box-shadow: 0 0 15px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .hotel-name {
      font-size: 26px;
      font-weight: bold;
      color: #d32f2f;
    }
    .hotel-address {
      font-size: 12px;
      color: #555;
      margin-top: 5px;
      line-height: 1.4;
    }
    .bill-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fafafa;
      padding: 10px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
    }
    .bill-title {
      font-size: 16px;
      font-weight: bold;
      color: #d32f2f;
    }
    .guest-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px dotted #ccc;
    }
    .detail-label {
      font-weight: bold;
      color: #333;
    }
    .detail-value {
      color: #555;
    }
    .charges-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .charges-table th,
    .charges-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #ddd;
    }
    .charges-table th {
      background-color: #f5f5f5;
    }
    .amount {
      text-align: right;
    }
    .total-section {
      border-top: 2px solid #333;
      padding-top: 15px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 14px;
    }
    .grand-total {
      font-size: 18px;
      font-weight: bold;
      border-top: 1px solid #333;
      margin-top: 8px;
      padding-top: 8px;
    }
    .amount-words {
      font-style: italic;
      color: #555;
      font-size: 12px;
      margin-top: 15px;
    }
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: end;
    }
    .gst-info {
      font-size: 11px;
      color: #555;
    }
    .signature {
      text-align: center;
    }
    .signature-line {
      border-bottom: 1px solid #333;
      width: 150px;
      margin-bottom: 5px;
    }
    .nil-balance {
      color: #d32f2f;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="hotel-name">HOTEL MANNARS LODGE</div>
      <div class="hotel-address">
        Chandraguptha Road, (Near Suburb Bus Stand), Mysuru - 570 001<br>
        Ph: 0821-2448050 📱 9111152924
      </div>
    </div>

    <!-- Bill Header -->
    <div class="bill-header">
      <div>Order No: ${order.order_id || order._id || 'N/A'}</div>
      <div class="bill-title">BOOKING BILL DETAILS</div>
      <div>
        Bill No: ${order.order_response?.receipt || 'N/A'}<br>
        ${billDate} ${billTime}
      </div>
    </div>

    <!-- Guest Details -->
    <div class="guest-details">
      <div>
        <div class="detail-row"><span class="detail-label">Guest Name:</span><span class="detail-value">${notes.userName || 'MR. GUEST'}</span></div>
        <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${notes.userEmail || 'N/A'}</span></div>
        <div class="detail-row"><span class="detail-label">Check In:</span><span class="detail-value">${notes.checkIn || 'N/A'}</span></div>
        <div class="detail-row"><span class="detail-label">Guests:</span><span class="detail-value">${`${guests.adults || 0} Adults, ${guests.children || 0} Children, ${guests.infants || 0} Infants`}</span></div>
        <div class="detail-row"><span class="detail-label">Total Guests:</span><span class="detail-value">${guests.total || 0}</span></div>
        <div class="detail-row"><span class="detail-label">Status:</span><span class="detail-value">${order.status?.toUpperCase() || 'PENDING'}</span></div>
      </div>
      <div>
        <div class="detail-row"><span class="detail-label">Mobile No.:</span><span class="detail-value">${notes.mobileNo || 'N/A'}</span></div>
        <div class="detail-row"><span class="detail-label">Room Type:</span><span class="detail-value">STANDARD (AC)</span></div>
        <div class="detail-row"><span class="detail-label">Booking Type:</span><span class="detail-value">Online Booking</span></div>
        <div class="detail-row"><span class="detail-label">Currency:</span><span class="detail-value">${order.order_response?.currency || 'INR'}</span></div>
      </div>
    </div>

    <!-- Charges -->
    <table class="charges-table">
      <thead>
        <tr><th>Description</th><th>Days/Qty</th><th class="amount">Rate</th><th class="amount">Amount</th></tr>
      </thead>
      <tbody>
        ${
          order.items?.length
            ? order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td class="amount">₹${item.price.toLocaleString('en-IN')}</td>
                <td class="amount">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')
            : `
              <tr>
                <td>Room Booking</td>
                <td>1</td>
                <td class="amount">₹${totalWithoutGST.toLocaleString('en-IN')}</td>
                <td class="amount">₹${totalWithoutGST.toLocaleString('en-IN')}</td>
              </tr>
            `
        }
      </tbody>
    </table>

    <!-- Totals -->
    <div class="total-section">
      <div class="total-row"><span>Subtotal:</span><span>₹${totalWithoutGST.toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span>SGST 9%:</span><span>₹${Math.round(gstAmount / 2).toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span>CGST 9%:</span><span>₹${Math.round(gstAmount / 2).toLocaleString('en-IN')}</span></div>
      <div class="total-row grand-total"><span>Bill Total:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span>Net Balance:</span><span class="nil-balance">${order?.order_response?.amount_paid > 0 ? 'PAID' : 'PENDING'}</span></div>
    </div>

    <div class="amount-words">(Rupees ${numberToWords(subtotal)} Only)</div>

    <!-- Footer -->
    <div class="footer">
      <div class="gst-info">GST No: 29AAAFH4367F1ZD<br>E & OE</div>
      <div class="signature">
        <div class="signature-line"></div>
        <div>Guest Signature</div>
      </div>
    </div>
  </div>
</body>
</html>`;
};

function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero';

  let words = '';
  let scaleIndex = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk > 0) {
      let chunkWords = '';
      if (chunk >= 100) {
        chunkWords += ones[Math.floor(chunk / 100)] + ' Hundred ';
        chunk %= 100;
      }
      if (chunk >= 20) {
        chunkWords += tens[Math.floor(chunk / 10)] + ' ';
        chunk %= 10;
      } else if (chunk >= 10) {
        chunkWords += teens[chunk - 10] + ' ';
        chunk = 0;
      }
      if (chunk > 0) {
        chunkWords += ones[chunk] + ' ';
      }
      words = chunkWords + scales[scaleIndex] + ' ' + words;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return words.trim();
}

module.exports = invoiceTemplate;
