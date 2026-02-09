// import React, { useEffect, useState } from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import api from "../../../api/axios";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const ProfitLossChart = ({ filter = "weekly" }) => {
//   const [labels, setLabels] = useState([]);
//   const [values, setValues] = useState([]);
//   const [netProfit, setNetProfit] = useState(0);

//   useEffect(() => {
//     fetchProfitLoss();
//   }, [filter]);

//   const fetchProfitLoss = async () => {
//     try {
//       const res = await api.get(
//         `/reports/profit-loss?filter=${filter}`
//       );
//       setLabels(res.data.labels);
//       setValues(res.data.values);
//       setNetProfit(res.data.netProfit);
//     } catch (err) {
//       console.error("Profit/Loss fetch error", err);
//     }
//   };

//   const chartData = {
//     labels,
//     datasets: [
//       {
//         label: "Profit / Loss",
//         data: values,
//         borderColor: "#22c55e",
//         backgroundColor: "rgba(34,197,94,0.15)",
//         tension: 0.4,
//         pointRadius: 6,
//         pointBackgroundColor: values.map((v) =>
//           v < 0 ? "#ef4444" : "#22c55e"
//         ),
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: (ctx) =>
//             `${ctx.raw >= 0 ? "Profit" : "Loss"}: ₹${Math.abs(
//               ctx.raw
//             )}`,
//         },
//       },
//       legend: { display: false },
//     },
//     scales: {
//       y: { beginAtZero: true },
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">
//           Profit & Loss ({filter})
//         </h2>

//         <span
//           className={`font-bold ${
//             netProfit >= 0 ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           Net {netProfit >= 0 ? "Profit" : "Loss"}: ₹
//           {Math.abs(netProfit)}
//         </span>
//       </div>

//       <Line data={chartData} options={options} />
//     </div>
//   );
// };

// export default ProfitLossChart;
