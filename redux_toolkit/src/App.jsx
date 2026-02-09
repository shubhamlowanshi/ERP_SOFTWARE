import { HashRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./dashboard-M/DashboardLayout";
import DashboardHome from "./dashboard-M/DashboardHome";

import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Billings from "./components/Billings";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from "./components/Customers";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <><ToastContainer position="top-right" autoClose={3000} />
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="sales" element={<Sales />} />
          <Route path="billings" element={<Billings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
   
    </>
  );
}

export default App;
