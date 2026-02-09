import { useEffect, useState } from "react";
import api from "../api/axios";

const Customers = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/billing/customers/all");
    setData(res.data.customers);
  };

  const sendWhatsApp = (c) => {
    const message = `
Hello ${c.customerName},

Thank you for shopping with us 🙏

Total Purchase: ₹${c.totalPurchase}


Visit again ❤️
`;

    const url =
      `https://wa.me/91${c.customerMobile}?text=` +
      encodeURIComponent(message);

    window.open(url, "_blank");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Mobile</th>
            <th className="p-3">Email</th>
            <th className="p-3">Total</th>
            
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c, i) => (
            <tr key={i} className="border-b">
              <td className="p-3">{c.customerName}</td>

              <td className="p-3 text-center">
                {c.customerMobile}
              </td>

              <td className="p-3 text-center">
                {c.customerEmail || "—"}
              </td>

              <td className="p-3 text-center">
                ₹{c.totalPurchase}
              </td>
              <td className="p-3 text-center">
                <button
                  onClick={() => sendWhatsApp(c)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  WhatsApp
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
