import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    gstNumber: "",
    panNumber: "",
    ownerName: "",
    mobile: "+91",
    email: "",
    city: "",
    state: "",
    country: "India",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      if (!value.startsWith("+91")) return;
      const number = value.slice(3);
      if (number.length > 10) return;
      if (!/^\d*$/.test(number)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const {
      businessName, businessType, gstNumber, panNumber,
      ownerName, mobile, email, city, state,
      address, password, confirmPassword,
    } = formData;

    if (
      !businessName || !businessType || !gstNumber || !panNumber ||
      !ownerName || !mobile || !email || !city || !state ||
      !address || !password || !confirmPassword
    ) {
      alert("All fields are mandatory ❗");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format ❌");
      return false;
    }

    if (mobile.length !== 13) {
      alert("Mobile number must be 10 digits with +91 ❌");
      return false;
    }

    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
      alert("Invalid GST Number ❌");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      alert("Invalid PAN Number ❌");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters 🔐");
      return false;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful 🎉 Please login");
      navigate("/login");
    } else {
      alert(data.message || "Something went wrong ❌");
    }
  };

  const inputStyle =
    "w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all bg-gray-50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4 py-8">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Start Your Digital Dukaan 🚀
          </h2>
          <p className="text-gray-500 mt-1">
            30 seconds me pura ERP ready
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Business */}
          <div>
            <label className="label">Business Name</label>
            <input name="businessName" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Business Type</label>
            <input name="businessType" className={inputStyle} onChange={handleChange} />
          </div>

          {/* GST / PAN */}
          <div>
            <label className="label">GST Number</label>
            <input name="gstNumber" className={inputStyle + " uppercase"} onChange={handleChange} />
          </div>

          <div>
            <label className="label">PAN Number</label>
            <input name="panNumber" className={inputStyle + " uppercase"} onChange={handleChange} />
          </div>

          {/* Owner */}
          <div>
            <label className="label">Owner Name</label>
            <input name="ownerName" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Mobile</label>
            <input
              name="mobile"
              value={formData.mobile}
              className={inputStyle}
              onChange={handleChange}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="label">Email</label>
            <input name="email" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">City</label>
            <input name="city" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">State</label>
            <input name="state" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Country</label>
            <input value="India" readOnly className={inputStyle + " opacity-70"} />
          </div>

          {/* Passwords */}
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" className={inputStyle} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input type="password" name="confirmPassword" className={inputStyle} onChange={handleChange} />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="label">Business Address</label>
            <textarea
              name="address"
              rows={3}
              className={inputStyle}
              onChange={handleChange}
            />
          </div>

          {/* Submit */}
          <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all">
            Register & Continue 🚀
          </button>

        </form>

        <div className="text-center text-sm text-gray-500 mt-5">
          Already a pro?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </div>

      </div>
    </div>
  );
};

export default Register;
