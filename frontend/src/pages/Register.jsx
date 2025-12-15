import { useState } from "react";
import { api } from "../api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      await api.post("/auth/register", form);
      toast.success("Account created successfully! Please login. 🎉", {
        duration: 4000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500); // Increased from 1000ms to give user time to see toast
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
        {
          duration: 5000,
        }
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8ffe8] px-4 sm:px-6 py-8 sm:py-12">
      <motion.form
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 sm:p-8 md:p-10 shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl w-full max-w-md"
        onSubmit={submit}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6 sm:mb-8 text-center">
          Register
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your full name"
              type="text"
              required
              disabled={isSubmitting}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter your email"
              type="email"
              required
              disabled={isSubmitting}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Create a password"
              type="password"
              required
              minLength={6}
              disabled={isSubmitting}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              value={form.role}
              disabled={isSubmitting}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold mt-6 sm:mt-8 transition-all duration-200 ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-700 hover:bg-green-800 text-white active:scale-95 transform"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Register"
          )}
        </button>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm sm:text-base text-green-700 hover:text-green-800 font-medium"
          >
            Already have an account? Login
          </a>
        </div>
      </motion.form>
    </div>
  );
}
