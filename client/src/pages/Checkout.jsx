import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { db, auth } from "../firebase.js"; 
import { addDoc, collection } from "firebase/firestore"; 
import toast from "react-hot-toast"; 

export default function Checkout() {
  const { cartItems, setCartItems } = useCart();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        items: cartItems,
        total: subtotal + 15,
        createdAt: new Date(),
        status: "Pending"
      };
      await addDoc(collection(db, "orders"), orderData);

      setCartItems([]); 
      setIsOrderPlaced(true);
      toast.success("Order Successfully Placed!");
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900">Thank You! 🎉</h2>
          <p className="text-gray-600 mt-2">Aapka order successfully place ho gaya hai.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {/* Form fields wahi rahengi... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input required type="text" className="w-full mt-1 p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input disabled value={auth.currentUser?.email || ""} className="w-full mt-1 p-2 border rounded-lg bg-gray-100" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
              <textarea required className="w-full mt-1 p-2 border rounded-lg" rows="3"></textarea>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-lg font-bold">Total Payable: ${subtotal + 15}</p>
            <button 
              disabled={loading}
              type="submit"
              className={`w-full mt-4 py-3 rounded-lg font-bold ${loading ? "bg-gray-400" : "bg-gray-900 text-white hover:bg-gray-800"}`}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}