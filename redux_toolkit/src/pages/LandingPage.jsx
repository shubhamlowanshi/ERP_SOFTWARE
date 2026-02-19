import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
             VyapaarX
          </h1>

          <div className="flex gap-6 items-center">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 transition">
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-28 text-center">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Stop Using Registers. <br /> Start Using Smart System.
          </motion.h2>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mt-6 mb-10">
            Inventory • Billing • Reports • Profit Tracking —  
            sab kuch ek hi jagah.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 active:scale-95 transition"
            >
              Start Free →
            </Link>

            <Link
              to="/login"
              className="border border-white px-8 py-3 rounded-xl hover:bg-white hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "5,000+", label: "Active Shops" },
            { number: "₹10Cr+", label: "Monthly Billing" },
            { number: "99.9%", label: "Uptime" },
            { number: "24/7", label: "Cloud Access" },
          ].map((stat, i) => (
            <div key={i}>
              <h4 className="text-3xl font-bold text-blue-600">{stat.number}</h4>
              <p className="text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-6">
            Clear Dashboard. Clear Business.
          </h3>

          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Real-time sales insights. Clean UI. No confusion.
          </p>

          <div className="rounded-2xl overflow-hidden shadow-2xl border">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
              alt="Dashboard Preview"
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-14">
            Everything You Need
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
                desc: "Professional invoices instantly",
                icon: "🧾",
              },
              {
                title: "Profit Tracking",
                desc: "Daily & monthly performance reports",
                icon: "📊",
              },
              {
                title: "Secure Login",
                desc: "Encrypted & protected data",
                icon: "🔐",
              },
              {
                title: "Cloud Based",
                desc: "Access anywhere anytime",
                icon: "☁️",
              },
              {
                title: "Scalable",
                desc: "1 shop ho ya 100 — no issue",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all border"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-blue-50 py-24 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold mb-14">
            Loved by Business Owners
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ramesh Kirana",
                review: "Daily profit clear dikhta hai. Ab tension zero.",
              },
              {
                name: "City Medical",
                review: "Low stock alert game changer hai.",
              },
              {
                name: "Modern Hardware",
                review: "Billing speed 5x fast ho gaya.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow border">
                <p className="text-gray-600 mb-4">“{item.review}”</p>
                <h4 className="font-semibold">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h3 className="text-3xl font-bold mb-6">
          Ready to Upgrade Your Dukaan?
        </h3>

        <p className="mb-8 text-blue-100">
          30 second signup. Zero risk.
        </p>

        <Link
          to="/register"
          className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-100 transition"
        >
          Create Free Account →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <h4 className="text-white font-semibold mb-4"> VyapaarX</h4>
            <p>Smart ERP for Indian businesses.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>Features</li>
              <li>Security</li>
              <li>Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Support</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>Privacy</li>
              <li>Terms</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-12 text-xs text-gray-500">
          © 2026  VyapaarX · Built for Bharat 🇮🇳
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
