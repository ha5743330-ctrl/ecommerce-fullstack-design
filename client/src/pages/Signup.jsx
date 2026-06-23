import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account ban gaya!");
      navigate("/"); // Home page par bhejo
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSignup} className="p-8 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <input className="border p-2 w-full mb-3" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 w-full mb-3" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-gray-900 text-white w-full p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}