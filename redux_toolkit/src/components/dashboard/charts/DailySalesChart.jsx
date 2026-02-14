import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

const DailySalesChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailySales = async () => {
      try {
        const res = await api.get("/billing/daily-sales");

        const dateMap = {};
        const allProducts = new Set();

        res.data.forEach(product => {
          allProducts.add(product._id);

          product.dailySales.forEach(day => {
            if (!dateMap[day.date]) {
              dateMap[day.date] = { date: day.date };
            }

            dateMap[day.date][product._id] = day.sales;
          });
        });

        // convert to array
        const chartData = Object.values(dateMap).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch daily sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailySales();
  }, []);

  if (loading) return <p>Loading chart…</p>;
  if (!data.length) return <p>No sales data yet</p>;

  // 🔥 IMPORTANT FIX
  // Get all unique product keys from entire dataset (not only first item)
  const productKeys = Array.from(
    new Set(
      data.flatMap(item =>
        Object.keys(item).filter(k => k !== "date")
      )
    )
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Daily Sales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          {productKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={`hsl(${i * 60}, 70%, 50%)`}
              fill={`hsl(${i * 60}, 70%, 80%)`}
              fillOpacity={0.4}
              connectNulls
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
