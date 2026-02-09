import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium transition
     ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-700 hover:bg-gray-100"
    }`;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col fixed h-screen">
      {/* LOGO */}
      <div className="p-6 font-bold text-xl text-blue-600 border-b">
        ERP System
      </div>

      {/* USER INFO */}
      <div className="px-6 py-4 border-b flex items-center gap-3">
        {/* USER LOGO */}
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white
                        flex items-center justify-center font-bold text-lg">
          {getInitials(user?.ownerName || user?.businessName || "U")}
        </div>

        <div>
          <p className="font-semibold text-gray-800 leading-tight">
            {user?.ownerName || user?.businessName}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="." end className={linkClass}>Dashboard</NavLink>
        <NavLink to="inventory" className={linkClass}>Inventory</NavLink>
        <NavLink to="sales" className={linkClass}>Sales</NavLink>
        <NavLink to="billings" className={linkClass}>Billing</NavLink>
        <NavLink to="reports" className={linkClass}>Reports</NavLink>
        <NavLink to="settings" className={linkClass}>Settings</NavLink>
        <NavLink to="customers" className={linkClass}>
          Customers
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2
                     text-red-600 font-semibold rounded-lg
                     hover:bg-red-50 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
