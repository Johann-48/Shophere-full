import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { token, role } = useAuth();

  console.log("🔒 ProtectedRoute:");
  console.log("Token:", token);
  console.log("Role atual:", role);
  console.log("Role necessário:", requiredRole);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
