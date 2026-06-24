import React, { useState } from "react";
import { auth, db } from "../firebase"; // 'db' import karna zaroori hai
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Firebase Auth se login karein
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Firestore se user ka role check karein
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        toast.success("Welcome back!");

        // 3. Role ke hisaab se redirect karein
        if (userData.role === "admin") {
          navigate("/admin"); // Agar admin hai
        } else {
          navigate("/"); // Agar normal user hai
        }
      } else {
        // Agar user ka record Firestore mein nahi hai (default user)
        navigate("/");
      }
    } catch (error) {
      toast.error("Login fail hua: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-lg rounded-xl w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input className="border p-2 w-full mb-3 rounded" type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-3 rounded" type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-gray-900 text-white w-full p-2 rounded font-semibold hover:bg-gray-800">Login</button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Naya account chahiye? <Link to="/signup" className="underline font-bold">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}