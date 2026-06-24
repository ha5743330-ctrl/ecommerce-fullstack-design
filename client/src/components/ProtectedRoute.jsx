import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children, adminOnly = false, userRole, loading }) {
  if (loading) return <div>Loading...</div>;

  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}