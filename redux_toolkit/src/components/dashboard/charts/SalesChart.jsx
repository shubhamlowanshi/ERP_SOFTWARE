import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const res = await api.get("/billing/monthly-sales");
        setChartData(res.data);
      } catch (err) {
        console.error("Monthly chart error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlySales();
  }, []);

  if (loading) return <p className="text-gray-500">Loading chart…</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Monthly Sales</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
