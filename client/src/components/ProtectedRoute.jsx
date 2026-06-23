import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({ children }) {
  // Agar user login nahi hai (null), toh Login page par bhej do
  return auth.currentUser ? children : <Navigate to="/login" />;
}