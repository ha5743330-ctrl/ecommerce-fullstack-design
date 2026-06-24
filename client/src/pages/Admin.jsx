import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAdmin } from "../hooks/useAdmin";

export default function Admin() {
  const { isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, "products"));
    setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Fill fields!");
    await addDoc(collection(db, "products"), { ...newProduct, price: Number(newProduct.price) });
    setNewProduct({ name: "", price: "", image: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const updateStatus = async (orderId, status) => {
    await updateDoc(doc(db, "orders", orderId), { status });
    fetchOrders();
  };

  if (loading) return <div className="p-20 text-center text-xl">Loading Admin Dashboard...</div>;
  if (!isAdmin) return <div className="p-20 text-red-600 text-center text-2xl font-bold">Access Denied!</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Admin Panel</h1>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8">
          {["orders", "products"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 shadow"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{o.userEmail}</p>
                  <p className="text-gray-500">Status: <span className="text-blue-600">{o.status || "Pending"}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(o.id, "Shipped")} className="px-3 py-1 bg-green-100 text-green-700 rounded-md">Shipped</button>
                  <button onClick={() => updateStatus(o.id, "Delivered")} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md">Delivered</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products View */}
        {activeTab === "products" && (
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 flex flex-wrap gap-4">
              <input placeholder="Name" className="border p-2 rounded flex-1" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} value={newProduct.name} />
              <input type="number" placeholder="Price" className="border p-2 rounded w-24" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} value={newProduct.price} />
              <button onClick={addProduct} className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">+ Add Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                  <h3 className="font-bold text-xl">{p.name}</h3>
                  <p className="text-gray-600 mb-4">${p.price}</p>
                  <button onClick={() => deleteProduct(p.id)} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}