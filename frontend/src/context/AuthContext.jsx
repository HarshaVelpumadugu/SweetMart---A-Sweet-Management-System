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

      toast.success(`Welcome back, ${me.data.data.name || "User"}! 👋`, {
        duration: 4000,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Invalid email or password. Please try again.",
        {
          duration: 5000,
        }
      );
      throw error;
    }
  };

  // Register
  const register = async (payload) => {
    try {
      await api.post("/auth/register", payload);
      toast.success("Account created successfully! Please login. 🎉", {
        duration: 4000,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create account. Please try again.",
        {
          duration: 5000,
        }
      );
      throw error;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("sweetmart_token");
    setUser(null);
    toast.success("Logged out successfully. See you soon! 👋", {
      duration: 3000,
    });
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
