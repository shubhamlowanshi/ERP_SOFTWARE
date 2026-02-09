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

    // 📱 Mobile: always start with +91 & allow only numbers after that
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
      businessName,
      businessType,
      gstNumber,
      panNumber,
      ownerName,
      mobile,
      email,
      city,
      state,
      address,
      password,
      confirmPassword,
    } = formData;

    if (
      !businessName ||
      !businessType ||
      !gstNumber ||
      !panNumber ||
      !ownerName ||
      !mobile ||
      !email ||
      !city ||
      !state ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      alert("All fields are mandatory ❗");
      return false;
    }

    // 📧 Email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Invalid email format ❌");
      return false;
    }

    // 📱 Mobile
    if (mobile.length !== 13) {
      alert("Mobile number must be 10 digits with +91 ❌");
      return false;
    }

    // 🧾 GST (15 chars)
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
      alert("Invalid GST Number ❌");
      return false;
    }

    // 🆔 PAN
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      alert("Invalid PAN Number ❌");
      return false;
    }

    // 🔐 Password
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Create Your ERP Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input name="businessName" placeholder="Business Name" className="input" onChange={handleChange} />
          <input name="businessType" placeholder="Business Type" className="input" onChange={handleChange} />
          <input name="gstNumber" placeholder="GST Number" className="input uppercase" onChange={handleChange} />
          <input name="panNumber" placeholder="PAN Number" className="input uppercase" onChange={handleChange} />
          <input name="ownerName" placeholder="Owner Full Name" className="input" onChange={handleChange} />
          <input name="mobile" placeholder="+91XXXXXXXXXX" className="input" value={formData.mobile} onChange={handleChange} />
          <input name="email" placeholder="Email" className="input" onChange={handleChange} />
          <input name="city" placeholder="City" className="input" onChange={handleChange} />
          <input name="state" placeholder="State" className="input" onChange={handleChange} />
          <input name="country" className="input" value="India" readOnly />

          <input type="password" name="password" placeholder="Password" className="input" onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input" onChange={handleChange} />

          <textarea
            name="address"
            placeholder="Business Address"
            className="input md:col-span-2"
            rows={3}
            onChange={handleChange}
          />

          <button className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
            Register & Continue 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
