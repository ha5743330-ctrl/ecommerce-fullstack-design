import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children, adminOnly = false, userRole }) {
  // 1. Check karein ke user login hai ya nahi
  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  // 2. Agar page sirf admin ke liye hai aur user admin nahi hai
  if (adminOnly && userRole !== "admin") {
    return <Navigate to="/" />; // Home page par bhej dein
  }

  // 3. Agar sab sahi hai, to page dikha dein
  return children;
}