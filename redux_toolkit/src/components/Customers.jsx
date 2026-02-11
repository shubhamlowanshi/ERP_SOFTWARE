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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Customers
        </h2>

        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
          Total: {data.length}
        </span>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">

        {/* SCROLL AREA */}
        <div className="overflow-x-auto max-h-[72vh] overflow-y-auto">

          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b z-10">
              <tr className="text-gray-600 text-sm uppercase">
                <th className="p-4 text-left">Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Email</th>
                <th className="p-4">Total</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((c, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-blue-50 transition duration-150"
                >
                  <td className="p-4 font-semibold text-gray-800">
                    {c.customerName}
                  </td>

                  <td className="p-4 text-center text-gray-700">
                    {c.customerMobile}
                  </td>

                  <td className="p-4 text-center text-gray-600">
                    {c.customerEmail || "—"}
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg">
                      ₹{c.totalPurchase}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => sendWhatsApp(c)}
                      className="
                        bg-green-600 text-white 
                        px-4 py-1.5 rounded-xl 
                        hover:bg-green-700 
                        transition duration-150
                        shadow
                      "
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}

              {/* EMPTY STATE */}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-400"
                  >
                    No customers found yet 😔
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default Customers;
