const Navbar = () => {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, Admin
        </span>
        <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;
