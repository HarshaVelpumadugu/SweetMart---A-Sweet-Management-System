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
        .then((res) => setUser(res.data.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    toast.success("Login successful!");
    localStorage.setItem("sweetmart_token", res.data.data.token);

    const me = await api.get("/auth/me");
    setUser(me.data.data);
  };

  // Register
  const register = async (payload) => {
    await api.post("/auth/register", payload);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("sweetmart_token");
    setUser(null);
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
