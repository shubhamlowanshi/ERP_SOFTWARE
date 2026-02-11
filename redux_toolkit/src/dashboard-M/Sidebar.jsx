import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUsers,
  FiLogOut
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
     ${
       isActive
         ? "bg-blue-600 text-white shadow-md scale-[0.98]"
         : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
     }`;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside
      className="w-64 bg-white border-r hidden md:flex flex-col fixed h-screen
                 shadow-sm"
    >
      {/* LOGO */}
      <div className="p-6 font-bold text-2xl text-blue-600 border-b tracking-wide">
        🚀 ERP System
      </div>

      {/* USER INFO */}
      <div className="px-6 py-5 border-b flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white">
        <div
          className="w-12 h-12 rounded-full bg-blue-600 text-white
                     flex items-center justify-center font-bold text-lg
                     shadow-md"
        >
          {getInitials(user?.ownerName || user?.businessName || "U")}
        </div>

        <div className="overflow-hidden">
          <p className="font-semibold text-gray-800 leading-tight truncate">
            {user?.ownerName || user?.businessName || "ERP User"}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || "welcome@erp.com"}
          </p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="." end className={linkClass}>
          <FiHome /> Dashboard
        </NavLink>

        <NavLink to="inventory" className={linkClass}>
          <FiBox /> Inventory
        </NavLink>

        <NavLink to="sales" className={linkClass}>
          <FiShoppingCart /> Sales
        </NavLink>

        <NavLink to="billings" className={linkClass}>
          <FiFileText /> Billing
        </NavLink>

        <NavLink to="reports" className={linkClass}>
          <FiBarChart2 /> Reports
        </NavLink>

        <NavLink to="customers" className={linkClass}>
          <FiUsers /> Customers
        </NavLink>

        <NavLink to="settings" className={linkClass}>
          <FiSettings /> Settings
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3
                     text-red-600 font-semibold rounded-xl
                     hover:bg-red-50 transition-all"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
