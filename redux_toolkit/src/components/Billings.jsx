import React, { useEffect, useState } from "react";
import api from "../api/axios";
import generateInvoicePdf from "../utils/generateInvoicePdf";
import { toast } from "react-toastify";

/* ================= HELPERS ================= */
const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);
const isValidEmail = (email) =>
  email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/* ================= COMPONENT ================= */
const Billings = () => {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [billId, setBillId] = useState(null);
  const [billConfirmed, setBillConfirmed] = useState(false);

  useEffect(() => {
    api.get("/inventory")
      .then((res) => setInventory(res.data))
      .catch(() => toast.error("Inventory load failed"));
  }, []);

  const addToCart = (product) => {
    if (product.stock === 0)
      return toast.error(`${product.productName} out of stock`);

    const exists = cart.find((i) => i.productId === product._id);

    if (exists) {
      if (exists.quantity >= product.stock)
        return toast.error("Stock limit reached");

      setCart(
        cart.map((i) =>
          i.productId === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.productName,
          unitPrice: product.sellingPrice,
          quantity: 1,
          stock: product.stock,
        },
      ]);
    }
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.productId !== id) return i;

          const qty = i.quantity + delta;
          if (qty > i.stock) {
            toast.error("Out of stock");
            return i;
          }
          if (qty <= 0) return null;

          return { ...i, quantity: qty };
        })
        .filter(Boolean)
    );
  };

  const totalAmount = cart.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );

  const handleConfirmBill = async () => {
    if (!customerName) return toast.error("Name required");
    if (!isValidMobile(customerMobile))
      return toast.error("Invalid mobile");
    if (!isValidEmail(customerEmail))
      return toast.error("Invalid email");
    if (!cart.length) return toast.error("Cart empty");

    try {
      const res = await api.post("/billing/create", {
        customerName,
        customerMobile,
        customerEmail,
        items: cart,
        paymentMode: "Cash",
        totalAmount,
      });

      setBillId(res.data.bill._id);
      setBillConfirmed(true);
      toast.success("Bill confirmed");
    } catch {
      toast.error("Bill failed");
    }
  };

  const handleGenerateBill = async () => {
    const res = await api.get(`/billing/${billId}`);
    const bill = res.data.bill;

    generateInvoicePdf(bill);

    toast.success("PDF Ready");

    setCart([]);
    setCustomerName("");
    setCustomerMobile("");
    setCustomerEmail("");
    setBillConfirmed(false);
    setBillId(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* INVENTORY */}
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow-lg h-[86vh] overflow-y-auto border">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          🛍 Inventory
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {inventory.map((p) => (
            <div
              key={p._id}
              onClick={() => addToCart(p)}
              className={`p-3 rounded-xl border transition transform hover:scale-[1.02]
                ${
                  p.stock === 0
                    ? "opacity-50"
                    : "hover:border-blue-500 hover:shadow"
                }`}
            >
              <p className="font-semibold">{p.productName}</p>
              <p className="text-blue-600 font-bold">
                ₹{p.sellingPrice}
              </p>
              <p className="text-xs text-gray-500">
                Stock: {p.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BILL CARD */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-3 text-gray-700">
          🧾 Create Bill
        </h2>

        {[
          {
            ph: "Customer Name",
            val: customerName,
            set: setCustomerName,
          },
          {
            ph: "Mobile Number",
            val: customerMobile,
            set: setCustomerMobile,
          },
          {
            ph: "Email (optional)",
            val: customerEmail,
            set: setCustomerEmail,
          },
        ].map((f, i) => (
          <input
            key={i}
            placeholder={f.ph}
            className="border p-2.5 w-full mb-2 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
            value={f.val}
            onChange={(e) => f.set(e.target.value)}
            disabled={billConfirmed}
          />
        ))}

        {/* CART ITEMS */}
        <div className="max-h-48 overflow-y-auto pr-1">
          {cart.map((i) => (
            <div
              key={i.productId}
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span className="text-sm">{i.productName}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(i.productId, -1)}
                  className="px-2 bg-red-100 rounded"
                >
                  -
                </button>

                <span className="font-semibold">
                  {i.quantity}
                </span>

                <button
                  onClick={() => updateQty(i.productId, 1)}
                  className="px-2 bg-green-100 rounded"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <p className="font-bold mt-3 text-lg">
          Total: ₹{totalAmount}
        </p>

        <button
          onClick={handleConfirmBill}
          disabled={!cart.length || billConfirmed}
          className="w-full mt-3 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition"
        >
          ✅ Confirm Bill
        </button>

        <button
          onClick={handleGenerateBill}
          disabled={!billConfirmed}
          className="w-full mt-2 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:bg-gray-300 transition"
        >
          📄 Generate Bill
        </button>
      </div>
    </div>
  );
};

export default Billings;
