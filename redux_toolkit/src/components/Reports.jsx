import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [type, setType] = useState("monthly");

  const getWeekNumber = (date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/billing");
        setSales(res.data.sales || []);
      } catch (err) {
        console.error("Report fetch error:", err);
        setSales([]);
      }
    };
    fetchSales();
  }, []);

  const groupedData = useMemo(() => {
    if (!Array.isArray(sales)) return {};

    return sales.reduce((acc, sale) => {
      if (!sale?.createdAt) return acc;

      const date = new Date(sale.createdAt);
      let key = "";

      if (type === "weekly") key = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      else if (type === "monthly")
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      else key = `${date.getFullYear()}`;

      acc[key] = (acc[key] || 0) + (sale.totalAmount || 0);
      return acc;
    }, {});
  }, [sales, type]);

  const grandTotal = useMemo(
    () => sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0),
    [sales]
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Sales Report", 14, 15);
    doc.setFontSize(11);
    doc.text(`Report Type: ${type.toUpperCase()}`, 14, 25);
    doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 14, 32);

    const tableData = Object.entries(groupedData).map(([key, value]) => [
      key,
      `₹ ${value.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [
        [
          type === "weekly" ? "Week" : type === "monthly" ? "Month" : "Year",
          "Total Sales (₹)",
        ],
      ],
      body: tableData.length ? tableData : [["—", "₹ 0.00"]],
      styles: { halign: "center" },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.text(
      `Overall Sales: ₹ ${grandTotal.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`sales-report-${type}.pdf`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Sales Reports
        </h2>

        <div className="flex flex-wrap gap-2">
          {["weekly", "monthly", "yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`
                px-4 py-2 rounded-xl font-semibold transition
                ${
                  type === t
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-200 hover:bg-gray-300"
                }
              `}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={downloadPDF}
          className="
            bg-green-600 text-white px-5 py-2 rounded-xl
            hover:bg-green-700 transition shadow
          "
        >
          📥 Download PDF
        </button>

        <div className="text-lg font-bold bg-blue-50 px-4 py-2 rounded-xl">
          Overall: ₹{grandTotal.toFixed(2)}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">

        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-gray-600 uppercase text-sm">
                <th className="border p-3">
                  {type === "weekly"
                    ? "Week"
                    : type === "monthly"
                    ? "Month"
                    : "Year"}
                </th>
                <th className="border p-3">Total Sales (₹)</th>
              </tr>
            </thead>

            <tbody>
              {Object.keys(groupedData).length === 0 ? (
                <tr>
                  <td
                    colSpan="2"
                    className="text-center p-10 text-gray-400"
                  >
                    No data available 😔
                  </td>
                </tr>
              ) : (
                Object.entries(groupedData).map(([key, total]) => (
                  <tr
                    key={key}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border p-3 font-semibold text-center">
                      {key}
                    </td>

                    <td className="border p-3 text-center">
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg font-bold">
                        ₹{total.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
