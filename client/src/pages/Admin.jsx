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
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (isAdmin) { fetchOrders(); fetchProducts(); }
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
    if (!newProduct.name || !newProduct.price || !newProduct.category || !newProduct.image) return alert("Fill all fields!");
    await addDoc(collection(db, "products"), { ...newProduct, price: Number(newProduct.price) });
    setNewProduct({ name: "", price: "", image: "", category: "" });
    fetchProducts();
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "products", editingProduct.id), {
      name: editingProduct.name,
      price: Number(editingProduct.price),
      image: editingProduct.image,
      category: editingProduct.category,
    });
    setEditingProduct(null);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    fetchOrders();
  };

  if (loading) return <div className="p-20 text-center text-xl">Loading Admin Dashboard...</div>;
  if (!isAdmin) return <div className="p-20 text-red-600 text-center text-2xl font-bold">Access Denied!</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab("orders")} className={`px-8 py-2 rounded-xl font-bold ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white shadow"}`}>ORDERS</button>
          <button onClick={() => setActiveTab("products")} className={`px-8 py-2 rounded-xl font-bold ${activeTab === "products" ? "bg-blue-600 text-white" : "bg-white shadow"}`}>PRODUCTS</button>
        </div>

        {/* Orders View */}
        {activeTab === "orders" && (
          <div className="grid gap-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
                <div>
                  <p className="font-bold">{o.userEmail}</p>
                  <p className="text-gray-500">Status: {o.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateOrderStatus(o.id, "Shipped")} className="px-4 py-2 bg-green-100 rounded-lg">Mark Shipped</button>
                  <button onClick={() => updateOrderStatus(o.id, "Delivered")} className="px-4 py-2 bg-blue-100 rounded-lg">Mark Delivered</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products View */}
        {activeTab === "products" && (
          <div>
            <div className="bg-white p-6 rounded-2xl shadow mb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input placeholder="Name" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} value={newProduct.name} />
              <input type="number" placeholder="Price" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} value={newProduct.price} />
              <input placeholder="Image URL" className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} value={newProduct.image} />
              <select className="border p-2 rounded" onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} value={newProduct.category}>
                <option value="">Select Category</option>
                <option>Electronics</option><option>Clothing</option><option>Accessories</option><option>Footwear</option><option>Travel</option>
              </select>
              <button onClick={addProduct} className="lg:col-span-4 bg-blue-600 text-white p-2 rounded-lg font-bold">Add Product</button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow border">
                  <img src={p.image} className="h-40 w-full object-cover rounded" />
                  <h3 className="font-bold mt-2">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="font-bold text-blue-600">${p.price}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setEditingProduct(p)} className="flex-1 bg-yellow-500 text-white py-1 rounded">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-1 rounded">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <form onSubmit={updateProduct} className="bg-white p-6 rounded-2xl w-full max-w-md flex flex-col gap-3">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <input className="border p-2 rounded" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
              <input type="number" className="border p-2 rounded" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
              <input className="border p-2 rounded" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
              <select className="border p-2 rounded" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}>
                <option>Electronics</option><option>Clothing</option><option>Accessories</option><option>Footwear</option><option>Travel</option>
              </select>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded">Save</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-400 text-white p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}