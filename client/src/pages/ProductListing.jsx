import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx"; 
import toast from 'react-hot-toast'; 
import { db } from "../firebase.js"; 
import { collection, getDocs } from "firebase/firestore";

const CATEGORIES = ["All", "Footwear", "Accessories", "Electronics", "Travel"];

export default function ProductListing() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default"); 
  const { addToCart, searchQuery } = useCart(); 
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => (selectedCategory === "All" || p.category === selectedCategory) && 
                 p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-10 gap-6">
          <h1 className="text-4xl font-black text-gray-900">{selectedCategory} Products</h1>
          
          <div className="flex flex-wrap gap-3">
             <select onChange={(e) => setSortOrder(e.target.value)} className="bg-white border p-2 rounded-lg text-sm">
                <option value="default">Sort by</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
             </select>
          </div>
        </div>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border w-fit">
            {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} 
                    className={`px-6 py-2 rounded-xl font-bold transition ${selectedCategory === cat ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>
                    {cat}
                </button>
            ))}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1,2,3,4].map(n => <div key={n} className="h-80 bg-gray-200 animate-pulse rounded-2xl"></div>)}
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all border p-3 group">
                <Link to={`/products/${product.id}`}>
                  <img src={product.image} className="w-full h-60 object-cover rounded-xl" />
                </Link>
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-400 uppercase">{product.category}</p>
                  <h3 className="font-bold text-gray-800 my-2">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-black text-blue-600">${product.price}</span>
                    <button onClick={() => {addToCart(product); toast.success("Added!");}} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}