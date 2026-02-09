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
        const res = await api.get("/billing/daily-sales"); // ✅ backend route
        // Convert backend aggregation to chart-friendly format
        const chartData = [];

        res.data.forEach(product => {
          product.dailySales.forEach(day => {
            const existing = chartData.find(d => d.date === day.date);
            if (existing) {
              existing[product._id] = day.sales;
            } else {
              chartData.push({ date: day.date, [product._id]: day.sales });
            }
          });
        });

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

  // Get all product keys for chart
  const productKeys = Object.keys(data[0]).filter(k => k !== "date");

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
              stroke={`hsl(${i*60}, 70%, 50%)`}
              fill={`hsl(${i*60}, 70%, 80%)`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySalesChart;
