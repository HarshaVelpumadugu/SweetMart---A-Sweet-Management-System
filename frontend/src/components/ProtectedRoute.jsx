import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-green-700 text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
