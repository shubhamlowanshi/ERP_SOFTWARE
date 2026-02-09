// utils/generateBillPdf.js
import PDFDocument from "pdfkit";
import fs from "fs";

const generateBillPdf = (bill) => {
  const doc = new PDFDocument();
  const filePath = `invoices/bill-${bill._id}.pdf`;

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.text(`Customer: ${bill.customerName}`);
  doc.text(`Phone: ${bill.phone || "-"}`);
  doc.text(`Email: ${bill.email || "-"}`);
  doc.moveDown();

  bill.products.forEach((p, i) => {
    doc.text(
      `${i + 1}. ${p.productName} | ₹${p.price} x ${p.quantity} = ₹${p.total}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${bill.totalAmount}`, {
    align: "right",
  });

  doc.end();

  return filePath;
};

export default generateBillPdf;
