import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border border-gray-100 transition-all hover:shadow-2xl">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Login to manage your shop like a boss
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@shop.com"
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full mt-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
              onChange={handleChange}
              required
            />
          </div>

          {/* Forgot */}
          <div className="text-right">
            <span className="text-sm text-blue-600 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition-all">
            Sign In →
          </button>

        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-6">
          New here?{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            Create account
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
