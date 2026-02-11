import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen text-gray-800 bg-gradient-to-b from-white to-blue-50">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
            DukaanERP
          </h1>

          <div className="flex gap-5 items-center">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 transition"
            >
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
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">

          <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
            Made for Indian Businesses 🇮🇳
          </span>

          <h2 className="text-4xl md:text-6xl font-extrabold mt-6 mb-6 leading-tight">
            Stop Using Registers.  
            <br /> Start Using Brain.
          </h2>

          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Inventory • Billing • Profit • Reports —  
            ek hi jagah, bina dimaag kharab kiye.
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

      {/* TRUST STRIP */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-gray-500">
          Trusted by Kirana • Medical • Hardware • Fashion Stores
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-6 py-24 max-w-6xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-6">
          Real Problems → Simple Solutions
        </h3>

        <p className="text-gray-600 max-w-3xl mx-auto">
          Register kho jata hai, Excel slow ho jata hai,  
          hisaab kabhi match nahi hota.  
          Isliye humne banaya ek simple system —  
          jo dukaan wale bhai ko bhi samajh aaye.
        </p>
      </section>

      {/* FEATURES */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-14">
            Power Without Headache
          </h3>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Inventory Management",
                desc: "Real-time stock tracking & low stock alerts",
                icon: "📦",
              },
              {
                title: "Sales & Billing",
                desc: "Professional invoices in 10 seconds",
                icon: "🧾",
              },
              {
                title: "Profit & Loss",
                desc: "Daily, monthly, yearly clear numbers",
                icon: "📊",
              },
              {
                title: "Secure Login",
                desc: "Your data = your control",
                icon: "🔐",
              },
              {
                title: "Cloud Based",
                desc: "Dukan se ghar tak same data",
                icon: "☁️",
              },
              {
                title: "Scalable",
                desc: "1 shop ho ya 10, sab handle",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all border"
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
      <section className="px-6 py-24 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-3xl font-bold mb-6">
          Time to Become Smart Dukandaar 😄
        </h3>

        <p className="text-gray-600 mb-8">
          30 second me account banao,  
          5 minute me pura system chalao.
        </p>

        <Link
          to="/register"
          className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition"
        >
          Create Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-6">
        © 2026 DukaanERP · Built with chai ☕ for real businesses
      </footer>
    </div>
  );
};

export default LandingPage;
