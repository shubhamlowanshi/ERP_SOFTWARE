import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../../api/axios";

const StockChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      const res = await api.get("/inventory");
      const chartData = res.data.map(item => ({
        product: item.productName,
        stock: item.stock,
      }));
      setData(chartData);
    };
    fetchStock();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Stock Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="product" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
