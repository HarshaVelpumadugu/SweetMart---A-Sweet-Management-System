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
import SweetDetailPage from "./pages/SweetDetail.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AdminOrders from "./pages/AdminOrderPage.jsx";
import MyOrders from "./pages/UserOrdersPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sweet/:id" element={<SweetDetailPage />} />
            <Route path="/search" element={<SearchPage />} />

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
              path="/admin/orders"
              element={
                <ProtectedRoute roles={["admin", "owner"]}>
                  <AdminOrders />
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
                <ProtectedRoute roles={["user"]}>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute roles={["user"]}>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
