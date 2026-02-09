  import { useEffect, useState } from "react";
  import SalesChart from "../components/dashboard/charts/SalesChart";
  // import ProfitLossChart from "../components/dashboard/charts/ProfitLossChart";
  import DailySalesChart from "../components/dashboard/charts/DailySalesChart";
  // import ExpenseChart from "../components/dashboard/charts/ExpenseChart";
  import StockChart from "../components/dashboard/charts/StockChart";
  import api from "../api/axios";

  const DashboardHome = () => {
    const [cards, setCards] = useState([
      { title: "Today Sales", value: "₹0" },
      { title: "Monthly Revenue", value: "₹0" },
      { title: "Net Profit", value: "₹0" },
      { title: "Low Stock Items", value: 0 },
    ]);

    useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/overview");

        setCards([
          { title: "Today Sales", value: `₹${res.data.todaySales}` },
          { title: "Monthly Revenue", value: `₹${res.data.monthlyRevenue}` },
          { title: "Net Profit", value: `₹${res.data.profit}` },
          { title: "Low Stock Items", value: res.data.lowStockCount },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchDashboardData();
  }, []);
    return (
      <div className="space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold mb-1">Business Overview</h1>
          <p className="text-gray-600">
            Real-time snapshot of your business performance
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow">
              <p className="text-sm text-gray-500">{item.title}</p>
              <h3 className="text-2xl font-bold mt-2">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart />
          {/* <ProfitLossChart /> */}
          <DailySalesChart />
          {/* <ExpenseChart /> */}
          <StockChart />
        </div>
      </div>
    );
  };

  export default DashboardHome;
