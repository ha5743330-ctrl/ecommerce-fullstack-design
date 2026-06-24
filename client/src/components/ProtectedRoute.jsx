import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children, adminOnly = false, userRole, loading }) {
  // 1. Agar abhi bhi load ho raha hai, to wait karein
  if (loading) return <div>Loading...</div>;

  // 2. Agar login nahi hai, login page bhejo
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Agar adminOnly route hai, aur role "admin" nahi hai
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Sab sahi hai, page dikhao
  return children;
}