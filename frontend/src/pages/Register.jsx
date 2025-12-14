import { useState } from "react";
import { api } from "../api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/auth/register", form);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8ffe8] px-4 sm:px-6 py-8 sm:py-12">
      <form
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
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
              type="text"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
              placeholder="Create a password"
              type="password"
              required
              minLength={6}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              className="w-full border border-gray-300 p-3 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              value={form.role}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-base sm:text-lg font-semibold mt-6 sm:mt-8 transition-colors duration-200 active:scale-95 transform">
          Register
        </button>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm sm:text-base text-green-700 hover:text-green-800 font-medium"
          >
            Already have an account? Login
          </a>
        </div>
      </form>
    </div>
  );
}
