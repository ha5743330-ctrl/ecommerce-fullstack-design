import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAdmin } from "../hooks/useAdmin"; 

export default function Admin() {
  const { isAdmin, loading } = useAdmin();
  const [orders, setOrders] = useState([]);

  // Orders fetch karne ka function
  const fetchOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    setOrders(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin]);

  // Status update karne ka function
  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      alert("Order status updated to: " + newStatus);
      fetchOrders(); // List ko refresh karein taake UI update ho jaye
    } catch (error) {
      alert("Error updating status: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div className="text-red-500 font-bold p-10">Access Denied!</div>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>User Email:</strong> {order.userEmail}</p>
            <p className="mt-2">
                <strong>Status:</strong> 
                <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                    {order.status || "Pending"}
                </span>
            </p>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => updateStatus(order.id, "Shipped")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Mark as Shipped
              </button>
              <button 
                onClick={() => updateStatus(order.id, "Delivered")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
console.log("Admin Status:", isAdmin, "Loading:", loading);

if (loading) return <div>Loading...</div>;
if (!isAdmin) return <div className="text-red-500 font-bold p-10">Access Denied!</div>;