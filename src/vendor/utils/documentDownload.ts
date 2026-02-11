/**
 * Document Download Utilities
 * Handles PDF and document generation for invoices, reports, and other vendor documents
 */

import { formatCurrency } from './formatCurrency';
import { formatDate } from './formatDate';

// Document types supported
export type DocumentType = 
  | 'invoice' 
  | 'delivery-challan' 
  | 'settlement-report' 
  | 'performance-report'
  | 'payout-statement';

/**
 * Generate and download a CSV file
 */
export function downloadCSV(data: string[][], filename: string) {
  const csvContent = data.map(row => row.map(cell => {
    // Escape quotes and wrap in quotes if contains comma
    const cellStr = String(cell);
    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
      return `"${cellStr.replace(/"/g, '""')}"`;
    }
    return cellStr;
  }).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate and download a text-based PDF (using HTML to PDF conversion)
 */
export function generatePDFDocument(content: string, filename: string) {
  // Create a styled HTML document for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${filename}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
          color: #1a1a1a;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2F3E46;
        }
        .logo {
          font-size: 24pt;
          font-weight: bold;
          color: #2F3E46;
          margin-bottom: 5px;
        }
        .tagline {
          font-size: 9pt;
          color: #666;
        }
        .document-title {
          font-size: 16pt;
          font-weight: bold;
          color: #2F3E46;
          margin: 20px 0 10px 0;
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          font-size: 11pt;
          font-weight: bold;
          color: #2F3E46;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #ddd;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }
        .label {
          font-weight: 600;
          color: #555;
        }
        .value {
          color: #1a1a1a;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th {
          background-color: #2F3E46;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: 600;
          font-size: 9pt;
        }
        td {
          padding: 8px 10px;
          border-bottom: 1px solid #e0e0e0;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .total-row {
          font-weight: bold;
          background-color: #f0f0f0 !important;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #2F3E46;
          text-align: center;
          font-size: 8pt;
          color: #666;
        }
        .notes {
          background-color: #f9f9f9;
          padding: 15px;
          border-left: 3px solid #D2B48C;
          margin: 20px 0;
          font-size: 9pt;
        }
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  // Create a blob and trigger download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.html`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generate Invoice PDF
 */
export function generateInvoice(orderData: {
  orderNumber: string;
  orderDate: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  deliveryAddress: string;
  deliveryArea: string;
  buyerName: string;
  vendorName: string;
  vendorGST?: string;
  vendorAddress?: string;
}) {
  const content = `
    <div class="header">
      <div class="logo">Vendara</div>
      <div class="tagline">Building Materials & Labor Marketplace</div>
    </div>

    <div class="document-title">TAX INVOICE</div>

    <div class="section">
      <div class="section-title">Invoice Details</div>
      <div class="info-row">
        <span class="label">Invoice Number:</span>
        <span class="value">INV-${orderData.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="label">Invoice Date:</span>
        <span class="value">${formatDate(orderData.orderDate)}</span>
      </div>
      <div class="info-row">
        <span class="label">Order Number:</span>
        <span class="value">${orderData.orderNumber}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Vendor Details (From)</div>
      <div class="info-row">
        <span class="label">Vendor Name:</span>
        <span class="value">${orderData.vendorName}</span>
      </div>
      ${orderData.vendorGST ? `
      <div class="info-row">
        <span class="label">GST Number:</span>
        <span class="value">${orderData.vendorGST}</span>
      </div>
      ` : ''}
      ${orderData.vendorAddress ? `
      <div class="info-row">
        <span class="label">Address:</span>
        <span class="value">${orderData.vendorAddress}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Buyer Details (To)</div>
      <div class="info-row">
        <span class="label">Buyer Name:</span>
        <span class="value">${orderData.buyerName}</span>
      </div>
      <div class="info-row">
        <span class="label">Delivery Address:</span>
        <span class="value">${orderData.deliveryAddress}, ${orderData.deliveryArea}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Item Details</div>
      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th style="text-align: right;">Quantity</th>
            <th style="text-align: right;">Unit Price</th>
            <th style="text-align: right;">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${orderData.itemName}</td>
            <td style="text-align: right;">${orderData.quantity} ${orderData.unit}</td>
            <td style="text-align: right;">${formatCurrency(orderData.unitPrice)}</td>
            <td style="text-align: right;">${formatCurrency(orderData.totalAmount)}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">TOTAL AMOUNT:</td>
            <td style="text-align: right;">${formatCurrency(orderData.totalAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="notes">
      <strong>Notes:</strong><br>
      • Payment will be processed as per Vendara's standard settlement schedule.<br>
      • This is a computer-generated invoice and does not require a physical signature.<br>
      • For any queries, please contact Vendara support.
    </div>

    <div class="footer">
      Vendara Marketplace | Hyderabad, India<br>
      This is a system-generated document. For support, visit your vendor portal.
    </div>
  `;

  generatePDFDocument(content, `Invoice_${orderData.orderNumber}_${formatDate(new Date())}`);
}

/**
 * Generate Delivery Challan
 */
export function generateDeliveryChallan(orderData: {
  orderNumber: string;
  orderDate: string;
  deliveryDate?: string;
  itemName: string;
  quantity: number;
  unit: string;
  deliveryAddress: string;
  deliveryArea: string;
  buyerName: string;
  vendorName: string;
  deliveryInstructions?: string;
}) {
  const content = `
    <div class="header">
      <div class="logo">Vendara</div>
      <div class="tagline">Building Materials & Labor Marketplace</div>
    </div>

    <div class="document-title">DELIVERY CHALLAN</div>

    <div class="section">
      <div class="section-title">Challan Details</div>
      <div class="info-row">
        <span class="label">Challan Number:</span>
        <span class="value">DC-${orderData.orderNumber}</span>
      </div>
      <div class="info-row">
        <span class="label">Challan Date:</span>
        <span class="value">${formatDate(orderData.deliveryDate || orderData.orderDate)}</span>
      </div>
      <div class="info-row">
        <span class="label">Order Number:</span>
        <span class="value">${orderData.orderNumber}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Supplier Details (From)</div>
      <div class="info-row">
        <span class="label">Vendor Name:</span>
        <span class="value">${orderData.vendorName}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Delivery Details (To)</div>
      <div class="info-row">
        <span class="label">Buyer Name:</span>
        <span class="value">${orderData.buyerName}</span>
      </div>
      <div class="info-row">
        <span class="label">Delivery Address:</span>
        <span class="value">${orderData.deliveryAddress}, ${orderData.deliveryArea}</span>
      </div>
      ${orderData.deliveryInstructions ? `
      <div class="info-row">
        <span class="label">Special Instructions:</span>
        <span class="value">${orderData.deliveryInstructions}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Material Details</div>
      <table>
        <thead>
          <tr>
            <th>Item Description</th>
            <th style="text-align: right;">Quantity Delivered</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${orderData.itemName}</td>
            <td style="text-align: right;">${orderData.quantity} ${orderData.unit}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section" style="margin-top: 60px;">
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 45%;">
          <div style="border-top: 2px solid #2F3E46; padding-top: 10px;">
            <strong>Vendor Signature</strong><br>
            <span style="font-size: 8pt; color: #666;">Name: ${orderData.vendorName}</span>
          </div>
        </div>
        <div style="width: 45%;">
          <div style="border-top: 2px solid #2F3E46; padding-top: 10px;">
            <strong>Buyer Signature</strong><br>
            <span style="font-size: 8pt; color: #666;">Name: ${orderData.buyerName}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="notes">
      <strong>Notes:</strong><br>
      • Please verify the quantity and quality of materials upon delivery.<br>
      • Report any discrepancies immediately through the Vendara app.<br>
      • This challan must be signed by both parties for order completion.
    </div>

    <div class="footer">
      Vendara Marketplace | Hyderabad, India<br>
      This is a system-generated document.
    </div>
  `;

  generatePDFDocument(content, `DeliveryChallan_${orderData.orderNumber}_${formatDate(new Date())}`);
}

/**
 * Generate Settlement Report
 */
export function generateSettlementReport(settlementData: {
  settlementId: string;
  settlementDate: string;
  processedAt?: string;
  transactionCount: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  bankAccountNumber: string;
  ifscCode: string;
  paymentReferenceNumber?: string;
  transactions?: Array<{
    orderNumber: string;
    itemName: string;
    date: string;
    amount: number;
  }>;
}) {
  const transactionsTable = settlementData.transactions && settlementData.transactions.length > 0 ? `
    <div class="section">
      <div class="section-title">Transaction Breakdown</div>
      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Item</th>
            <th>Date</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${settlementData.transactions.map(txn => `
            <tr>
              <td>${txn.orderNumber}</td>
              <td>${txn.itemName}</td>
              <td>${formatDate(txn.date)}</td>
              <td style="text-align: right;">${formatCurrency(txn.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : '';

  const content = `
    <div class="header">
      <div class="logo">Vendara</div>
      <div class="tagline">Building Materials & Labor Marketplace</div>
    </div>

    <div class="document-title">SETTLEMENT STATEMENT</div>

    <div class="section">
      <div class="section-title">Settlement Details</div>
      <div class="info-row">
        <span class="label">Settlement ID:</span>
        <span class="value">${settlementData.settlementId}</span>
      </div>
      <div class="info-row">
        <span class="label">Settlement Date:</span>
        <span class="value">${formatDate(settlementData.settlementDate)}</span>
      </div>
      ${settlementData.processedAt ? `
      <div class="info-row">
        <span class="label">Processed On:</span>
        <span class="value">${formatDate(settlementData.processedAt)}</span>
      </div>
      ` : ''}
      ${settlementData.paymentReferenceNumber ? `
      <div class="info-row">
        <span class="label">Payment Reference:</span>
        <span class="value">${settlementData.paymentReferenceNumber}</span>
      </div>
      ` : ''}
    </div>

    <div class="section">
      <div class="section-title">Bank Details</div>
      <div class="info-row">
        <span class="label">Account Number:</span>
        <span class="value">${settlementData.bankAccountNumber}</span>
      </div>
      <div class="info-row">
        <span class="label">IFSC Code:</span>
        <span class="value">${settlementData.ifscCode}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Settlement Summary</div>
      <table>
        <tbody>
          <tr>
            <td><strong>Total Transactions:</strong></td>
            <td style="text-align: right;">${settlementData.transactionCount}</td>
          </tr>
          <tr>
            <td><strong>Gross Amount:</strong></td>
            <td style="text-align: right;">${formatCurrency(settlementData.grossAmount)}</td>
          </tr>
          ${settlementData.deductions > 0 ? `
          <tr style="color: #dc2626;">
            <td><strong>Deductions (Penalties/Fees):</strong></td>
            <td style="text-align: right;">-${formatCurrency(settlementData.deductions)}</td>
          </tr>
          ` : ''}
          <tr class="total-row">
            <td><strong>NET SETTLEMENT AMOUNT:</strong></td>
            <td style="text-align: right;">${formatCurrency(settlementData.netAmount)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    ${transactionsTable}

    <div class="notes">
      <strong>Important Information:</strong><br>
      • The settlement amount will be credited to your registered bank account within 24-48 hours.<br>
      • Deductions may include late delivery penalties, quality issues, or platform fees.<br>
      • For any discrepancies, please contact Vendara support within 7 days.<br>
      • Keep this statement for your tax and accounting records.
    </div>

    <div class="footer">
      Vendara Marketplace | Hyderabad, India<br>
      For support: vendor-support@vendara.com | This is a system-generated document.
    </div>
  `;

  generatePDFDocument(content, `Settlement_${settlementData.settlementId}_${formatDate(new Date())}`);
}

/**
 * Generate Performance Report
 */
export function generatePerformanceReport(performanceData: {
  vendorName: string;
  reportPeriod: string;
  overallScore: number;
  rating: string;
  acceptanceRate: number;
  onTimeDeliveryRate: number;
  averageResponseTime: number;
  ordersCompleted: number;
  totalRevenue: number;
}) {
  const content = `
    <div class="header">
      <div class="logo">Vendara</div>
      <div class="tagline">Building Materials & Labor Marketplace</div>
    </div>

    <div class="document-title">VENDOR PERFORMANCE REPORT</div>

    <div class="section">
      <div class="section-title">Report Details</div>
      <div class="info-row">
        <span class="label">Vendor Name:</span>
        <span class="value">${performanceData.vendorName}</span>
      </div>
      <div class="info-row">
        <span class="label">Report Period:</span>
        <span class="value">${performanceData.reportPeriod}</span>
      </div>
      <div class="info-row">
        <span class="label">Generated On:</span>
        <span class="value">${formatDate(new Date())}</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Overall Performance</div>
      <table>
        <tbody>
          <tr class="total-row">
            <td><strong>Overall Performance Score:</strong></td>
            <td style="text-align: right; font-size: 14pt; color: ${performanceData.overallScore >= 75 ? '#16a34a' : '#dc2626'};">
              ${performanceData.overallScore}/100
            </td>
          </tr>
          <tr>
            <td><strong>Rating:</strong></td>
            <td style="text-align: right;">${performanceData.rating}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <div class="section-title">Key Metrics</div>
      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th style="text-align: right;">Performance</th>
            <th style="text-align: right;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Acceptance Rate</td>
            <td style="text-align: right;">${performanceData.acceptanceRate}%</td>
            <td style="text-align: right; color: ${performanceData.acceptanceRate >= 80 ? '#16a34a' : '#dc2626'};">
              ${performanceData.acceptanceRate >= 80 ? 'Good' : 'Needs Improvement'}
            </td>
          </tr>
          <tr>
            <td>On-Time Delivery Rate</td>
            <td style="text-align: right;">${performanceData.onTimeDeliveryRate}%</td>
            <td style="text-align: right; color: ${performanceData.onTimeDeliveryRate >= 90 ? '#16a34a' : '#dc2626'};">
              ${performanceData.onTimeDeliveryRate >= 90 ? 'Excellent' : 'Needs Improvement'}
            </td>
          </tr>
          <tr>
            <td>Average Response Time</td>
            <td style="text-align: right;">${performanceData.averageResponseTime} min</td>
            <td style="text-align: right; color: ${performanceData.averageResponseTime <= 30 ? '#16a34a' : '#dc2626'};">
              ${performanceData.averageResponseTime <= 30 ? 'Fast' : 'Slow'}
            </td>
          </tr>
          <tr>
            <td>Orders Completed</td>
            <td style="text-align: right;">${performanceData.ordersCompleted}</td>
            <td style="text-align: right;">-</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total Revenue</strong></td>
            <td style="text-align: right;"><strong>${formatCurrency(performanceData.totalRevenue)}</strong></td>
            <td style="text-align: right;">-</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="notes">
      <strong>Performance Guidelines:</strong><br>
      • <strong>Overall Score:</strong> Maintain above 75 to remain in good standing<br>
      • <strong>Acceptance Rate:</strong> Target 80%+ for better order allocation<br>
      • <strong>On-Time Delivery:</strong> Maintain 90%+ to avoid penalties<br>
      • <strong>Response Time:</strong> Respond within 30 minutes for priority matching
    </div>

    <div class="footer">
      Vendara Marketplace | Hyderabad, India<br>
      Confidential Vendor Performance Report
    </div>
  `;

  generatePDFDocument(content, `Performance_Report_${formatDate(new Date())}`);
}
