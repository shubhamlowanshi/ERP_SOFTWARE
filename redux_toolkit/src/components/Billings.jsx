import React, { useEffect, useState, useMemo } from "react";
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

  const [search, setSearch] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  const [billId, setBillId] = useState(null);
  const [billConfirmed, setBillConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const res = await api.get("/inventory");
      setInventory(res.data);
    } catch {
      toast.error("Inventory load failed");
    }
  };

  /* =============== SEARCH FILTER =============== */
  const filteredInventory = useMemo(() => {
    return inventory.filter((p) =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    );
  }, [inventory, search]);

  /* =============== CART LOGIC =============== */
  const addToCart = (product) => {
    if (billConfirmed) return toast.warn("Bill already confirmed bro");

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

    toast.success("Added ⚡");
  };

  const updateQty = (id, delta) => {
    if (billConfirmed) return;

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

  /* =============== BILL CREATE =============== */
  const handleConfirmBill = async () => {
    if (!customerName.trim())
      return toast.error("Customer name required");

    if (!isValidMobile(customerMobile))
      return toast.error("Enter valid 10 digit mobile number");

    if (!isValidEmail(customerEmail))
      return toast.error("Enter valid email address");

    if (!cart.length)
      return toast.error("Cart empty");

    try {
      setLoading(true);

      const res = await api.post("/billing/create", {
        customerName,
        customerMobile,
        customerEmail,
        items: cart,
        paymentMode,
        totalAmount,
      });

      setBillId(res.data.bill._id);
      setBillConfirmed(true);

      toast.success("Bill locked & loaded 🚀");

      // Fresh inventory after billing
      await loadInventory();
    } catch {
      toast.error("Bill failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    const res = await api.get(`/billing/${billId}`);
    const bill = res.data.bill;

    generateInvoicePdf(bill);

    toast.success("PDF Ready boss 😎");

    // RESET EVERYTHING
    setCart([]);
    setCustomerName("");
    setCustomerMobile("");
    setCustomerEmail("");
    setBillConfirmed(false);
    setBillId(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-5">

      {/* ===== INVENTORY ===== */}
      <div className="md:col-span-2 bg-white p-4 rounded-2xl shadow-lg h-[86vh] overflow-y-auto border">
        <h2 className="text-xl font-bold mb-3 text-gray-700">
          🛍 Inventory
        </h2>

        {/* SEARCH BOX */}
        <input
          placeholder="Search product..."
          className="border p-2 mb-3 w-full rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInventory.map((p) => (
            <div
              key={p._id}
              onClick={() => addToCart(p)}
              className={`p-3 rounded-xl border cursor-pointer transition
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

              <p className="text-xs">
                Stock:
                <span
                  className={
                    p.stock < 5
                      ? "text-red-500"
                      : "text-green-600"
                  }
                >
                  {p.stock}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BILL CARD ===== */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border h-fit sticky top-4">
        <h2 className="text-xl font-bold mb-3 text-gray-700">
          🧾 Create Bill
        </h2>

        <input
          placeholder="Customer Name"
          className="border p-2.5 w-full mb-2 rounded-lg"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          disabled={billConfirmed}
        />

        <input
          placeholder="Mobile Number"
          maxLength={10}
          className="border p-2.5 w-full mb-2 rounded-lg"
          value={customerMobile}
          onChange={(e) =>
            setCustomerMobile(e.target.value.replace(/\D/g, ""))
          }
          disabled={billConfirmed}
        />

        <input
          placeholder="Email (optional)"
          className="border p-2.5 w-full mb-2 rounded-lg"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value.trim())}
          disabled={billConfirmed}
        />

        {/* PAYMENT MODE */}
        <select
          className="border p-2.5 w-full mb-2 rounded-lg"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          disabled={billConfirmed}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
        </select>

        {/* CART */}
        <div className="max-h-48 overflow-y-auto pr-1">
          {cart.map((i) => (
            <div
              key={i.productId}
              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2"
            >
              <span>{i.productName}</span>

              <div className="flex items-center gap-2">
                <button
                  disabled={billConfirmed}
                  onClick={() => updateQty(i.productId, -1)}
                  className="px-2 bg-red-100 rounded"
                >
                  -
                </button>

                <span>{i.quantity}</span>

                <button
                  disabled={billConfirmed}
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
          disabled={!cart.length || billConfirmed || loading}
          className="w-full mt-3 py-2.5 rounded-xl bg-blue-600 text-white"
        >
          {loading ? "Processing..." : "✅ Confirm Bill"}
        </button>

        <button
          onClick={handleGenerateBill}
          disabled={!billConfirmed}
          className="w-full mt-2 py-2.5 rounded-xl bg-green-600 text-white"
        >
          📄 Generate Bill
        </button>
      </div>
    </div>
  );
};

export default Billings;
