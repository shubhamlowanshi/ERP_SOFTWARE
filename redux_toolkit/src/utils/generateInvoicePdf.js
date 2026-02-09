import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoicePdf = ({
  billNo,
  customerName,
  customerMobile,
  customerEmail,
  items,
  totalAmount,
  paymentMode,
}) => {
  const doc = new jsPDF();

  // 🧾 HEADER
  doc.setFontSize(16);
  doc.text("INVOICE", 14, 15);

  doc.setFontSize(10);
  doc.text(`Bill No: ${billNo}`, 14, 25);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 25);

  // 👤 CUSTOMER
  doc.setFontSize(11);
  doc.text("Customer Details:", 14, 35);

  doc.setFontSize(10);
  doc.text(`Name: ${customerName}`, 14, 42);
  doc.text(`Mobile: ${customerMobile}`, 14, 48);

  if (customerEmail) {
    doc.text(`Email: ${customerEmail}`, 14, 54);
  }

  // 🧺 ITEMS TABLE
  const tableData = items.map((item, index) => [
    index + 1,
    item.productName,
    item.quantity,
    `₹${item.unitPrice}`,
    `₹${item.unitPrice * item.quantity}`,
  ]);

  autoTable(doc, {
    startY: customerEmail ? 62 : 58,
    head: [["#", "Item", "Qty", "Price", "Total"]],
    body: tableData,
  });

  const finalY = doc.lastAutoTable.finalY || 62;

  // 💰 TOTAL
  doc.setFontSize(11);
  doc.text(`Payment Mode: ${paymentMode}`, 14, finalY + 10);
  doc.text(`Grand Total: ₹${totalAmount}`, 14, finalY + 18);

  doc.save(`Bill_${billNo}.pdf`);
};

export default generateInvoicePdf;
