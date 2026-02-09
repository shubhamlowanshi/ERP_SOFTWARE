import React, { useEffect, useState, useMemo } from "react";
import api from "../api/axios";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    productName: "",
    category: "",
    stock: "",
    costPrice: "",
    sellingPrice: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔎 Search + Filter
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });

  // 🆙 Sort
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  // =========================
  // 🔥 LIVE STOCK STATUS (UI)
  // =========================
  const getStockStatusUI = (stock) => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        color: "bg-red-100 text-red-700",
      };
    }
    if (stock < 10) {
      return {
        label: "Low Stock",
        color: "bg-yellow-100 text-yellow-700",
      };
    }
    return {
      label: "In Stock",
      color: "bg-green-100 text-green-700",
    };
  };

  // =========================
  // FETCH INVENTORY
  // =========================
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/inventory");
      setInventory(data);
    } catch (err) {
      console.error("Inventory fetch error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to fetch inventory ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // =========================
  // FORM HANDLING
  // =========================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName || !form.stock)
      return alert("Product name & stock required");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;
    if (!userId) return alert("User not found. Please login again.");

    try {
      const payload = {
        ...form,
        stock: Number(form.stock),
        costPrice: Number(form.costPrice),
        sellingPrice: Number(form.sellingPrice),
        userId,
      };

      if (editId) await api.put(`/inventory/${editId}`, payload);
      else await api.post("/inventory", payload);

      setForm({
        productName: "",
        category: "",
        stock: "",
        costPrice: "",
        sellingPrice: "",
      });
      setEditId(null);
      fetchInventory();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save product ❌");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      productName: item.productName,
      category: item.category,
      stock: item.stock,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/inventory/${id}`);
      fetchInventory();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete ❌");
    }
  };

  // =========================
  // SORT HANDLER
  // =========================
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // =========================
  // FILTER + SEARCH + SORT
  // =========================
  const filteredInventory = useMemo(() => {
    let data = [...inventory];

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(
        (item) =>
          item.productName.toLowerCase().includes(s) ||
          (item.category && item.category.toLowerCase().includes(s))
      );
    }

    if (priceFilter.min || priceFilter.max) {
      data = data.filter((item) => {
        if (priceFilter.min && item.sellingPrice < priceFilter.min)
          return false;
        if (priceFilter.max && item.sellingPrice > priceFilter.max)
          return false;
        return true;
      });
    }

    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [inventory, search, priceFilter, sortConfig]);

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        
        <p className="text-gray-600">
          Live stock based status 
        </p>
        
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid gap-4 md:grid-cols-5"
      >
        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          placeholder="Product Name"
          className="input"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="input"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="input"
        />
        <input
          name="costPrice"
          type="number"
          value={form.costPrice}
          onChange={handleChange}
          placeholder="Cost Price"
          className="input"
        />
        <input
          name="sellingPrice"
          type="number"
          value={form.sellingPrice}
          onChange={handleChange}
          placeholder="Selling Price"
          className="input"
        />

        <button className="md:col-span-5 bg-blue-600 text-white py-2 rounded-lg">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* TABLE */}
      {/* ======== TOOLBAR (Search + Sort Buttons) ======== */}
<div className="flex flex-wrap gap-3 mb-3 items-center bg-white p-3 rounded-lg shadow">

  {/* Search */}
  <input
    placeholder="Search product..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="input flex-1"
  />

  {/* Sort Buttons */}
  <button
    onClick={() => handleSort("productName")}
    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
  >
    A → Z
  </button>

  <button
    onClick={() => handleSort("sellingPrice")}
    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
  >
    Price
  </button>

  <button
    onClick={() => handleSort("stock")}
    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
  >
    Stock
  </button>

  {/* Quick Filters */}
  <button
    onClick={() =>
      setPriceFilter({ min: "", max: 500 })
    }
    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded"
  >
    Under ₹500
  </button>

  <button
    onClick={() =>
      setPriceFilter({ min: 500, max: 2000 })
    }
    className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded"
  >
    ₹500 - ₹2000
  </button>

  <button
    onClick={() =>
      setPriceFilter({ min: "", max: "" })
    }
    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded"
  >
    Clear
  </button>

</div>
{/* ======== END TOOLBAR ======== */}

      <div className="bg-white rounded-xl shadow overflow-auto">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Selling</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const status = getStockStatusUI(item.stock);
                return (
                  <tr key={item._id} className="border-t text-center">
                    <td className="p-4 text-left font-medium">
                      {item.productName}
                    </td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">{item.stock}</td>
                    <td className="p-4">₹{item.costPrice}</td>
                    <td className="p-4">₹{item.sellingPrice}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inventory;
