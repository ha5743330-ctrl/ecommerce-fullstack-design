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
  const [editingProduct, setEditingProduct] = useState(null); // Edit modal state

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

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!isAdmin) return <div className="p-20 text-center text-red-600 font-bold">Access Denied!</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-gray-900">Admin Dashboard</h1>
        
        <div className="flex gap-4 mb-8">
          {["orders", "products"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2 rounded-xl font-bold ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white shadow"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div>
            {/* Add Product Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input placeholder="Name" className="border p-3 rounded-lg" onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} value={newProduct.name} />
              <input type="number" placeholder="Price" className="border p-3 rounded-lg" onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} value={newProduct.price} />
              <input placeholder="Image URL" className="border p-3 rounded-lg" onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} value={newProduct.image} />
              <select className="border p-3 rounded-lg" onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} value={newProduct.category}>
                <option value="">Category</option>
                <option>Electronics</option><option>Clothing</option><option>Accessories</option>
              </select>
              <button onClick={addProduct} className="lg:col-span-4 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">Add New Product</button>
            </div>

            {/* Product List */}
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow border">
                  <img src={p.image} className="h-40 w-full object-cover rounded-xl mb-4" />
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{p.category}</p>
                  <p className="text-blue-600 font-bold mb-4">${p.price}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingProduct(p)} className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-bold">Edit</button>
                    <button onClick={() => deleteProduct(p.id)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <form onSubmit={updateProduct} className="bg-white p-8 rounded-2xl w-full max-w-md flex flex-col gap-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <input className="border p-2 rounded" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
              <input type="number" className="border p-2 rounded" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
              <input className="border p-2 rounded" value={editingProduct.image} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-600 text-white p-2 rounded">Save Changes</button>
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 bg-gray-400 text-white p-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}