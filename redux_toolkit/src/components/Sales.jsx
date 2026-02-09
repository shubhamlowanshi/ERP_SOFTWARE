import React, { useEffect, useState } from "react";
import api from "../api/axios";
import generateSalesPdf from "../utils/generateSalesPdf";
import { toast } from "react-toastify";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const res = await api.get("/billing"); // backend route: /api/sales
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

  const totalSales = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Sales Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p className="text-gray-500">No sales yet</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow p-4">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Payment</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Invoice</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="text-center">
                  <td className="border p-2">
                    {new Date(sale.createdAt).toLocaleString()}
                  </td>

                  <td className="border p-2 font-semibold">
                    {sale.customerName}
                  </td>

                  <td className="border p-2">
                    {sale.items.map((item, i) => (
                      <div key={i}>
                        {item.productName} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="border p-2">{sale.paymentMode}</td>

                  <td className="border p-2 font-bold text-green-600">
                    ₹{sale.totalAmount}
                  </td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => generateSalesPdf(sale)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 text-lg font-bold">
            Total Sales: ₹{totalSales}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
