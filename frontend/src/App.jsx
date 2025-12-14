import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CategoryPage from "./pages/CategoryPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SweetForm from "./pages/SweetForm.jsx";
import Cart from "./pages/Cart.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <div>
            <Routes>
              {/* Public Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={["admin", "owner"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/sweet/new"
                element={
                  <ProtectedRoute roles={["admin", "owner"]}>
                    <SweetForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/sweet/:id"
                element={
                  <ProtectedRoute roles={["admin", "owner"]}>
                    <SweetForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute roles={["user", "admin", "owner"]}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
