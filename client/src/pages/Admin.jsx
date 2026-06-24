import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useAdmin } from "../hooks/useAdmin";

export default function Admin() {
  const { isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "", category: "" });

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
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) {
      return alert("Please fill all fields, including image URL and category!");
    }
    await addDoc(collection(db, "products"), { 
      ...newProduct, 
      price: Number(newProduct.price) 
    });
    setNewProduct({ name: "", price: "", image: "", category: "" });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {["orders", "products"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-8 py-2 rounded-lg font-bold transition ${activeTab === tab ? "bg-blue-600 text-white shadow-lg" : "bg-white text-gray-600 shadow"}`}>
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
                  <p className="text-gray-500">Status: <span className="text-blue-600 font-semibold">{o.status || "Pending"}</span></p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(o.id, "Shipped")} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold hover:bg-green-200">Shipped</button>
                  <button onClick={() => updateStatus(o.id, "Delivered")} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200">Delivered</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products View */}
        {activeTab === "products" && (
          <div>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input placeholder="Product Name" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} value={newProduct.name} />
              <input type="number" placeholder="Price" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} value={newProduct.price} />
              <input placeholder="Image URL" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} value={newProduct.image} />
              <select className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} value={newProduct.category}>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
              <button onClick={addProduct} className="col-span-1 lg:col-span-4 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">+ Add New Product</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow-lg border">
                  <img src={p.image} alt={p.name} className="h-40 w-full object-cover rounded-lg mb-4" />
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500">Category: {p.category}</p>
                  <p className="text-blue-600 font-bold mb-4">${p.price}</p>
                  <button onClick={() => deleteProduct(p.id)} className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100">Delete Product</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}