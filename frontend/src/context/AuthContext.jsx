import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sweetmart_token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data.data);
        })
        .catch((error) => {
          console.error("Auth verification failed:", error);
          // Silent fail - don't show toast for automatic auth checks
          localStorage.removeItem("sweetmart_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("sweetmart_token", res.data.data.token);

      const me = await api.get("/auth/me");
      setUser(me.data.data);

      toast.success(`Welcome back, ${me.data.data.name || "User"}! 👋`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
      throw error; // Re-throw to handle in component
    }
  };

  // Register
  const register = async (payload) => {
    try {
      await api.post("/auth/register", payload);
      toast.success("Account created successfully! Please login. 🎉");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
      throw error; // Re-throw to handle in component
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("sweetmart_token");
    setUser(null);
    toast.success("Logged out successfully. See you soon! 👋");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        role: user?.role || "guest",
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
