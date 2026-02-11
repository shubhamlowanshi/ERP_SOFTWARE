import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import generateSalesPdf from "../utils/generateSalesPdf";
import { toast } from "react-toastify";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await api.get("/billing");
        setSales(res.data.sales || []);
      } catch (err) {
        console.error("🔥 Sales fetch error:", err);
        toast.error("Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const filtered = useMemo(() => {
    return sales.filter(
      (s) =>
        s.customerName.toLowerCase().includes(search.toLowerCase()) ||
        s.paymentMode.toLowerCase().includes(search.toLowerCase())
    );
  }, [sales, search]);

  const totalSales = filtered.reduce(
    (sum, s) => sum + (s.totalAmount || 0),
    0
  );

  const formatDate = (d) =>
    new Date(d).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const badge = (mode) => {
    const styles = {
      Cash: "bg-green-100 text-green-700",
      UPI: "bg-purple-100 text-purple-700",
      Card: "bg-blue-100 text-blue-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-semibold ${
          styles[mode] || "bg-gray-100"
        }`}
      >
        {mode}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 gap-3">
        <h2 className="text-2xl font-bold text-gray-700">
          📊 Sales Report
        </h2>

        <input
          placeholder="Search by name or payment..."
          className="border p-2 rounded-xl w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="animate-pulse">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No sales yet</p>
      ) : (
        <div className="bg-white rounded-2xl shadow p-3 md:p-4">

          {/* SCROLLABLE TABLE */}
          <div className="overflow-x-auto overflow-y-auto max-h-[72vh] border rounded-xl">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Invoice</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((sale) => (
                  <tr
                    key={sale._id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3 whitespace-nowrap">
                      {formatDate(sale.createdAt)}
                    </td>

                    <td className="p-3 font-semibold">
                      {sale.customerName}
                    </td>

                    {/* ITEMS COLUMN */}
                    <td className="p-3">
                      <details className="cursor-pointer">
                        <summary className="text-blue-600">
                          View Items ({sale.items.length})
                        </summary>

                        <div className="mt-1 space-y-1">
                          {sale.items.map((item, i) => (
                            <div
                              key={i}
                              className="text-xs bg-gray-50 p-1 rounded"
                            >
                              {item.productName} ×{" "}
                              <b>{item.quantity}</b>
                            </div>
                          ))}
                        </div>
                      </details>
                    </td>

                    <td className="p-3 text-center">
                      {badge(sale.paymentMode)}
                    </td>

                    <td className="p-3 text-center font-bold text-green-600">
                      ₹{sale.totalAmount}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => generateSalesPdf(sale)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER TOTAL */}
          <div className="text-right mt-3 text-lg font-bold bg-blue-50 p-3 rounded-xl">
            Total Sales: ₹{totalSales}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
