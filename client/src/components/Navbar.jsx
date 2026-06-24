import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { auth } from "../firebase.js";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useAdmin } from "../hooks/useAdmin.js"; // Admin check hook
import toast from "react-hot-toast";

export default function Navbar() {
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout ho gaye!");
      setIsOpen(false);
    } catch (error) { toast.error("Error!"); }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="bg-gray-900 text-white px-2.5 py-1 rounded-lg text-lg">E</span> SHOP
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">Home</Link>
            {isAdmin && <Link to="/admin" className="text-sm font-semibold text-blue-600">Admin</Link>}
            
            {user ? (
              <button onClick={handleLogout} className="text-sm font-semibold text-red-600">Logout</button>
            ) : (
              <div className="flex gap-4 items-center">
                <Link to="/login" className="text-sm font-semibold text-gray-600">Login</Link>
                <Link to="/signup" className="text-sm font-semibold text-white bg-gray-900 px-4 py-2 rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Cart & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {cartItems.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
            </Link>

            {/* Hamburger Button */}
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              <div className="space-y-1.5"><div className="w-6 h-0.5 bg-gray-900"></div><div className="w-6 h-0.5 bg-gray-900"></div></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t p-4 flex flex-col gap-4">
          <Link to="/" className="font-bold" onClick={() => setIsOpen(false)}>Home</Link>
          {isAdmin && <Link to="/admin" className="font-bold text-blue-600" onClick={() => setIsOpen(false)}>Admin</Link>}
          {user ? (
            <button onClick={handleLogout} className="font-bold text-red-600 text-left">Logout</button>
          ) : (
            <>
              <Link to="/login" className="font-bold" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" className="font-bold text-blue-600" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}