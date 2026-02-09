import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generateSalesPdf = (sale) => {
  const doc = new jsPDF();

  // 🧾 HEADER
  doc.setFontSize(16);
  doc.text("INVOICE / BILL", 14, 15);

  doc.setFontSize(10);
  doc.text(`Bill No: ${sale.billNo}`, 14, 25);
  doc.text(`Date: ${new Date(sale.createdAt).toLocaleString()}`, 150, 25);

  // 👤 CUSTOMER
  doc.setFontSize(11);
  doc.text("Customer:", 14, 35);
  doc.setFontSize(10);
  doc.text(`${sale.customerName}`, 14, 42);

  // 🧺 ITEMS TABLE
  const tableData = sale.items.map((item, index) => [
    index + 1,
    item.productName,
    item.quantity,
    `₹${item.unitPrice}`,
    `₹${item.unitPrice * item.quantity}`,
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["#", "Item", "Qty", "Price", "Total"]],
    body: tableData,
  });

  const finalY = doc.lastAutoTable.finalY || 50;

  // 💰 TOTAL
  doc.setFontSize(11);
  doc.text(`Payment Mode: ${sale.paymentMode}`, 14, finalY + 10);
  doc.text(`Grand Total: ₹${sale.totalAmount}`, 14, finalY + 18);

  doc.save(`Bill_${sale.billNo}.pdf`);
};

export default generateSalesPdf;
