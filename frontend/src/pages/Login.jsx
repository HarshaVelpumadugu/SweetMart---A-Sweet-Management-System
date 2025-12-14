import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();

    await login(form.email, form.password);

    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8ffe8] px-4 sm:px-6 py-8 sm:py-12">
      <motion.form
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-md"
        onSubmit={submit}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 sm:mb-8 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              type="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              type="password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold mt-6 sm:mt-8 transition-colors duration-200 active:scale-95 transform">
          Login
        </button>

        <div className="mt-6 text-center">
          <a
            href="/signup"
            className="text-sm sm:text-base text-green-700 hover:text-green-800 font-medium"
          >
            Don't have an account? Sign up
          </a>
        </div>
      </motion.form>
    </div>
  );
}
