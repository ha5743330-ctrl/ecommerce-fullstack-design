import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { auth, db } from "./firebase"; // db import karein
import { doc, getDoc } from "firebase/firestore";
import { CartProvider } from "./context/CartContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <CartProvider>
      <Toaster position="top-right" />
      <Navbar />
      // App.jsx mein Routes wala hissa aise change karein:

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<ProductListing />} />
  <Route path="/products/:id" element={<ProductDetails />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/signup" element={<Signup />} /> 
  <Route path="/login" element={<Login />} />
  
  <Route path="/checkout" element={
    <ProtectedRoute loading={loading}> <Checkout /> </ProtectedRoute>
  } />

  {/* Admin Route - Ab ye perfectly protected hai */}
  <Route path="/admin" element={
    <ProtectedRoute adminOnly={true} userRole={userRole} loading={loading}>
      <Admin />
    </ProtectedRoute>
  } />
</Routes>
    </CartProvider>
  );
}