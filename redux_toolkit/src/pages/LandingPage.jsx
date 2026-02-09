import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-gray-800 bg-gray-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">ERP System</h1>

          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            All-in-One ERP for Smart Businesses
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Inventory, billing, sales, profit & loss — manage your entire
            business from one powerful dashboard.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="border border-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 py-24 max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-semibold mb-6">
          Built for Real-World Businesses
        </h3>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Our ERP system helps small and medium businesses move away from manual
          registers and Excel sheets to a fast, secure, cloud-based system.
        </p>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-100 px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-semibold text-center mb-14">
            Core Features
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Inventory Management",
                desc: "Real-time stock tracking & alerts",
                icon: "📦",
              },
              {
                title: "Sales & Billing",
                desc: "Invoices, customers & payments",
                icon: "🧾",
              },
              {
                title: "Profit & Loss",
                desc: "Clear monthly & yearly insights",
                icon: "📊",
              },
              {
                title: "Secure Login",
                desc: "Role-based access & protection",
                icon: "🔐",
              },
              {
                title: "Cloud Based",
                desc: "Access anytime, anywhere",
                icon: "☁️",
              },
              {
                title: "Scalable",
                desc: "Grows with your business",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-white">
        <h3 className="text-3xl font-semibold mb-6">
          Ready to Run Your Business Smarter?
        </h3>
        <p className="text-gray-600 mb-8">
          Create your ERP account and take control today.
        </p>
        <Link
          to="/register"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Create Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-6">
        © 2026 ERP Software · Built for growing businesses
      </footer>
    </div>
  );
};

export default LandingPage;
