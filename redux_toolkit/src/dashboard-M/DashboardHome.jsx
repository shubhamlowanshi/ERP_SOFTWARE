import { useEffect, useState } from "react";
import SalesChart from "../components/dashboard/charts/SalesChart";
import DailySalesChart from "../components/dashboard/charts/DailySalesChart";
import StockChart from "../components/dashboard/charts/StockChart";
import api from "../api/axios";
const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState([
    { title: "Today Sales", value: "₹0", color: "from-green-500 to-emerald-600" },
    { title: "Monthly Revenue", value: "₹0", color: "from-blue-500 to-indigo-600" },
    { title: "Net Profit", value: "₹0", color: "from-purple-500 to-pink-600" },
    { title: "Low Stock Items", value: 0, color: "from-red-500 to-rose-600" },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const res = await api.get("/dashboard/overview");

        setCards([
          {
            title: "Today Sales",
            value: `₹${res.data.todaySales}`,
            color: "from-green-500 to-emerald-600",
          },
          {
            title: "Monthly Revenue",
            value: `₹${res.data.monthlyRevenue}`,
            color: "from-blue-500 to-indigo-600",
          },
          {
            title: "Net Profit",
            value: `₹${res.data.profit}`,
            color: "from-purple-500 to-pink-600",
          },
          {
            title: "Low Stock Items",
            value: res.data.lowStockCount,
            color: "from-red-500 to-rose-600",
          },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            🚀 Business Overview
          </h1>
          <p className="text-gray-500 text-sm md:text-base">
            Real-time snapshot of your empire, boss
          </p>
        </div>

        <span className="flex items-center gap-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
          {/* 💚 Blinking green dot */}
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live Data
        </span>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, i) => (
          <div
            key={i}
            className={`relative overflow-hidden bg-white rounded-2xl shadow hover:shadow-lg transition group`}
          >
            {/* Gradient strip */}
            <div
              className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.color}`}
            />

            <div className="p-5 md:p-6">
              <p className="text-sm text-gray-500">{item.title}</p>

              {loading ? (
                <div className="h-7 w-24 bg-gray-200 animate-pulse rounded mt-2" />
              ) : (
                <h3 className="text-2xl md:text-3xl font-extrabold mt-2 group-hover:scale-105 transition">
                  {item.value}
                </h3>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid gap-5 md:gap-6 lg:grid-cols-2">
        <div className="bg-white p-3 md:p-4 rounded-2xl shadow hover:shadow-lg transition">
          <SalesChart />
        </div>

        <div className="bg-white p-3 md:p-4 rounded-2xl shadow hover:shadow-lg transition">
          <DailySalesChart />
        </div>

        <div className="lg:col-span-2 bg-white p-3 md:p-4 rounded-2xl shadow hover:shadow-lg transition">
          <StockChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
