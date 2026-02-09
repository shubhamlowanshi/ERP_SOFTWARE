import React, { useState } from "react";
import api from "../api/axios";

const Settings = () => {
  const [companyName, setCompanyName] = useState("My ERP Pvt Ltd");
  const [gstRate, setGstRate] = useState(18);
  const [currency, setCurrency] = useState("₹");
  const [invoicePrefix, setInvoicePrefix] = useState("BILL-");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* ======================
     🔐 ACCOUNT ACTIONS
  ====================== */

  const handleLogoutAll = async () => {
    try {
      await api.post("/auth/logout-all");
      alert("Logged out from all devices");
      localStorage.clear();
      window.location.href = "/login";
    } catch (err) {
      alert("Failed to logout from all devices");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/auth/delete-account");
      localStorage.clear();
      window.location.href = "/signup";
    } catch (err) {
      alert("Account delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">System Settings</h1>

      {/* ======================
          🏢 COMPANY SETTINGS
      ====================== */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Business Settings</h2>

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="Invoice Prefix (e.g. BILL-)"
          value={invoicePrefix}
          onChange={(e) => setInvoicePrefix(e.target.value)}
          className="input"
        />

        <input
          type="number"
          placeholder="GST Rate (%)"
          value={gstRate}
          onChange={(e) => setGstRate(e.target.value)}
          className="input"
        />

        <input
          type="text"
          placeholder="Currency Symbol"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="input"
        />

        <button className="btn-primary">Save Business Settings</button>
      </section>

      {/* ======================
          🔐 SECURITY
      ====================== */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold text-lg">Security</h2>

        <input type="password" placeholder="Current Password" className="input" />
        <input type="password" placeholder="New Password" className="input" />
        <input type="password" placeholder="Confirm New Password" className="input" />

        <button className="btn-primary">Update Password</button>

        <hr />

        <button
          onClick={handleLogoutAll}
          className="w-full py-3 border border-red-500 text-red-600 rounded-lg hover:bg-red-50"
        >
          Logout from all devices
        </button>
      </section>

      {/* ======================
          ☠️ DANGER ZONE
      ====================== */}
      <section className="bg-red-50 p-6 rounded-xl border border-red-200 space-y-4">
        <h2 className="font-semibold text-lg text-red-600">Danger Zone</h2>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete My Account
        </button>
      </section>

      {/* ======================
          ❗ DELETE MODAL
      ====================== */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-red-600">
              Delete Account Permanently?
            </h3>
            <p className="text-sm text-gray-600">
              This will delete all your data, bills, inventory.  
              This action cannot be undone.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
